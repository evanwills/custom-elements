// Import the LitElement base class and html helper function
import { LitElement, html } from 'lit-element';

// Extend the LitElement base class
class LabeledInput extends LitElement {
  constructor () {
    super()

    this.id = 0
    this.optID = 0
    this._labelOnly = false

    this.labelOnlyClass = ' labeledInput--value-label'
    this.hasError = false
    this.isIgnoredClass = ''
    this.hasNoticeClass = ''
    this.hasErrorValue = ''
    this.hasErrorInput = ''
    this.valueInput = ''
    this.labelInput = ''
    this.message = ''
    this.messageType = ''
    this.maxLength = 100

    this.inputChange = null
    this.labelChange = null
    this.labelBlur = null
    this.labelTitle = 'Value shown to user and in PDF'
    this.labelPlaceholder = 'Human friendly value'
  }

  static get properties () {
    return {
      id: { type: Number },
      maxLength: { type: Number },
      _labelOnly: { type: Boolean, attribute: 'labelonly' },
      hasError: { type: Boolean },
      hasWarning: { type: Boolean },
      isIgnored: { type: Boolean },
      hasErrorClass: { type: String },
      message: { type: String, reflect: false },
      valueInput: { type: String, attribute: 'value' },
      labelInput: { type: String, attribute: 'input' }
    }
  }

  /**
   * Change whether the input shows both value and label or label only
   * @param boolean val
   */
  static set labelOnly (val) {
    if (typeof val === 'boolean') {
      let labelOnly = this._labelOnly
      let labelOnlyClass = ' labeledInput--value-label'
      let labelTitle = 'Value shown to user and in PDF'
      let labelPlaceholder = 'Human friendly value'

      if (val === true) {
        labelOnlyClass = ' labeledInput--label-only'
        labelTitle = 'Same value used in CSV, shown in to user and in PDF'
        labelPlaceholder = 'CSV & Human friendly value'
      }
      
      this.requestUpdate('labelOnly', labelOnly);
      this.requestUpdate('labelOnlyClass', labelOnlyClass);
      this.requestUpdate('labelTitle', labelTitle);
      this.requestUpdate('labelPlaceholder', labelPlaceholder);
    }
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * You must provide an implementation of `render` for any element
   * that uses LitElement as a base class.
   */
  render() {
    /**
     * `render` must return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function:
     */
    return html`
      <li id="option-${this.optID}" class="labeledInput${this.labelOnlyClass}${this.hasNoticeClass}" role="group" aria-labeledby="option-${this.optID}-label">
        <h2 id="option-${this.optID}-label">Option ${this.optID}</h2>
        ${this._labelOnly ? html`
        <label for="option-value-${this.optID}" class="option-value__label">Value</label>
        <input type="text"
               name="option-value-${this.optID}" 
               id="option-value-${this.optID}" 
               .value="${this.valueInput}"
               .maxlength="${this.maxLength}" 
               ?hasError="${this.hasErrorValue}"
               class="option-value__input" 
               pattern="^[\w0-9 .'()/\-!?&]*$" 
               placeholder="CSV value" 
               title="Value shown in CSV"
               @change="${this.inputChange}"
        />
        <label for="option-label-${this.optID}" class="option-label__label">Label</label>` : html``}
        <input type="text"
               name="option-label-${this.optID}" 
               id="option-label-${this.optID}" 
               .value="${this.labelInput}"
               .maxlength="${this.maxLength}" 
               ?hasError="${this.hasErrorInput}"
               class="option-label__input" 
               pattern="^[\w0-9 .'()/\-!?&]*$" 
               placeholder="${this.labelPlaceholder}" 
               title="${this.labelTitle}" 
               @change="${this.labelChange}"
               @blur="${this.labelBlur}"
        />
        ${this.message ? html`<span class="option-input__${$this.messageType}">${this.message}</span>`: html``}
      </li>
    `;
  }
}
// Register the new element with the browser.
customElements.define('label-input', LabeledInput);

