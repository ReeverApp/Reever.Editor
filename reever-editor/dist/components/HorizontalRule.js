var HorizontalRule = /** @class */ (function () {
    function HorizontalRule() {
    }
    Object.defineProperty(HorizontalRule, "toolbox", {
        get: function () {
            return {
                title: 'Horizontal Rule',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/></svg>'
            };
        },
        enumerable: false,
        configurable: true
    });
    HorizontalRule.prototype.render = function () {
        var hr = document.createElement('hr');
        hr.style.border = 'none';
        hr.style.borderTop = '1px solid #E5E7EB'; // Tailwind Gray-200
        return hr;
    };
    HorizontalRule.prototype.save = function () {
        return {};
    };
    return HorizontalRule;
}());
export default HorizontalRule;
