interface CategoryHeaderConfig {
    text?: string;
}

export default class CategoryHeader {
    wrapper: HTMLElement;
    text: string;

    static get toolbox() {
        return {
            title: '',  // Bu alan toolbox'ta boş kalmalı
            icon: '<svg width="0" height="0"></svg>',
        };
    }

    constructor({ config }: { config?: CategoryHeaderConfig }) {
        this.text = config?.text || 'Category';
        this.wrapper = document.createElement('div');
    }

    render() {
        this.wrapper.classList.add('ce-category-header');
        this.wrapper.contentEditable = 'false';
        this.wrapper.textContent = this.text;

        return this.wrapper;
    }

    save() {
        return { text: this.wrapper.textContent || '' };
    }
}