import React from 'react'
import styles from './InputRow.less'
class InputRow extends React.Component {
  constructor(props) {
    super()

    this.state = {
      value: props.defaultValue || '',
      dirty: false,
      isValid: true,
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

  handleInput({ target }) {
    const { onChange, userInterface = /.*/ } = this.props

    this.setState({ value: target.value }, () => {
      if (onChange) {
        const { value } = this.state
        const { valid } = this.props
        const isValid = valid !== undefined ? valid : userInterface.test(value.trim())

        onChange(value.trim(), isValid)
      }
    })
  }

  handleBlur() {
    const { onBlur, userInterface = /.*/ } = this.props

    if (this.state.value.length || !this.state.dirty) {
      this.setState({ dirty: true })
    }
    if (onBlur) {
      const { value } = this.state
      const { valid } = this.props
      const isValid = valid !== undefined ? valid : userInterface.test(value.trim())

      onBlur(value.trim(), isValid)
    }
  }

  render() {
    const { dirty, value } = this.state
    const {
      className,
      required,
      userInterface,
      autoComplete,
      id,
      label,
      type,
      valid,
      placeholder,
      element,
    } = this.props

    const HtmlElement = element

    return (
      <div className={`${className} ${styles.wrapper}`}>
        {label && (
          <label className={styles.label} htmlFor={id}>
            {label}
            {required && <span className={`fa fa-asterisk ${styles.required}`} />}
          </label>
        )}
        <HtmlElement
          type={type}
          id={id}
          autoComplete={autoComplete}
          value={value}
          onChange={this.handleInput}
          className={
            (valid !== undefined
            ? !valid
            : dirty && !userInterface.test(value.trim()))
              ? styles.invalid
              : ''
          }
          onBlur={this.handleBlur}
          placeholder={placeholder}
        />
      </div>
    )
  }
}

InputRow.defaultProps = {
  type: 'text',
  id: `input_${Math.floor(Date.now() * Math.random())}`,
  required: false,
  className: styles.fullWidth,
  userInterface: /.*/,
  element: 'input',
}

export default InputRow
