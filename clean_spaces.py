import json
import os

# 遍历data目录下的所有JSON文件
data_dir = 'data'
for filename in os.listdir(data_dir):
    if filename.endswith('.json'):
        filepath = os.path.join(data_dir, filename)
        
        # 读取JSON文件
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 清理经文中的空格
        def clean_text(text):
            # 移除所有全角空格和半角空格
            text = text.replace('　', '')  # 全角空格
            text = text.replace(' ', '')   # 半角空格
            return text
        
        # 遍历所有章节和经文
        for chapter_num, verses in data['chapters'].items():
            for verse_num, verse_text in verses.items():
                data['chapters'][chapter_num][verse_num] = clean_text(verse_text)
        
        # 保存修改后的JSON文件
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f'已清理: {filename}')

print('\n所有文件清理完成！')
