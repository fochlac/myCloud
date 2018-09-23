import PropTypes from 'prop-types'
import React from 'react'
import styles from './InputRow.less'
let index = 0

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
    this.id = `input_${index++}`
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
      id = this.id,
      label,
      type,
      valid,
      placeholder,
      element,
      autoFocus,
      disabled,
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
          disabled={disabled}
          autoComplete={autoComplete}
          value={value}
          onChange={this.handleInput}
          autoFocus={autoFocus}
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
  required: false,
  className: styles.fullWidth,
  userInterface: /.*/,
  element: 'input',
}

InputRow.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  userInterface: PropTypes.any,
  autoComplete: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.any,
  type: PropTypes.string,
  valid: PropTypes.bool,
  placeholder: PropTypes.string,
  element: PropTypes.any,
  autoFocus: PropTypes.bool,
}

export default InputRow
