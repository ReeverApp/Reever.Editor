var CategoryHeader = /** @class */ (function () {
    function CategoryHeader(_a) {
        var config = _a.config;
        this.text = (config === null || config === void 0 ? void 0 : config.text) || 'Category';
        this.wrapper = document.createElement('div');
    }
    Object.defineProperty(CategoryHeader, "toolbox", {
        get: function () {
            return {
                title: '',
                icon: '<svg width="0" height="0"></svg>',
            };
        },
        enumerable: false,
        configurable: true
    });
    CategoryHeader.prototype.render = function () {
        this.wrapper.classList.add('ce-category-header');
        this.wrapper.contentEditable = 'false';
        this.wrapper.textContent = this.text;
        return this.wrapper;
    };
    CategoryHeader.prototype.save = function () {
        return { text: this.wrapper.textContent || '' };
    };
    return CategoryHeader;
}());
export default CategoryHeader;
