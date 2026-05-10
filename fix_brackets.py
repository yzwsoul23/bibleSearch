import json
import os
import glob
import sys

# 设置输出编码为 UTF-8（解决 Windows 控制台中文和 emoji 显示问题）
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 定义所有类型的左括号
LEFT_BRACKETS = {'（', '(', '【', '[', '《', '「', '『', '〖', '{', '｛', '<', '＜'}

def fix_brackets_in_file(filepath):
    """修复单个 JSON 文件中的括号位置问题"""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    total_fixes = 0
    
    # 遍历所有章
    for chapter_num in sorted(data['chapters'].keys(), key=lambda x: int(x)):
        chapter = data['chapters'][chapter_num]
        
        # 获取所有节号并排序
        verse_nums = sorted(chapter.keys(), key=lambda x: int(x))
        
        # 遍历除最后一节外的所有节
        for i in range(len(verse_nums) - 1):
            current_verse = verse_nums[i]
            next_verse = verse_nums[i + 1]
            
            current_text = chapter[current_verse]
            next_text = chapter[next_verse]
            
            # 检查当前节是否以左括号结尾
            if current_text and current_text[-1] in LEFT_BRACKETS:
                # 将左括号从当前节末尾移到下一节开头
                bracket = current_text[-1]
                
                # 更新当前节：去掉末尾的左括号
                chapter[current_verse] = current_text[:-1]
                
                # 更新下一节：在开头添加左括号
                chapter[next_verse] = bracket + next_text
                
                modified = True
                total_fixes += 1
                
                print(f"  修复: 第{chapter_num}章 第{current_verse}节 → 第{next_verse}节")
                print(f"    原{current_verse}节结尾: ...{current_text[-20:]}")
                print(f"    新{current_verse}节结尾: ...{chapter[current_verse][-20:]}")
                print(f"    新{next_verse}节开头: {chapter[next_verse][:20]}...")
    
    if modified:
        # 保存修改后的文件
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"\n✅ 已修复 {total_fixes} 处括号位置问题")
    
    return modified, total_fixes

def main():
    """主函数：处理 data 文件夹中的所有 JSON 文件"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    if not os.path.exists(data_dir):
        print(f"❌ 错误: 找不到 data 文件夹: {data_dir}")
        return
    
    # 获取所有 JSON 文件
    json_files = glob.glob(os.path.join(data_dir, '*.json'))
    
    if not json_files:
        print("❌ 错误: data 文件夹中没有找到 JSON 文件")
        return
    
    print(f"📂 找到 {len(json_files)} 个 JSON 文件\n")
    print("=" * 60)
    
    total_files_modified = 0
    total_all_fixes = 0
    
    for filepath in sorted(json_files):
        filename = os.path.basename(filepath)
        print(f"\n📖 处理文件: {filename}")
        print("-" * 40)
        
        try:
            modified, fixes = fix_brackets_in_file(filepath)
            if modified:
                total_files_modified += 1
                total_all_fixes += fixes
            else:
                print("  ✨ 无需修复")
        except Exception as e:
            print(f"  ❌ 处理失败: {e}")
    
    print("\n" + "=" * 60)
    print(f"\n🎉 处理完成！")
    print(f"   📝 共修改了 {total_files_modified} 个文件")
    print(f"   🔧 总计修复了 {total_all_fixes} 处括号位置问题")

if __name__ == '__main__':
    main()
