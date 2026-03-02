// 经卷数据
const books = [
    { name: "创世纪", short: "创", pinyin: "CSJ", fullPinyin: "chuangshiji" },
    { name: "出埃及记", short: "出", pinyin: "CAJ", fullPinyin: "chuaijiji" },
    { name: "利未记", short: "利", pinyin: "LWJ", fullPinyin: "liweiji" },
    { name: "民数记", short: "民", pinyin: "MSJ", fullPinyin: "minshuji" },
    { name: "申命记", short: "申", pinyin: "SMJ", fullPinyin: "shenmingji" },
    { name: "约书亚书", short: "书", pinyin: "YS", fullPinyin: "yueshuya" },
    { name: "士师记", short: "士", pinyin: "SSJ", fullPinyin: "shishiji" },
    { name: "路得记", short: "路", pinyin: "LDJ", fullPinyin: "ludeji" },
    { name: "撒母耳记上", short: "撒上", pinyin: "SMS", fullPinyin: "sammuereishang" },
    { name: "撒母耳记下", short: "撒下", pinyin: "SMX", fullPinyin: "sammuereixia" },
    { name: "列王纪上", short: "王上", pinyin: "LWS", fullPinyin: "liewangjishang" },
    { name: "列王纪下", short: "王下", pinyin: "LWX", fullPinyin: "liewangjixia" },
    { name: "历代志上", short: "代上", pinyin: "LDS", fullPinyin: "lidaijishang" },
    { name: "历代志下", short: "代下", pinyin: "LDX", fullPinyin: "lidaijixia" },
    { name: "以斯拉记", short: "拉", pinyin: "YSL", fullPinyin: "yisilaji" },
    { name: "尼希米记", short: "尼", pinyin: "NXM", fullPinyin: "niximiji" },
    { name: "以斯帖记", short: "斯", pinyin: "YST", fullPinyin: "yisiteji" },
    { name: "约伯记", short: "伯", pinyin: "YBJ", fullPinyin: "yueboji" },
    { name: "诗篇", short: "诗", pinyin: "SP", fullPinyin: "shipian" },
    { name: "箴言", short: "箴", pinyin: "ZY", fullPinyin: "zhenyan" },
    { name: "传道书", short: "传", pinyin: "CDS", fullPinyin: "chuandaoshu" },
    { name: "雅歌", short: "歌", pinyin: "YG", fullPinyin: "yage" },
    { name: "以赛亚书", short: "赛", pinyin: "YSY", fullPinyin: "yisaishu" },
    { name: "耶利米书", short: "耶", pinyin: "YLM", fullPinyin: "yelimishu" },
    { name: "耶利米哀歌", short: "哀", pinyin: "YAG", fullPinyin: "yelimiaige" },
    { name: "以西结书", short: "结", pinyin: "YXJ", fullPinyin: "yixijieshu" },
    { name: "但以理书", short: "但", pinyin: "DYL", fullPinyin: "danyilishu" },
    { name: "何西阿书", short: "何", pinyin: "HXA", fullPinyin: "hexiasu" },
    { name: "约珥书", short: "珥", pinyin: "YES", fullPinyin: "yueershu" },
    { name: "阿摩司书", short: "摩", pinyin: "AMS", fullPinyin: "amoshu" },
    { name: "俄巴底亚书", short: "俄", pinyin: "EBD", fullPinyin: "ebadishu" },
    { name: "约拿书", short: "拿", pinyin: "YNS", fullPinyin: "yueshu" },
    { name: "弥迦书", short: "弥", pinyin: "MJS", fullPinyin: "mijiashu" },
    { name: "那鸿书", short: "鸿", pinyin: "NHS", fullPinyin: "nahongshu" },
    { name: "哈巴谷书", short: "哈", pinyin: "HBG", fullPinyin: "habagus" },
    { name: "西番雅书", short: "番", pinyin: "XFY", fullPinyin: "xifanyashu" },
    { name: "哈该书", short: "该", pinyin: "HGS", fullPinyin: "hagashu" },
    { name: "撒迦利亚书", short: "亚", pinyin: "SJL", fullPinyin: "sajialiyashu" },
    { name: "玛拉基书", short: "玛", pinyin: "MLJ", fullPinyin: "malajishu" },
    { name: "马太福音", short: "太", pinyin: "MT", fullPinyin: "matianfuyin" },
    { name: "马可福音", short: "可", pinyin: "MK", fullPinyin: "makefuyin" },
    { name: "路加福音", short: "路", pinyin: "LJ", fullPinyin: "lujiayinfuyin" },
    { name: "约翰福音", short: "约", pinyin: "YH", fullPinyin: "yuehanfuyin" },
    { name: "使徒行传", short: "徒", pinyin: "ST", fullPinyin: "shituoxingchuan" },
    { name: "罗马书", short: "罗", pinyin: "LM", fullPinyin: "luomashu" },
    { name: "哥林多前书", short: "林前", pinyin: "GLQ", fullPinyin: "gelinduoqianshu" },
    { name: "哥林多后书", short: "林后", pinyin: "GLH", fullPinyin: "gelinduohoushu" },
    { name: "加拉太书", short: "加", pinyin: "JLT", fullPinyin: "jialataishu" },
    { name: "以弗所书", short: "弗", pinyin: "YFS", fullPinyin: "yifusu" },
    { name: "腓立比书", short: "腓", pinyin: "FLB", fullPinyin: "feilipishu" },
    { name: "歌罗西书", short: "西", pinyin: "GLX", fullPinyin: "geluoxishu" },
    { name: "帖撒罗尼迦前书", short: "帖前", pinyin: "TSQ", fullPinyin: "tiesaluonijiaqianshu" },
    { name: "帖撒罗尼迦后书", short: "帖后", pinyin: "TSH", fullPinyin: "tiesaluonijiahoushu" },
    { name: "提摩太前书", short: "提前", pinyin: "TMQ", fullPinyin: "timotaiqianshu" },
    { name: "提摩太后书", short: "提后", pinyin: "TMH", fullPinyin: "timotaihoushu" },
    { name: "提多书", short: "多", pinyin: "TDS", fullPinyin: "tidushu" },
    { name: "腓利门书", short: "门", pinyin: "FLM", fullPinyin: "feilimenshu" },
    { name: "希伯来书", short: "来", pinyin: "XBL", fullPinyin: "xibolai" },
    { name: "雅各书", short: "雅", pinyin: "YGS", fullPinyin: "yageboshu" },
    { name: "彼得前书", short: "彼前", pinyin: "BDQ", fullPinyin: "bideqianshu" },
    { name: "彼得后书", short: "彼后", pinyin: "BDH", fullPinyin: "bidehoushu" },
    { name: "约翰一书", short: "约一", pinyin: "YHY", fullPinyin: "yuehanyishu" },
    { name: "约翰二书", short: "约二", pinyin: "YHE", fullPinyin: "yuehanyiershu" },
    { name: "约翰三书", short: "约三", pinyin: "YHS", fullPinyin: "yuehansanshu" },
    { name: "犹大书", short: "犹", pinyin: "YDS", fullPinyin: "youdashu" },
    { name: "启示录", short: "启", pinyin: "QSL", fullPinyin: "qishilu" }
];

// 经文数据
let bibleData = {};
let loadedBooks = {};

// 中文数字映射
const chineseNumbers = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
    '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
    '十': 10, '百': 100, '千': 1000
};

// 中文数字转阿拉伯数字
function chineseToNumber(str) {
    if (!str) return NaN;
    
    // 如果已经是数字，直接返回
    if (!isNaN(parseInt(str))) {
        return parseInt(str);
    }
    
    // 中文数字转换
    let result = 0;
    let temp = 0;
    
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const num = chineseNumbers[char];
        
        if (num === undefined) continue;
        
        if (num >= 10) {
            // 单位：十、百、千
            if (temp === 0) {
                // 如果前面没有数字，单位当作1
                temp = 1;
            }
            result += temp * num;
            temp = 0;
        } else {
            // 数字：0-9
            temp = num;
        }
    }
    
    // 加上最后的数字
    result += temp;
    return result > 0 ? result : NaN;
}

// 解析语音输入
function parseVoiceInput(text) {
    // 移除标点符号
    text = text.replace(/[。！？，、；：""''（）【】《》\s]/g, '');
    
    // 匹配经卷名
    let bookName = null;
    for (const book of books) {
        if (text.includes(book.name)) {
            bookName = book.name;
            text = text.substring(text.indexOf(book.name) + book.name.length);
            break;
        }
    }
    
    if (!bookName) return null;
    
    // 匹配章号
    let chapter = null;
    const chapterMatch = text.match(/^(\d+|[零一二三四五六七八九十百千]+)章/);
    if (chapterMatch) {
        chapter = chineseToNumber(chapterMatch[1]);
        text = text.substring(chapterMatch[0].length);
    }
    
    if (!chapter) return null;
    
    // 匹配节号
    let startVerse = null;
    let endVerse = null;
    
    // 匹配范围：1~3节、1到3节、1-3节、一到三节
    const rangeMatch = text.match(/^(\d+|[零一二三四五六七八九十百千]+)[~\-到]+(\d+|[零一二三四五六七八九十百千]+)节?$/);
    if (rangeMatch) {
        startVerse = chineseToNumber(rangeMatch[1]);
        endVerse = chineseToNumber(rangeMatch[2]);
    } else {
        // 匹配单节：1节、一节
        const verseMatch = text.match(/^(\d+|[零一二三四五六七八九十百千]+)节?$/);
        if (verseMatch) {
            startVerse = chineseToNumber(verseMatch[1]);
            endVerse = startVerse;
        }
    }
    
    if (!startVerse) return null;
    
    return {
        bookName: bookName,
        chapter: chapter,
        startVerse: startVerse,
        endVerse: endVerse || startVerse
    };
}

// DOM 元素
let input, suggestions, result;

// 当前状态
let currentBook = null;
let currentChapter = null;
let currentStartVerse = null;
let currentEndVerse = null;
let inputState = 'book';
let previousValue = '';

// 按需加载经卷数据
async function loadBook(bookName) {
    if (loadedBooks[bookName]) {
        return true;
    }
    
    try {
        const response = await fetch(`data/${bookName}.json`);
        if (response.ok) {
            const data = await response.json();
            bibleData[bookName] = data.chapters;
            loadedBooks[bookName] = true;
            console.log(`已加载: ${bookName}`);
            return true;
        }
    } catch (error) {
        console.error(`加载${bookName}失败:`, error);
    }
    return false;
}

// 显示建议列表
function showSuggestions(matchedBooks) {
    suggestions.innerHTML = '';
    matchedBooks.forEach(book => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = book.name;
        item.addEventListener('click', function() {
            selectBook(book);
        });
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            selectBook(book);
        });
        suggestions.appendChild(item);
    });
    suggestions.style.display = 'block';
}

// 选择经卷
function selectBook(book) {
    currentBook = book;
    input.value = book.name;
    inputState = 'chapter';
    suggestions.style.display = 'none';
    input.focus();
    // 选择经卷后立即加载
    loadBook(book.name);
}

// 显示经文
async function displayVerse(bookName, chapter, startVerse, endVerse) {
    result.innerHTML = '<p>加载中...</p>';
    
    const loaded = await loadBook(bookName);
    
    if (!loaded || !bibleData[bookName] || !bibleData[bookName][chapter]) {
        result.innerHTML = '<p>未找到经文</p>';
        return;
    }

    result.innerHTML = '';
    const chapterData = bibleData[bookName][chapter];
    
    if (endVerse === 'end') {
        for (let i = startVerse; i <= Object.keys(chapterData).length; i++) {
            if (chapterData[i]) {
                const verseElement = document.createElement('div');
                verseElement.className = 'verse';
                verseElement.innerHTML = `<span class="verse-number">${i}</span>${chapterData[i]}`;
                result.appendChild(verseElement);
            }
        }
    } else {
        for (let i = startVerse; i <= endVerse; i++) {
            if (chapterData[i]) {
                const verseElement = document.createElement('div');
                verseElement.className = 'verse';
                verseElement.innerHTML = `<span class="verse-number">${i}</span>${chapterData[i]}`;
                result.appendChild(verseElement);
            }
        }
    }
}

// 处理空格输入
function handleSpaceInput(value) {
    const upperValue = value.toUpperCase();
    
    // 检测到空格输入
    if (value.includes(' ') && !previousValue.includes(' ')) {
        if (inputState === 'book' && suggestions.style.display === 'block') {
            const firstSuggestion = suggestions.querySelector('.suggestion-item');
            if (firstSuggestion) {
                const bookName = firstSuggestion.textContent;
                currentBook = books.find(b => b.name === bookName);
                selectBook(currentBook);
                return true;
            }
        } else if (inputState === 'chapter') {
            const chapterValue = parseInt(input.value.replace(currentBook.name, '').trim());
            if (!isNaN(chapterValue)) {
                currentChapter = chapterValue;
                // 移除空格后添加冒号
                input.value = currentBook.name + chapterValue + ':';
                inputState = 'verse';
                return true;
            }
        } else if (inputState === 'verse') {
            const verseValue = parseInt(input.value.split(':')[1].trim());
            if (!isNaN(verseValue)) {
                currentStartVerse = verseValue;
                // 移除空格后添加横线
                input.value = currentBook.name + currentChapter + ':' + verseValue + '-';
                inputState = 'endVerse';
                return true;
            }
        }
    }
    return false;
}

// 输入处理
function handleInput(e) {
    const value = e.target.value;
    const upperValue = value.toUpperCase();
    
    // 尝试解析语音输入
    const voiceResult = parseVoiceInput(value);
    if (voiceResult) {
        currentBook = books.find(b => b.name === voiceResult.bookName);
        currentChapter = voiceResult.chapter;
        currentStartVerse = voiceResult.startVerse;
        currentEndVerse = voiceResult.endVerse;
        
        // 更新输入框显示
        if (voiceResult.startVerse === voiceResult.endVerse) {
            input.value = voiceResult.bookName + voiceResult.chapter + ':' + voiceResult.startVerse;
            inputState = 'verse';
        } else {
            input.value = voiceResult.bookName + voiceResult.chapter + ':' + voiceResult.startVerse + '-' + voiceResult.endVerse;
            inputState = 'endVerse';
        }
        
        // 显示经文
        displayVerse(voiceResult.bookName, voiceResult.chapter, voiceResult.startVerse, voiceResult.endVerse);
        suggestions.style.display = 'none';
        return;
    }
    
    // 处理空格输入（兼容手机输入法）
    if (handleSpaceInput(value)) {
        previousValue = input.value;
        return;
    }
    
    previousValue = value;
    
    if (value.includes(':')) {
        if (value.includes('-')) {
            if (inputState !== 'endVerse') {
                inputState = 'endVerse';
            }
            const parts = value.split(':')[1].split('-');
            if (parts[0] && !isNaN(parseInt(parts[0]))) {
                currentStartVerse = parseInt(parts[0]);
            }
            if (parts[1] && !isNaN(parseInt(parts[1]))) {
                currentEndVerse = parseInt(parts[1]);
                if (currentBook && currentChapter && currentStartVerse && currentEndVerse) {
                    displayVerse(currentBook.name, currentChapter, currentStartVerse, currentEndVerse);
                }
            }
        } else {
            if (inputState === 'endVerse') {
                currentEndVerse = null;
            }
            inputState = 'verse';
            const versePart = value.split(':')[1];
            if (versePart && !isNaN(parseInt(versePart))) {
                currentStartVerse = parseInt(versePart);
                if (currentBook && currentChapter && currentStartVerse) {
                    displayVerse(currentBook.name, currentChapter, currentStartVerse, currentStartVerse);
                }
            }
        }
    } else if (currentBook && value.startsWith(currentBook.name)) {
        inputState = 'chapter';
        const chapterPart = value.substring(currentBook.name.length).trim();
        
        // 检测章后输入z显示整章
        if (chapterPart.toUpperCase().endsWith('Z')) {
            const chapterValue = parseInt(chapterPart.substring(0, chapterPart.length - 1));
            if (!isNaN(chapterValue)) {
                currentChapter = chapterValue;
                displayVerse(currentBook.name, currentChapter, 1, 'end');
            }
        } else if (chapterPart && !isNaN(parseInt(chapterPart))) {
            currentChapter = parseInt(chapterPart);
        }
    }
    
    if (upperValue.length === 0) {
        suggestions.style.display = 'none';
        currentBook = null;
        currentChapter = null;
        currentStartVerse = null;
        currentEndVerse = null;
        inputState = 'book';
        result.innerHTML = '';
        return;
    }

    const matchedBooks = books.filter(book => {
        return book.pinyin.toUpperCase().startsWith(upperValue) || book.fullPinyin.toUpperCase().startsWith(upperValue);
    });

    if (matchedBooks.length > 0 && inputState === 'book') {
        showSuggestions(matchedBooks);
    } else {
        suggestions.style.display = 'none';
    }
}

// 键盘事件处理
function handleKeydown(e) {
    if (e.key === 'Enter') {
        if (inputState === 'verse' && currentBook && currentChapter && currentStartVerse) {
            displayVerse(currentBook.name, currentChapter, currentStartVerse, currentStartVerse);
        } else if (inputState === 'endVerse' && currentBook && currentChapter && currentStartVerse && currentEndVerse) {
            displayVerse(currentBook.name, currentChapter, currentStartVerse, currentEndVerse);
        }
    } else if (e.key === ' ') {
        // 电脑端空格键处理
        if (inputState === 'book' && suggestions.style.display === 'block') {
            const firstSuggestion = suggestions.querySelector('.suggestion-item');
            if (firstSuggestion) {
                const bookName = firstSuggestion.textContent;
                currentBook = books.find(b => b.name === bookName);
                selectBook(currentBook);
                e.preventDefault();
            }
        } else if (inputState === 'chapter') {
            const chapterValue = parseInt(input.value.replace(currentBook.name, '').trim());
            if (!isNaN(chapterValue)) {
                currentChapter = chapterValue;
                input.value = currentBook.name + chapterValue + ':';
                inputState = 'verse';
                e.preventDefault();
            }
        } else if (inputState === 'verse') {
            const verseValue = parseInt(input.value.split(':')[1].trim());
            if (!isNaN(verseValue)) {
                currentStartVerse = verseValue;
                input.value = input.value + '-';
                inputState = 'endVerse';
                e.preventDefault();
            }
        }
    } else if (e.key === 'Backspace') {
        setTimeout(() => {
            const value = input.value;
            if (inputState === 'endVerse' && !value.includes('-')) {
                inputState = 'verse';
                currentEndVerse = null;
                if (currentBook && currentChapter && currentStartVerse) {
                    displayVerse(currentBook.name, currentChapter, currentStartVerse, currentStartVerse);
                }
            }
        }, 0);
    }
}

// 点击外部关闭建议列表
function handleClickOutside(e) {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.style.display = 'none';
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    input = document.getElementById('bible-input');
    suggestions = document.getElementById('suggestions');
    result = document.getElementById('result');
    
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeBtn = document.getElementById('close-btn');
    
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);
    
    // 移动端触摸事件
    document.addEventListener('touchend', function(e) {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
    
    // 帮助按钮点击事件
    helpBtn.addEventListener('click', function() {
        helpModal.style.display = 'block';
    });
    
    // 关闭按钮点击事件
    closeBtn.addEventListener('click', function() {
        helpModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && helpModal.style.display === 'block') {
            helpModal.style.display = 'none';
        }
    });
});
