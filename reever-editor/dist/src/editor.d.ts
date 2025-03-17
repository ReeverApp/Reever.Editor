export declare class ReeverEditor {
    editorEl: HTMLElement;
    constructor(editorSelector: string);
    bold(): void;
    italic(): void;
    underline(): void;
    toggleHeading(level: number): void;
    unorderedList(): void;
    insertImage(url: string): void;
    setContent(html: string): void;
    getContent(): string;
    queryCommandState(command: string): boolean;
    queryFormatBlock(): string;
}
