const markdownInput = document.getElementById('markdown-input');
const htmlOutput = document.getElementById('html-output');
const preview = document.getElementById('preview');
let lineCounter = 0;

// 专门处理内联标记的函数
function processInlineMarkdown(text) {
    // 先，处理图片（避免被其他规则匹配）
    text = text.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, src) => {
        return `<img alt="${alt}" src="${src}">`;
    });

    // 处理链接
    text = text.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (match, linkText, url) => {
        return `<a href="${url}">${linkText}</a>`;
    });

    // 处理粗体：**bold** 和 __bold__
    text = text.replace(/(\*\*|__)(.*?)\1/g, (match, marker, content) => {
        return `<strong>${processInlineMarkdown(content)}</strong>`;
    });

    // 处理斜体：*italic* 和 _italic_
    text = text.replace(/(\*|_)(.*?)\1/g, (match, marker, content) => {
        // 避免匹配已经处理过的粗体内容
        if (!content.includes('<strong>')) {
            return `<em>${processInlineMarkdown(content)}</em>`;
        }
        return match;
    });

    return text;
}


function convertMarkdown() {
    preview.innerHTML = "";
    htmlOutput.textContent = "";
    lineCounter = 0;

    let markdownLines = markdownInput.value.split("\n");
    console.log(markdownLines);
    markdownLines.forEach(line => {
        if (lineCounter != 0) {
            htmlOutput.textContent += "\n";
            preview.innerHTML += "\n";
        }
        lineCounter++;
        // 优先级最高的引用块处理
        if (line.match(/^> /)) {
            let content = line.replace(/^> /, "").trim();

            // 对引用内容进行完整的标记处理
            content = processInlineMarkdown(content);

            let resultText = `<blockquote>${content}</blockquote>`;
            
            // 更新输出
            htmlOutput.textContent += `${resultText}`;
            preview.innerHTML += `${resultText}`;
        }
        // 标题处理，优先级第二
        else if (line.match(/^[#]+[^\#]/)) {
            let headingLevel = Math.min(line.match(/^[#]+/)[0].length, 6);
            let content = line.replace(/^[#]+/, "").trim();

            // 对标题内容进行二次判断，处理嵌套的强调文本
            // 先处理双标记（**strong** 或 __strong__），再处理单标记（*em* 或 _em_）
            let processedContent = content
                .replace(/(\*\*|__)([^*_]+)\1/g, (match, marker, content) => `<strong>${content}</strong>`)
                .replace(/([*_])([^*_]+)\1/g, (match, marker, content) => `<em>${content}</em>`);

            htmlOutput.textContent += `<h${headingLevel}>${processedContent}</h${headingLevel}>`;
            preview.innerHTML += `<h${headingLevel}>${processedContent}</h${headingLevel}>`;
        }
        // 其他元素保持相同优先级
        else if (line.match(/!\[([^\]]*)\]\(([^)]*)\)/)) {
            // 处理图片格式 ![alt-text](image-source)
            let resultText = line.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, (match, alt, src) => {
                return `<img alt="${alt}" src="${src}">`;
            });

            console.log("解析结果:", resultText);

            // 更新输出
            htmlOutput.textContent += `${resultText}`;
            preview.innerHTML += `${resultText}`;
        }
        else if (line.match(/\[([^\]]*)\]\(([^)]*)\)/)) {
            // 处理链接格式 [link-text](url)
            let resultText = line.replace(/\[([^\]]*)\]\(([^)]*)\)/g, (match, linkText, url) => {
                return `<a href="${url}">${linkText}</a>`;
            });

            console.log("解析结果:", resultText);

            // 更新输出
            htmlOutput.textContent += `${resultText}`;
            preview.innerHTML += `${resultText}`;
        }
        else if (line.match(/(\*\*|__)([^*_]+)\1/g)) {
            // 顺序匹配相邻的双星号或双下划线标记
            let resultText = line.replace(/(\*\*|__)([^*_]+)\1/g, (match, marker, content) => `<strong>${content}</strong>`);

            console.log("解析结果:", resultText);

            // 更新输出
            htmlOutput.textContent += `<p>${resultText}</p>`;
            preview.innerHTML += `<p>${resultText}</p>`;
        }
        else if (line.match(/([*_])([^*_]+)\1/g)) {
            // 顺序匹配相邻的星号或下划线标记
            let resultText = line.replace(/([*_])([^*_]+)\1/g, (match, marker, content) => `<em>${content}</em>`);

            console.log("解析结果:", resultText);

            // 更新输出
            htmlOutput.textContent += `<p>${resultText}</p>`;
            preview.innerHTML += `<p>${resultText}</p>`;
        }
        else {
            htmlOutput.textContent += `${line}`;
            preview.innerHTML += `${line}`;
        }
    });
    return htmlOutput.textContent;
}
markdownInput.addEventListener('input', () => {
    console.log(convertMarkdown())
})

