export class ReeverEditor {
    editorEl;
    constructor(editorSelector) {
        const el = document.querySelector(editorSelector);
        if (!el)
            throw new Error("Editor bulunamadı");
        this.editorEl = el;
        this.editorEl.contentEditable = "true";
    }
    bold() { document.execCommand("bold"); this.editorEl.focus(); }
    italic() { document.execCommand("italic"); this.editorEl.focus(); }
    underline() { document.execCommand("underline"); this.editorEl.focus(); }
    toggleHeading(level) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0)
            return;
        const range = selection.getRangeAt(0);
        let container = selection.anchorNode;
        if (container.nodeType === Node.TEXT_NODE) {
            container = container.parentElement;
        }
        if (container && container.tagName.toLowerCase() === `h${level}`) {
            document.execCommand('formatBlock', false, 'p');
        }
        else {
            document.execCommand('formatBlock', false, `h${level}`);
        }
        this.editorEl.focus();
    }
    unorderedList() { document.execCommand("insertUnorderedList"); this.editorEl.focus(); }
    insertImage(url) { document.execCommand("insertImage", false, url); this.editorEl.focus(); }
    setContent(html) { this.editorEl.innerHTML = html; }
    getContent() { return this.editorEl.innerHTML; }
    // Yeni metod: Aktif durumu kontrol etmek
    queryCommandState(command) {
        return document.queryCommandState(command);
    }
    queryFormatBlock() {
        return document.queryCommandValue("formatBlock");
    }
}
