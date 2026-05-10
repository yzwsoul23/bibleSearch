// Pretext-Bible: 基于 Pretext 技术的圣经经文专业排版引擎
// 核心技术来源: https://github.com/chenglou/pretext
// 
// 功能:
// 1. Intl.Segmenter CJK 分词 (中文经文完美断行)
// 2. Canvas 文本测量 (零 DOM reflow)
// 3. Rich-Inline 富文本流 (语义化着色精确布局)

const PretextBible = (() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let sharedWordSegmenter = null;
    let sharedGraphemeSegmenter = null;
    let measurementCache = new Map();

    // 语义化着色配置（内联定义，避免跨文件依赖）
    const SemanticColoringConfig = {
        quotes: {
            open: ['"', "'", '「', '『', '\u201C', '\u2018'],
            close: ['"', "'", '」', '』', '\u201D', '\u2019'],
            className: 'bible-quote'
        },
        brackets: {
            pairs: [
                { open: '《', close: '》' },
                { open: '<', close: '>' },
                { open: '＜', close: '＞' },
                { open: '(', close: ')' },
                { open: '（', close: '）' },
                { open: '[', close: ']' },
                { open: '【', close: '】' },
                { open: '〖', close: '〗' },
                { open: '{', close: '}' },
                { open: '｛', close: '｝' }
            ],
            className: 'bible-bracket'
        },
        punctuation: /[,，.。!！?？:：;；、）\]\}｝】〗》＞>…—\-]/,
        number: /[0-9０-９]+/,
        english: /[A-Za-z\uFF21-\uFF3A\uFF41-\uFF5A]+/,
        specialMarker: /[·•▪*＊✲❈※☆♡♥○●√✔☑×✘☒]/
    };

    function getWordSegmenter() {
        if (!sharedWordSegmenter) {
            sharedWordSegmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
        }
        return sharedWordSegmenter;
    }

    function getGraphemeSegmenter() {
        if (!sharedGraphemeSegmenter) {
            sharedGraphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        }
        return sharedGraphemeSegmenter;
    }

    function measureTextWidth(text, font) {
        const cacheKey = `${font}|${text}`;
        if (measurementCache.has(cacheKey)) {
            return measurementCache.get(cacheKey);
        }

        ctx.font = font || '16px SimSun';
        const metrics = ctx.measureText(text);
        const width = metrics.width;

        measurementCache.set(cacheKey, width);
        return width;
    }

    function segmentText(text) {
        const segmenter = getWordSegmenter();
        const segments = [];
        
        for (const seg of segmenter.segment(text)) {
            segments.push({
                text: seg.segment,
                isWordLike: seg.isWordLike,
                index: seg.index,
                length: seg.segment.length
            });
        }
        
        return segments;
    }

    function prepareRichInline(items) {
        const processedItems = items.map((item, idx) => {
            const font = item.font || '1000 16px SimSun';
            const segments = segmentText(item.text);
            
            const measuredSegments = segments.map(seg => ({
                text: seg.text,
                isWordLike: seg.isWordLike,
                width: measureTextWidth(seg.text, font),
                itemIndex: idx
            }));

            return {
                ...item,
                font,
                segments: measuredSegments,
                naturalWidth: measuredSegments.reduce((sum, s) => sum + s.width, 0),
                extraWidth: item.extraWidth || 0,
                break: item.break || 'normal'
            };
        });

        return {
            items: processedItems,
            totalNaturalWidth: processedItems.reduce((sum, item) => sum + item.naturalWidth + item.extraWidth, 0)
        };
    }

    function layoutRichInline(prepared, maxWidth) {
        const lines = [];
        let currentLine = [];
        let currentLineWidth = 0;
        let currentGapBefore = 0;

        for (let i = 0; i < prepared.items.length; i++) {
            const item = prepared.items[i];

            for (let j = 0; j < item.segments.length; j++) {
                const seg = item.segments[j];
                const segWidth = seg.width;
                const needsSpace = !seg.isWordLike && seg.text.trim() === '' && j > 0;
                const spaceWidth = needsSpace ? measureTextWidth(' ', item.font) : 0;

                if (currentLineWidth + spaceWidth + segWidth > maxWidth && currentLine.length > 0) {
                    lines.push({
                        fragments: [...currentLine],
                        width: currentLineWidth
                    });
                    currentLine = [];
                    currentLineWidth = 0;
                    currentGapBefore = 0;
                } else if (needsSpace && currentLine.length > 0) {
                    currentLineWidth += spaceWidth;
                }

                currentLine.push({
                    itemIndex: item.itemIndex,
                    className: item.className || '',
                    text: seg.text,
                    width: segWidth,
                    gapBefore: currentGapBefore,
                    font: item.font
                });

                currentLineWidth += segWidth;
                currentGapBefore = 0;
            }

            if (item.extraWidth > 0) {
                currentLineWidth += item.extraWidth;
            }
        }

        if (currentLine.length > 0) {
            lines.push({
                fragments: currentLine,
                width: currentLineWidth
            });
        }

        return {
            lines,
            lineCount: lines.length,
            maxLineWidth: Math.max(...lines.map(l => l.width), 0)
        };
    }

    function renderRichInlineToDOM(lines, container) {
        container.innerHTML = '';
        
        const fragment = document.createDocumentFragment();
        
        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            const lineDiv = document.createElement('div');
            lineDiv.className = 'pretext-line';
            lineDiv.style.display = 'flex';
            lineDiv.style.flexWrap = 'nowrap';
            lineDiv.style.lineHeight = 'inherit';

            for (const frag of line.fragments) {
                const span = document.createElement('span');
                span.textContent = frag.text;
                
                if (frag.className) {
                    span.className = frag.className;
                }
                
                if (frag.gapBefore > 0) {
                    span.style.marginLeft = `${frag.gapBefore}px`;
                }

                lineDiv.appendChild(span);
            }

            fragment.appendChild(lineDiv);
        }

        container.appendChild(fragment);
    }

    function parseToRichInlineItems(text, colorConfig, parentClassName = '') {
        const items = [];
        let i = 0;
        const len = text.length;
        const config = colorConfig || SemanticColoringConfig;

        while (i < len) {
            let matched = false;
            const char = text[i];

            // 检测引号
            for (let q = 0; q < config.quotes.open.length; q++) {
                if (text.startsWith(config.quotes.open[q], i)) {
                    const openQuote = config.quotes.open[q];
                    const closeQuote = config.quotes.close[q];
                    const closeIdx = text.indexOf(closeQuote, i + openQuote.length);

                    if (closeIdx !== -1) {
                        const innerContent = text.substring(i + openQuote.length, closeIdx);

                        // 关键修复：引号始终使用自身的颜色（深蓝色），不继承父级（括号）
                        items.push({ text: openQuote, className: config.quotes.className, font: '1000 16px SimSun' });

                        // 递归处理内部内容，传递引号的颜色作为父级
                        const innerItems = parseToRichInlineItems(innerContent, config, config.quotes.className);
                        items.push(...innerItems);

                        items.push({ text: closeQuote, className: config.quotes.className, font: '1000 16px SimSun' });

                        i = closeIdx + closeQuote.length;
                        matched = true;
                        break;
                    }
                }
            }

            if (matched) continue;

            // 检测括号
            for (const bracket of config.brackets.pairs) {
                if (text.startsWith(bracket.open, i)) {
                    const closeIdx = text.indexOf(bracket.close, i + bracket.open.length);

                    if (closeIdx !== -1) {
                        const innerContent = text.substring(i + bracket.open.length, closeIdx);

                        // 关键修复：括号始终使用自身的颜色（深棕色），不继承父级（引号）
                        // 这样"引号内的括号"就会显示为括号的本色
                        items.push({ text: bracket.open, className: config.brackets.className, font: '1000 16px SimSun' });

                        // 递归处理内部内容，传递括号的颜色作为父级
                        // 这样括号内的普通文本会继承括号颜色，但嵌套的符号会用自身颜色
                        const innerItems = parseToRichInlineItems(innerContent, config, config.brackets.className);
                        items.push(...innerItems);

                        items.push({ text: bracket.close, className: config.brackets.className, font: '1000 16px SimSun' });

                        i = closeIdx + bracket.close.length;
                        matched = true;
                        break;
                    }
                }
            }

            if (matched) continue;

            // 检测特殊标记（特殊标记优先级最高，始终使用自身颜色）
            const specialMatch = text.slice(i).match(config.specialMarker);
            if (specialMatch && specialMatch.index === 0) {
                items.push({ text: specialMatch[0], className: 'bible-special', font: '1000 16px SimSun' });
                i += specialMatch[0].length;
                continue;
            }

            // 检测数字（始终使用自身颜色 - 金色）
            const numMatch = text.slice(i).match(config.number);
            if (numMatch && numMatch.index === 0) {
                items.push({
                    text: numMatch[0],
                    className: 'bible-number',
                    font: '600 16px Times New Roman'
                });
                i += numMatch[0].length;
                continue;
            }

            // 检测英文（始终使用自身颜色 - 蓝灰斜体）
            const engMatch = text.slice(i).match(config.english);
            if (engMatch && engMatch.index === 0) {
                items.push({
                    text: engMatch[0],
                    className: 'bible-english',
                    font: 'italic 16px SimSun'
                });
                i += engMatch[0].length;
                continue;
            }

            // 检测标点符号（始终使用自身颜色 - 弱化灰）
            const punctMatch = text.slice(i).match(config.punctuation);
            if (punctMatch && punctMatch.index === 0) {
                items.push({
                    text: punctMatch[0],
                    className: 'bible-punctuation',
                    font: '1000 16px SimSun'
                });
                i += punctMatch[0].length;
                continue;
            }

            // 兜底：普通文本（继承父级类名 - 引号/括号内容本身）
            items.push({
                text: char,
                className: parentClassName || '',
                font: '1000 16px SimSun'
            });
            i++
        }

        return items;
    }

    function colorizeWithPretext(text, enableColoring = true) {
        console.log('[Pretext] colorizeWithPretext called:', { text: text.substring(0, 50), enableColoring });

        if (!enableColoring) {
            console.log('[Pretext] Coloring disabled, returning plain text');
            return text;
        }

        const items = parseToRichInlineItems(text, SemanticColoringConfig);
        console.log('[Pretext] Parsed items count:', items.length);
        console.log('[Pretext] Sample items:', items.slice(0, 5));

        const prepared = prepareRichInline(items);
        console.log('[Pretext] Prepared items count:', prepared.items.length);

        const result = document.createElement('div');
        result.className = 'pretext-container';

        for (const item of prepared.items) {
            const span = document.createElement('span');
            span.textContent = item.text;

            if (item.className) {
                span.className = item.className;
                console.log('[Pretext] Styled span:', { text: item.text, className: item.className });
            }

            result.appendChild(span);
        }

        console.log('[Pretext] Result node type:', result.nodeType, 'child count:', result.children.length);
        return result;
    }

    // 跨节联合语义化着色（解决引号/括号跨越多个 verse 的问题）
    // 使用 Unicode 私有区字符作为边界标记（单字符，不会被拆散）
    const VERSE_BOUNDARY = '\uE000';  // Unicode Private Use Area

    function colorizeVersesWithPretext(verseTexts, enableColoring = true) {
        if (!enableColoring || !verseTexts || verseTexts.length === 0) {
            return verseTexts.map(text => document.createTextNode(text || ''));
        }

        // 合并所有 verse 文本，用边界标记分隔
        const mergedText = verseTexts.join(VERSE_BOUNDARY);

        // 对完整文本进行全局词法分析（跨节配对）
        const allItems = parseToRichInlineItems(mergedText, SemanticColoringConfig);

        // 按边界标记拆分为各个 verse 的 DOM 片段
        const results = [];
        let currentFragment = null;

        for (const item of allItems) {
            // 检查是否是边界标记（单字符，可以直接比较）
            if (item.text === VERSE_BOUNDARY) {
                // 边界标记：保存当前 fragment，开始新的
                if (currentFragment) {
                    results.push(currentFragment);
                }
                currentFragment = document.createDocumentFragment();
                continue;
            }

            // 创建 span 元素（保留语义化着色的 className）
            if (!currentFragment) {
                currentFragment = document.createDocumentFragment();
            }
            const span = document.createElement('span');
            span.textContent = item.text;
            if (item.className) {
                span.className = item.className;
            }
            currentFragment.appendChild(span);
        }

        // 添加最后一个 fragment
        if (currentFragment) {
            results.push(currentFragment);
        }

        return results;
    }

    function clearCache() {
        measurementCache.clear();
    }

    return {
        prepareRichInline,
        layoutRichInline,
        renderRichInlineToDOM,
        parseToRichInlineItems,
        colorizeWithPretext,
        colorizeVersesWithPretext,
        clearCache,
        measureTextWidth,
        segmentText
    };
})();

window.PretextBible = PretextBible;
