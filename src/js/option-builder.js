// Import the LitElement base class and html helper function
import { LitElement, css, html } from 'lit-element'
// import LabeledInput from './labeled-input'

// Extend the LitElement base class
/**
 * <option-builder source="" controller="" label=""></option-builder>
 */
class OptionBuilder extends LitElement {
  constructor () {
    super()

    this.options = []
    this.modeChange = null
    this._labelOnly = false
    this._type = 'select'
    this._sourceID = ''
    this._controllerID = ''
    this._labelID = ''
    this.maxLength = 255
    this.outputJson = false
    this.writeRaw = null
    this.controllerField = null
    this.controllerChange = null
    this.labelField = null
    this.labelChange = null
    this.sourceField = null
  }

  static get styles () {
    return css`
      div { color: red; }
    `
  }

  set type (value) {
    let ok = false
    switch (value) {
      case 'select':
      case 'radio':
      case 'checkbox':
        ok = true
        this._type = value
        this.classList.remove('hide')
        break
      default:
        this.classList.add('hide')
    }
    if (ok === true) {
      this.maxLength = (this._type === 'select') ? 255 : 100
    }
  }

  static get properties () {
    return {
      _controllerID: { type: String, attribute: 'controllerid' },
      _sourceID: { type: String, attribute: 'sourceid' },
      _labelID: { type: String, attribute: 'labelid' },
      _labelTxt: { type: String, reflect: false },
      _type: { type: String, attribute: 'type' },

      maxLength: { type: Number, reflect: false },
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

  connectedCallback () {
    super.connectedCallback()
    this.controllerField = document.getElementById(this._controllerID)
    if (this.controllerField === null || this.controllerField.localName !== 'select') {
      throw Error(
        '<option-builder> custom element expects ' +
        '"controller" attribute to contain an ID for a select ' +
        'element to use to control what examples look like the ' +
        'select must contain at least one of the following ' +
        'options: "select", "radio" or "checkbox"'
      )
    } else {
      const b = this.controllerField.length
      let opt = 0
      for (let a = 0; a < b; a += 1) {
        const type = this.controllerField[a].value.toLowerCase()
        if (type === 'select' || type === 'radio' || type === 'checkbox') {
          opt = 1
          if (this.controllerField[a].selected === true) {
            this.type = type
          }
          break
        }
      }
      if (opt < 1) {
        console.error(
          '<option-builder> custom element expects ' +
          '"controller" attribute to contain an ID for a select ' +
          'element to use to control what examples look like the ' +
          'select must contain at least one of the following ' +
          'options: "select", "radio" or "checkbox"'
        )
      } else {
        this.controllerChange = this.getControllerChange()
        this.controllerField.addEventListener('change', this.controllerChange)
      }
    }
    this.labelField = document.getElementById(this._labelID)
    if (this.labelField === null ||
        this.labelField.localName !== 'input' ||
        this.labelField.type !== 'text'
    ) {
      throw Error(
        '<option-builder> custom element expects ' +
        '"label" attribute to contain an ID for a text input ' +
        'element to use to as the source for the label of the ' +
        'example fields'
      )
    } else {
      this.labelChange = this.getLabelChange()
      this.labelField.addEventListener('change', this.labelChange)
    }
    this.sourceField = document.getElementById(this._sourceID)
    if (this.sourceField === null ||
        this.sourceField.localName !== 'input' ||
        this.sourceField.type !== 'text'
    ) {
      throw Error(
        '<option-builder> custom element expects ' +
        '"source" attribute to contain an ID for a text input ' +
        'element to use to as the source of raw data for ' +
        '<option-builder> and the destination for the output of ' +
        '<option-builder>'
      )
    } else {
      this.sourceField.readOnly = true
      const raw = this.sourceField.value
      if (raw !== '') {
        if (raw.match(/^(?:[^^~]+\^[^^~]+(?:~[^^~]+\^[^^~]+)*)?$/)) {
          this.outputJSON = false
          this.options = this.parseTilda(raw)
          this.writeRaw = this.writeTilda
        } else {
          try {
            this.options = this.parseJSON(raw)
          } catch (e) {
            console.error(e)
            console.error(
              'option-builder custom element expects atttribute ' +
              '"raw" to be either tilda/carat seperated value ' +
              'string or JSON. Supplied JSON was invalid.'
            )
            return false
          }
          this.writeRaw = this.writeJSON
          this.outputJSON = true
        }
      }
    }
    console.log('this.options (172):', this.options)
  }

  disconnectedCallback () {
    this.controllerField.removeEventListener('change', this.controllerChange)
    super.disconnectedCallback()
  }

  /**
   * Implement `render` to define a template for your element.
   *
   * You must provide an implementation of `render` for any element
   * that uses LitElement as a base class.
   */
  render () {
    console.log('line 180')
    /**
     * `render` must return a lit-html `TemplateResult`.
     *
     * To create a `TemplateResult`, tag a JavaScript template literal
     * with the `html` helper function:
     */
    return html`
      <div role="group" aria-labeledby="option-build-label" class="opt-build">
        <h1 id="option-build-label">${this._type} option builder</h1>
        <span class="checkBtn checkBtn--label-only">
          <input
            type="radio"
            name="single-double"
            id="single-double--single"
            class="checkBtn__input"
            value="1"
            @change="${this.modeChange}"
          />
          <label
            for="single-double--single"
            class="checkBtn__label"
            title="Value & label are the same">Label only</label>
        </span>
        <span class="checkBtn checkBtn--value-label">
          <input
            type="radio"
            name="single-double"
            id="single-double--double"
            class="checkBtn__input"
            value="2"
            checked="checked"
          />
          <label
            for="single-double--double"
            class="checkBtn__label"
            title="Separate value label pairs">Value/label pairs</label>
        </span>
        <p class="exampl">
          <label>${this._labelTxt}</label>
          ${(this._type === 'select')
            ? html`<select>
              ${this.options.map((item) => {
                return (item.value !== '' && item.label !== '')
                  ? html`<option value="${item.value}">${item.label}</option>`
                  : html``
              })}
              </select>`
            : html`<span>
              ${this.options.map((item, i) => {
                return (item.value !== '' && item.label !== '')
                  ? html`
                      <span class="checkable-btn">
                        <input type="${this._type}" value="${item.value}" id="radio-${i}" name="radio" class="checkable-btn__input">
                        <label for="radio-${i}" class="checkable-btn__label">${item.label}</label>
                      </span>`
                  : html``
              })}
              </span>`}
        </p>
        <ul class="labeledInputs labeledInputs--${this._labelOnly ? 'label-only' : 'value-label'}">
          ${this.options.map((item, i) => {
            return html`
              <labeled-input id="${i} .labelonly="${this._labelOnly}" value="${item.value}" label="${item.label}" .maxlength="${this.maxLength}"></labeled-input>
              `
            })}
        </ul>
      </div>
    `
  }

  getLabelChange () {
    const optBuild = this
    console.log('line 260')
    return function (e) {
      optBuild._labelTxt = this.value
    }
  }

  getControllerChange () {
    const optBuild = this
    console.log('line 268')
    return function (e) {
      optBuild.type = this.value
    }
  }

  /**
   * Parse raw string value as tilda/carat seperate values into an
   * array of label value pairs
   *
   * @var {string} input Value to be parsed into an array of
   *                     value/label pairs
   *
   * @returns array
   */
  parseTilda (input) {
    console.log('line 285')
    console.log('input:', input)
    const output = []
    if (input.match(/^(?:[^^~]+\^[^^~]+(?:~[^^~]+\^[^^~]+)*)?$/)) {
      const options = input.split('~')
      for (const option in options) {
        const tmp = options[option].split('^')
        output.push({
          value: tmp[0],
          label: (typeof tmp[1] === 'string') ? tmp[1] : tmp[0]
        })
      }
    } else {
      throw Error
    }
    return output
  }

  /**
   * Parse raw string value as JSON into an array of label value
   * pairs
   *
   * @var {string} input JSON value to be parsed into an array of
   *                     value/label pairs
   *
   * @returns array
   */
  parseJSON (input) {
    console.log('line 312')
    let json = null
    try {
      json = JSON.parse(input)
    } catch (e) {
      console.error(e)
      throw Error('"raw" JSON value was invalid')
    }

    const output = []
    const keys = Object.keys(json)

    for (const key in keys) {
      if (typeof json[keys[key]] === 'string' || typeof json[keys[key]] === 'number') {
        output.push({
          value: keys[key],
          label: json[keys[key]]
        })
      } else {
        throw Error(
          'values in "raw" JSON must be either string or numbers. "' +
          typeof json[keys[key]] + '" is not allowed'
        )
      }
    }
    return output
  }

  /**
   * Write the list of options built by option-builder to a
   * tilda/carat seperated string usable by the calling application
   *
   * @returns string
   */
  writeTilda (data) {
    console.log('line 347')
    let output = ''
    let sep = ''
    for (const option in data) {
      output += sep + data[option].value + '^' + data[option].label
      sep = '~'
    }
    return output
  }

  /**
   * Write the list of options built by option-builder to a JSON
   * string usable by the calling application
   *
   * @returns string
   */
  writeJSON (data) {
    console.log('line 364')
    const output = {}
    for (const option in data) {
      output[data[option].value] = data[option].label
    }
    return JSON.stringify(output)
  }
}

// Register the new element with the browser.
customElements.define('option-builder', OptionBuilder)
