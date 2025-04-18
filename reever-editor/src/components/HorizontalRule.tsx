export default class HorizontalRule {
    static get toolbox() {
        return {
            title: 'Horizontal Rule',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="12" x2="20" y2="12"/></svg>'
        };
    }

    render() {
        const hr = document.createElement('hr');
        hr.style.border = 'none';
        hr.style.borderTop = '1px solid #E5E7EB'; // Tailwind Gray-200
        return hr;
    }

    save() {
        return {};
    }
}