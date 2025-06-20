interface CategoryHeaderConfig {
    text?: string;
}
export default class CategoryHeader {
    wrapper: HTMLElement;
    text: string;
    static get toolbox(): {
        title: string;
        icon: string;
    };
    constructor({ config }: {
        config?: CategoryHeaderConfig;
    });
    render(): HTMLElement;
    save(): {
        text: string;
    };
}
export {};
//# sourceMappingURL=CategoryHeader.d.ts.map