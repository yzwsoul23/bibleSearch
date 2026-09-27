"""
全量抓取 BibleGateway CUVMPS 段落小标题。
策略：
1. 每章一个 URL（如 Matthew+5）
2. 解析 passage-content 区域，h3 标题 → 后面 verse 关联
3. 中间结果按书保存到 cache 目录
4. 最终输出 section_headings.json

BibleGateway 书名 URL 编码：
创世记 Genesis, 出埃及记 Exodus, ...
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

# ============================================================
# 书名映射（中文 → BibleGateway URL slug + 英文书名 + 章节数）
# ============================================================
BOOKS = [
    # 旧约
    ("创世纪", "Genesis", 50),
    ("出埃及记", "Exodus", 40),
    ("利未记", "Leviticus", 27),
    ("民数记", "Numbers", 36),
    ("申命记", "Deuteronomy", 34),
    ("约书亚记", "Joshua", 24),
    ("士师记", "Judges", 21),
    ("路得记", "Ruth", 4),
    ("撒母耳记上", "1-Samuel", 31),
    ("撒母耳记下", "2-Samuel", 24),
    ("列王纪上", "1-Kings", 22),
    ("列王纪下", "2-Kings", 25),
    ("历代志上", "1-Chronicles", 29),
    ("历代志下", "2-Chronicles", 36),
    ("以斯拉记", "Ezra", 10),
    ("尼希米记", "Nehemiah", 13),
    ("以斯帖记", "Esther", 10),
    ("约伯记", "Job", 42),
    ("诗篇", "Psalms", 150),
    ("箴言", "Proverbs", 31),
    ("传道书", "Ecclesiastes", 12),
    ("雅歌", "Song-of-Solomon", 8),
    ("以赛亚书", "Isaiah", 66),
    ("耶利米书", "Jeremiah", 52),
    ("耶利米哀歌", "Lamentations", 5),
    ("以西结书", "Ezekiel", 48),
    ("但以理书", "Daniel", 12),
    ("何西阿书", "Hosea", 14),
    ("约珥书", "Joel", 3),
    ("阿摩司书", "Amos", 9),
    ("俄巴底亚书", "Obadiah", 1),
    ("约拿书", "Jonah", 4),
    ("弥迦书", "Micah", 7),
    ("那鸿书", "Nahum", 3),
    ("哈巴谷书", "Habakkuk", 3),
    ("西番雅书", "Zephaniah", 3),
    ("哈该书", "Haggai", 2),
    ("撒迦利亚书", "Zechariah", 14),
    ("玛拉基书", "Malachi", 4),
    # 新约
    ("马太福音", "Matthew", 28),
    ("马可福音", "Mark", 16),
    ("路加福音", "Luke", 24),
    ("约翰福音", "John", 21),
    ("使徒行传", "Acts", 28),
    ("罗马书", "Romans", 16),
    ("哥林多前书", "1-Corinthians", 16),
    ("哥林多后书", "2-Corinthians", 13),
    ("加拉太书", "Galatians", 6),
    ("以弗所书", "Ephesians", 6),
    ("腓立比书", "Philippians", 4),
    ("歌罗西书", "Colossians", 4),
    ("帖撒罗尼迦前书", "1-Thessalonians", 5),
    ("帖撒罗尼迦后书", "2-Thessalonians", 3),
    ("提摩太前书", "1-Timothy", 6),
    ("提摩太后书", "2-Timothy", 4),
    ("提多书", "Titus", 3),
    ("腓利门书", "Philemon", 1),
    ("希伯来书", "Hebrews", 13),
    ("雅各书", "James", 5),
    ("彼得前书", "1-Peter", 5),
    ("彼得后书", "2-Peter", 3),
    ("约翰一书", "1-John", 5),
    ("约翰二书", "2-John", 1),
    ("约翰三书", "3-John", 1),
    ("犹大书", "Jude", 1),
    ("启示录", "Revelation", 22),
]

CACHE_DIR = 'scrape_cache'
os.makedirs(CACHE_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

def fetch_chapter(book_en, chapter, retries=3):
    """抓一本书的一章，返回 [(verse_num, title), ...]"""
    # BibleGateway 不认连字符 (1-Samuel 不行)，要替换成 + (1+Samuel)
    search_key = book_en.replace('-', '+')
    url = f"https://www.biblegateway.com/passage/?search={search_key}+{chapter}&version=CUVMPS"
    
    # 缓存检查
    cache_key = f"{book_en}_{chapter}"
    cache_path = os.path.join(CACHE_DIR, f"{cache_key}.json")
    if os.path.exists(cache_path):
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            if resp.status_code != 200:
                print(f"  ✗ {book_en} {chapter}: HTTP {resp.status_code}")
                time.sleep(2 + attempt * 2)
                continue
            
            soup = BeautifulSoup(resp.text, 'html.parser')
            passage = soup.find('div', class_='passage-content')
            if not passage:
                passage = soup.find('div', class_='version-CUVMPS')
                if not passage:
                    return []
            
            # 遍历内容，关联 h3 标题和 verse number
            results = {}  # verse_num -> title (去重，只保留第一个)
            
            current_title = None
            for el in passage.find_all(['h3', 'sup']):
                if el.name == 'h3':
                    text = el.get_text(strip=True)
                    if text and len(text) < 80 and not text.startswith('Preferences'):
                        current_title = text
                elif el.name == 'sup':
                    cls = el.get('class', [])
                    if cls and 'versenum' in cls:
                        m = re.search(r'(\d+)', el.get_text())
                        if m and current_title:
                            v = int(m.group(1))
                            if v not in results:
                                results[v] = current_title
            
            # 简化：只保留标题变化的"起始 verse"
            # 比如 results = {1: "标题A", 3: "标题A", 4: "标题B"}
            # 简化为 = {1: "标题A", 4: "标题B"} （相邻相同标题只保留第一个）
            sorted_v = sorted(results.keys())
            simplified = []
            prev_title = None
            for v in sorted_v:
                t = results[v]
                if t != prev_title:
                    simplified.append([v, t])
                    prev_title = t
            
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(simplified, f, ensure_ascii=False)
            
            return simplified
            
        except requests.exceptions.ConnectionError as e:
            wait = 3 + attempt * 3
            print(f"  ⚠ {book_en} {chapter}: 连接错误 (attempt {attempt+1}), 等 {wait}s: {e}")
            time.sleep(wait)
        except Exception as e:
            print(f"  ✗ {book_en} {chapter}: {e}")
            time.sleep(2)
    
    return []

def scrape_book(book_cn, book_en, chapters):
    """抓一本书的所有章节"""
    cache_path = os.path.join(CACHE_DIR, f"{book_en}_full.json")
    if os.path.exists(cache_path):
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    book_data = {}  # chapter -> [[verse, title], ...]
    for ch in range(1, chapters + 1):
        results = fetch_chapter(book_en, ch)
        if results:
            book_data[str(ch)] = results
        time.sleep(4.0)  # 限速，避免被封（4秒=277章约20分钟）
    
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(book_data, f, ensure_ascii=False, indent=2)
    
    return book_data

def main():
    output = {}
    total_titles = 0
    
    # 只跑新约（索引 39-65，共 27 卷）+ 已缓存的旧约继续用
    # 全量跑完后取消下面的切片即可
    books_to_scrape = BOOKS  # 跑全部 66 卷（带缓存断点续爬）
    
    for i, (cn, en, chapters) in enumerate(books_to_scrape):
        print(f"[{i+1}/66] {cn} ({en}) - {chapters} 章")
        book_data = scrape_book(cn, en, chapters)
        
        count = sum(len(v) for v in book_data.values())
        total_titles += count
        print(f"  → {count} 个段落标题")
        
        # 中文书名做 key
        output[cn] = book_data
    
    print(f"\n=== 完成！共 {total_titles} 个段落标题 ===")
    
    # 输出最终文件
    final = {
        "version": "1.0",
        "source": "BibleGateway CUVMPS (Chinese Union Version Modern Punctuation)",
        "description": "圣经段落小标题，每章内按节号关联",
        "books": output
    }
    
    with open('section_headings.json', 'w', encoding='utf-8') as f:
        json.dump(final, f, ensure_ascii=False, indent=2)
    
    print("已保存 section_headings.json")
    
    # 打印几个样本
    print("\n=== 样本 ===")
    for book in ["马太福音", "创世记", "诗篇"]:
        if book in output:
            print(f"\n{book}:")
            for ch in ["1", "5"] if book == "马太福音" else ["1"]:
                if ch in output[book]:
                    for v, t in output[book][ch][:5]:
                        print(f"  {ch}:{v} {t}")

if __name__ == '__main__':
    main()
