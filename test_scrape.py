"""
测试爬取 BibleGateway CUVMPS 的 HTML 结构。
先爬马太福音第5章，确认 h3 标题和节号的关联方式。
"""
import requests
from bs4 import BeautifulSoup
import re

# BibleGateway URL 格式：https://www.biblegateway.com/passage/?search=Matthew+5&version=CUVMPS
url = "https://www.biblegateway.com/passage/?search=Matthew+5&version=CUVMPS"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

print(f"正在请求: {url}")
resp = requests.get(url, headers=headers, timeout=15)
print(f"状态码: {resp.status_code}")
print(f"内容长度: {len(resp.text)}")

# 保存原始 HTML 供分析
with open('test_html.html', 'w', encoding='utf-8') as f:
    f.write(resp.text)
print("已保存 test_html.html")

soup = BeautifulSoup(resp.text, 'html.parser')

# 找 h3 标题
h3s = soup.find_all('h3')
print(f"\n=== 找到 {len(h3s)} 个 h3 标签 ===")
for h3 in h3s[:20]:
    text = h3.get_text(strip=True)
    # 看看有没有 verse 关联
    parent = h3.parent
    parent_cls = parent.get('class', [])
    prev_siblings = list(h3.previous_siblings)[:5]
    next_siblings = list(h3.next_siblings)[:5]
    
    # 查看 h3 下面的 verse
    print(f"\nH3: '{text}'")
    print(f"  parent: <{parent.name}> class={parent_cls}")
    
    # 找下一个 verse 数字
    # BibleGateway 用 <sup class="versenum"> 或者数字在链接里
    # 先看 soup 里有没有 verse 元素
    h3_el = h3
    next_verse_num = None
    sibling = h3_el.find_next_sibling(['span', 'sup', 'a', 'div', 'p'])
    if sibling:
        # 尝试在这个区域找 verse number
        pass
    
    # 看 h3 后面紧跟的内容里的第一个数字
    full_text_after = ""
    for el in h3.parent.find_all_next(['h3', 'p', 'span', 'sup'], limit=30):
        if el.name == 'h3' and el != h3:
            break
        full_text_after += " " + el.get_text()
    
    nums = re.findall(r'\b(\d{1,3})\b', full_text_after[:200])
    if nums:
        print(f"  附近数字: {nums[:5]}")

# 换个思路：找到整个 passage 区域
print("\n=== 分析 passage 结构 ===")
passage_div = soup.find('div', class_='passage-content')
if not passage_div:
    passage_div = soup.find('div', class_='result-text-style-normal')
if not passage_div:
    # 尝试其他 selector
    passage_div = soup.find('div', {'version':'CUVMPS'})
    if passage_div:
        passage_div = passage_div.parent
    else:
        print("没找到 passage div，尝试搜索...")
        # 搜索所有 div 中包含 h3 的
        for div in soup.find_all('div'):
            if div.find('h3') and div.find('sup'):
                passage_div = div
                print(f"找到候选 div: class={div.get('class')}")
                break

if passage_div:
    print(f"找到 passage div! class={passage_div.get('class')}")
    
    # 遍历子元素，关联 h3 和 verse
    current_title = None
    results = []
    
    for element in passage_div.find_all(['h3', 'p', 'div', 'span', 'sup']):
        if element.name == 'h3':
            current_title = element.get_text(strip=True)
            print(f"\n标题: {current_title}")
        
        # 找 verse number
        sup = element.find('sup', class_='versenum') if element.name != 'sup' else element
        if sup and sup.get('class') and 'versenum' in sup.get('class', []):
            verse_text = sup.get_text(strip=True)
            # 只取数字部分
            verse_num = re.search(r'(\d+)', verse_text)
            if verse_num:
                v = int(verse_num.group(1))
                print(f"  节号: {v}, 当前标题: {current_title}")
                results.append((v, current_title))
    
    print(f"\n=== 关联结果 ({len(results)} 条) ===")
    for v, t in results[:30]:
        print(f"  节 {v}: {t}")
else:
    print("没找到 passage div，HTML 结构可能不同")
    # 打印一些结构线索
    print("\n页面中的 div 类名 (前20个):")
    divs = soup.find_all('div', limit=50)
    for d in divs:
        cls = d.get('class', [])
        if cls:
            print(f"  {' '.join(cls)}")
