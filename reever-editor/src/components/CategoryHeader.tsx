interface CategoryHeaderData {
    text?: string;
}

interface CategoryHeaderConfig {
    data?: CategoryHeaderData;
    api?: any;
}

export default class CategoryHeader {
    wrapper: HTMLElement;
    data: CategoryHeaderData;
    api: any;

    // Toolbox statik fonksiyonunu tamamen boş bırakın
    static get toolbox() {
        return {
            title: '',
            icon: '<svg width="0" height="0"></svg>',
        };
    }

    constructor({ data, config, api }: CategoryHeaderConfig & { config?: { text?: string } }) {
        this.api = api;
        this.data = { text: config?.text || data?.text || '' };
        this.wrapper = document.createElement('div');
    }

    render() {
        this.wrapper.classList.add('ce-category-header');
        this.wrapper.contentEditable = 'false';
        this.wrapper.textContent = this.data.text || '';

        return this.wrapper;
    }

    save() {
        return { text: this.wrapper.textContent || '' };
    }
}