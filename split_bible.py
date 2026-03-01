import json
import os
import re

# 创建data目录
if not os.path.exists('data'):
    os.makedirs('data')

# 经卷名称映射
book_names = {
    'Ge': '创世纪', 'Ex': '出埃及记', 'Le': '利未记', 'Nu': '民数记', 'De': '申命记',
    'Jos': '约书亚记', 'Jud': '士师记', 'Ru': '路得记', '1Sa': '撒母耳记上', '2Sa': '撒母耳记下',
    '1Ki': '列王纪上', '2Ki': '列王纪下', '1Ch': '历代志上', '2Ch': '历代志下', 'Ezr': '以斯拉记',
    'Ne': '尼希米记', 'Es': '以斯帖记', 'Job': '约伯记', 'Ps': '诗篇', 'Pr': '箴言',
    'Ec': '传道书', 'So': '雅歌', 'Isa': '以赛亚书', 'Jer': '耶利米书', 'La': '耶利米哀歌',
    'Eze': '以西结书', 'Da': '但以理书', 'Ho': '何西阿书', 'Joe': '约珥书', 'Am': '阿摩司书',
    'Ob': '俄巴底亚书', 'Jon': '约拿书', 'Mic': '弥迦书', 'Na': '那鸿书', 'Hab': '哈巴谷书',
    'Zep': '西番雅书', 'Hag': '哈该书', 'Zec': '撒迦利亚书', 'Mal': '玛拉基书',
    'Mt': '马太福音', 'Mk': '马可福音', 'Lk': '路加福音', 'Jn': '约翰福音', 'Ac': '使徒行传',
    'Ro': '罗马书', '1Co': '哥林多前书', '2Co': '哥林多后书', 'Ga': '加拉太书', 'Eph': '以弗所书',
    'Php': '腓立比书', 'Col': '歌罗西书', '1Th': '帖撒罗尼迦前书', '2Th': '帖撒罗尼迦后书',
    '1Ti': '提摩太前书', '2Ti': '提摩太后书', 'Tit': '提多书', 'Phm': '腓利门书', 'Heb': '希伯来书',
    'Jas': '雅各书', '1Pe': '彼得前书', '2Pe': '彼得后书', '1Jn': '约翰一书', '2Jn': '约翰二书',
    '3Jn': '约翰三书', 'Jud': '犹大书', 'Re': '启示录'
}

# 读取books.txt文件
bible_data = {}
current_book = None

with open('books.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        
        # 跳过标题行
        if line.startswith('='):
            continue
        
        # 解析经文行
        # 格式: Ge 1:1 创世纪 1:1 起初　神创造天地。
        match = re.match(r'^(\w+)\s+(\d+):(\d+)\s+(.*?)\s+(\d+):(\d+)\s+(.*)$', line)
        if match:
            book_code = match.group(1)
            chapter = int(match.group(2))
            verse = int(match.group(3))
            book_name = match.group(4)
            content = match.group(7)
            
            if book_name not in bible_data:
                bible_data[book_name] = {}
            
            if chapter not in bible_data[book_name]:
                bible_data[book_name][chapter] = {}
            
            bible_data[book_name][chapter][verse] = content

# 保存每个经卷为单独的JSON文件
for book_name, chapters in bible_data.items():
    # 创建安全的文件名
    safe_name = book_name.replace('/', '_').replace('\\', '_')
    file_path = f'data/{safe_name}.json'
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({
            'name': book_name,
            'chapters': chapters
        }, f, ensure_ascii=False, indent=2)
    
    print(f'已创建: {file_path}')

print(f'\n总共创建了 {len(bible_data)} 个经卷文件')
