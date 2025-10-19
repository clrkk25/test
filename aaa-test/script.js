function  convertMarkdown() {
    const markdown = document.getElementById('markdown-input').value;
    const html = marked.parse(markdown);
    document.getElementById('html-output').textContent = html;
    document.getElementById('preview').innerHTML = html;
}