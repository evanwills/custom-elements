// Import the LitElement base class and html helper function
import { LitElement, css, html } from 'lit-element'

// Extend the LitElement base class
/**
 * <labeled-input id="0" labelonly value="" label="" maxlength="100"></labeled-input>
 */
class LabeledInput extends LitElement {
  constructor () {
    super()

    this._id = 0
    this._labelOnly = false
    this._maxLength = 100

    this.hasError = false
    this.hasNoticeClass = ''
    this.hasWarning = false
    this.isIgnored = false
    this.labelHasError = false
    this.labelInput = ''
    this.labelOnlyClass = ' labeledInput--value-label'
    this.message = ''
    this.messageType = ''
    this.optID = 0
    this.valueHasError = false
    this.valueInput = ''

    this.sanitiseInput = this.getSanitise(this._maxLength)
    this.valueChange = this.getInputChange('value')
    this.labelChange = this.getInputChange('label')
    this.labelBlur = null
    this.labelTitle = 'Value shown to user and in PDF'
    this.labelPlaceholder = 'Human friendly value'
  }

  static get properties () {
    return {
      _id: { type: Number, attribute: 'id' },
      _labelOnly: { type: Boolean, attribute: 'labelonly' },
      _maxLength: { type: Number, attribute: 'maxlength' },

      hasError: { type: Boolean },
      hasNoticeClass: { type: String, reflect: false },
      hasWarning: { type: Boolean },
      isIgnored: { type: Boolean },
      labelHasError: { type: Boolean, reflect: false },
      labelInput: { type: String, attribute: 'label' },
      message: { type: String, reflect: false },
      messageType: { type: String, reflect: false },
      optID: { type: Number, reflect: false },
      valueHasError: { type: Boolean, reflect: false },
      valueInput: { type: String, attribute: 'value' }
    }
  }

  /**
   * Change whether the input shows both value and label or label only
   * @param boolean val
   */
  static set labelOnly (val) {
    if (typeof val === 'boolean') {
      const labelOnly = this._labelOnly
      let labelOnlyClass = ' labeledInput--value-label'
      let labelTitle = 'Value shown to user and in PDF'
      let labelPlaceholder = 'Human friendly value'

      if (val === true) {
        labelOnlyClass = ' labeledInput--label-only'
        labelTitle = 'Same value used in CSV, shown in to user and in PDF'
        labelPlaceholder = 'CSV & Human friendly value'
      }

      this.requestUpdate('labelOnly', labelOnly)
      this.requestUpdate('labelOnlyClass', labelOnlyClass)
      this.requestUpdate('labelTitle', labelTitle)
      this.requestUpdate('labelPlaceholder', labelPlaceholder)
    }
  }

  static set id (input) {
    if (typeof (input * 1) === 'number' && input >= 0) {
      const oldOptID = this.optID
      this._id = input.parseInt(input, 10)
      this.optID = this._id + 1
      this.requestUpdate('optID', oldOptID)
    }
  }

  static set maxlength (input) {
    if (typeof (input * 1) === 'number' && input >= 10) {
      const oldMaxLength = this._maxLength
      this._maxLength = input.parseInt(input, 10)
      if (oldMaxLength !== this._maxLength) {
        this.sanitiseInput = this.getSanitise(this._maxLength)
      }
      this.requestUpdate('maxlength', oldMaxLength)
    }
  }

  static get styles () {
    return css`
      div { color: red; }
    `
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * You must provide an implementation of `render` for any element
   * that uses LitElement as a base class.
   */
  render () {
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
               .maxlength="${this._maxLength}"
               ?hasError="${this.hasErrorValue}"
               class="option-value__input"
               pattern="^[\w0-9 .'()/\-!?&]*$"
               placeholder="CSV value"
               title="Value shown in CSV"
               @keyup="${this.sanitiseInput}"
               @change="${this.valueChange}"
        />
        <label for="option-label-${this.optID}" class="option-label__label">Label</label>` : html``}
        <input type="text"
               name="option-label-${this.optID}"
               id="option-label-${this.optID}"
               .value="${this.labelInput}"
               .maxlength="${this._maxLength}"
               ?hasError="${this.hasErrorInput}"
               class="option-label__input"
               pattern="^[\w0-9 .'()/\-!?&]*$"
               placeholder="${this.labelPlaceholder}"
               title="${this.labelTitle}"
               @keyup="${this.sanitiseInput}"
               @change="${this.labelChange}"
               @blur="${this.labelBlur}"
        />
        ${this.message ? html`<span class="option-input__${this.messageType}">${this.message}</span>` : html``}
      </li>
    `
  }

  /**
   * Get a callback function to beuse as the event handler for
   * onchange events. Sets the value for the "label" or "value"
   * properties for the custom element
   *df
   * @param {string} type Either "label" or "value"
   *
   * @returns function
   */
  getInputChange (type) {
    const labeledInput = this
    const thisType = (type === 'label') ? 'label' : 'value'

    return function (e) {
      labeledInput[thisType] = this.value
      labeledInput.testValueLabel()
    }
  }

  /**
   * Get a callback function to be used as the event handler for
   * onKeyUP events for sanitising user input
   *
   * @param {number} maxLength the maximum length the user input
   *                           allows
   *
   * @returns {function} Strip out any invalid characters from a
   *                     user input
   */
  getSanitise (maxLength) {
    return function (e) {
      const tmp = this.value.replace(/[^\w0-9 .'()\\/\-!?&]+/, '')
      this.value = (tmp.length > maxLength) ? tmp.substr(0, maxLength) : tmp
    }
  }

  /**
   * testValueLabel compares the value & label inputs to check if
   * there are any issues with them and updated the all the error
   * state for the element
   *
   * @returns void
   */
  testValueLabel () {
    if (this._labelOnly === true) {
      // Label only so make the value input match the label input
      this.valueInput = this.labelInput
    }

    if (this.valueInput !== '' && this.labelInput === '') {
      // One is empty which is not OK
      // let them know there's an error
      this.message = 'This option is invalid. Value input is not empty but Label input is empty.'
      this.hasNoticeClass = 'labeled-input--error'
      this.isIgnored = false
      this.hasWarning = false
      this.hasError = true
      this.valueHasError = false
      this.labelHasError = true
    } else if (this.valueInput === '' && this.labelInput !== '') {
      // One is empty which is not OK
      // let them know there's an error
      this.message = 'This option is invalid. Value input is empty but Label input is not empty.'
      this.hasNoticeClass = 'labeled-input--error'
      this.isIgnored = false
      this.hasWarning = false
      this.hasError = true
      this.valueHasError = true
      this.labelHasError = false
    } else if (this.valueInput === '' && this.labelInput === '') {
      // Both are empty, which is OK but just let people know
      // that it will be ignored
      this.message = 'This option is ignored because both value and label inputs are empty'
      this.hasNoticeClass = 'labeled-input--notice'
      this.isIgnored = true
      this.hasWarning = true
      this.hasError = false
      this.valueHasError = false
      this.labelHasError = false
    } else {
      // All good here
      this.message = ''
      this.hasNoticeClass = ''
      this.hasWarning = false
      this.isIgnored = false
      this.hasError = false
      this.valueHasError = false
      this.labelHasError = false
    }
  }
}

// Register the new element with the browser.
customElements.define('labeled-input', LabeledInput)
