import { __extends, __makeTemplateObject } from "tslib";
// Import the LitElement base class and html helper function
import { LitElement, html } from 'lit-element';
// Extend the LitElement base class
var OptionBuilder = /** @class */ (function (_super) {
    __extends(OptionBuilder, _super);
    function OptionBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Implement `render` to define a template for your element.
     *
     * You must provide an implementation of `render` for any element
     * that uses LitElement as a base class.
     */
    OptionBuilder.prototype.render = function () {
        /**
         * `render` must return a lit-html `TemplateResult`.
         *
         * To create a `TemplateResult`, tag a JavaScript template literal
         * with the `html` helper function:
         */
        return html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      <!-- template content -->\n      <p>A paragraph</p>\n    "], ["\n      <!-- template content -->\n      <p>A paragraph</p>\n    "])));
    };
    return OptionBuilder;
}(LitElement));
// Register the new element with the browser.
customElements.define('option-builder', OptionBuilder);
var templateObject_1;
//# sourceMappingURL=option-builder.js.map