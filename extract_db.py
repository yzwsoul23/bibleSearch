import sqlite3
import json
import os

# 经卷名称映射
book_names = {
    1: '创世纪', 2: '出埃及记', 3: '利未记', 4: '民数记', 5: '申命记',
    6: '约书亚记', 7: '士师记', 8: '路得记', 9: '撒母耳记上', 10: '撒母耳记下',
    11: '列王纪上', 12: '列王纪下', 13: '历代志上', 14: '历代志下', 15: '以斯拉记',
    16: '尼希米记', 17: '以斯帖记', 18: '约伯记', 19: '诗篇', 20: '箴言',
    21: '传道书', 22: '雅歌', 23: '以赛亚书', 24: '耶利米书', 25: '耶利米哀歌',
    26: '以西结书', 27: '但以理书', 28: '何西阿书', 29: '约珥书', 30: '阿摩司书',
    31: '俄巴底亚书', 32: '约拿书', 33: '弥迦书', 34: '那鸿书', 35: '哈巴谷书',
    36: '西番雅书', 37: '哈该书', 38: '撒迦利亚书', 39: '玛拉基书',
    40: '马太福音', 41: '马可福音', 42: '路加福音', 43: '约翰福音', 44: '使徒行传',
    45: '罗马书', 46: '哥林多前书', 47: '哥林多后书', 48: '加拉太书', 49: '以弗所书',
    50: '腓立比书', 51: '歌罗西书', 52: '帖撒罗尼迦前书', 53: '帖撒罗尼迦后书',
    54: '提摩太前书', 55: '提摩太后书', 56: '提多书', 57: '腓利门书', 58: '希伯来书',
    59: '雅各书', 60: '彼得前书', 61: '彼得后书', 62: '约翰一书', 63: '约翰二书',
    64: '约翰三书', 65: '犹大书', 66: '启示录'
}

# 连接数据库
conn = sqlite3.connect('bible_简体中文和合本.db')
cursor = conn.cursor()

# 查看BibleID表
cursor.execute("SELECT * FROM BibleID")
print("BibleID:", cursor.fetchall())

# 创建data目录
if not os.path.exists('data'):
    os.makedirs('data')

# 按经卷提取数据
bible_data = {}

cursor.execute("SELECT VolumeSN, ChapterSN, VerseSN, Lection FROM Bible ORDER BY VolumeSN, ChapterSN, VerseSN")
for row in cursor.fetchall():
    volume_sn = row[0]
    chapter = row[1]
    verse = row[2]
    lection = row[3]
    
    book_name = book_names.get(volume_sn, f'未知经卷{volume_sn}')
    
    if book_name not in bible_data:
        bible_data[book_name] = {}
    
    if chapter not in bible_data[book_name]:
        bible_data[book_name][chapter] = {}
    
    bible_data[book_name][chapter][verse] = lection

# 保存每个经卷为单独的JSON文件
for book_name, chapters in bible_data.items():
    file_path = f'data/{book_name}.json'
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump({
            'name': book_name,
            'chapters': chapters
        }, f, ensure_ascii=False, indent=2)
    
    print(f'已创建: {file_path}')

print(f'\n总共创建了 {len(bible_data)} 个经卷文件')

conn.close()
