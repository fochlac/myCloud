import ImmuTypes from 'immutable-prop-types'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import styles from './LoginButton.less'
import { login, register } from 'STORE/actions'
import Dialog from 'RAW/Dialog'
import InputRow from 'RAW/InputRow'
import ButtonBar from 'RAW/ButtonBar'
import { generateHash } from '../../utils/crypto'

const initialState = {
  showLogin: false,
  name: '',
  password: '',
}

class LoginButton extends React.Component {
  constructor() {
    super()
    this.state = initialState

    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
  }

  render() {
    const { user } = this.props
    const { showLogin } = this.state

    return (
      <div className={styles.iconWrapper}>
        {!user.get('id') && (
          <span
            className="fa fa-lg fa-sign-in"
            onClick={() => this.setState({ showLogin: true })}
          />
        )}
        {user.get('id') && <span className="fa fa-lg fa-user" title={user.get('name')} />}
        {showLogin && this.renderLogin()}
      </div>
    )
  }

  renderLogin() {
    const buttons = [
      { type: 'secondary', text: 'Abbrechen', onClick: () => this.setState(initialState) },
      { text: 'Anmelden', onClick: this.login },
      { text: 'Registrieren', onClick: this.register },
    ]

    return (
      <Dialog header="Anmeldung">
        <div className={styles.wrapper}>
          <InputRow label="Name" onChange={name => this.setState({ name })} />
          <InputRow
            label="Passwort"
            type="password"
            onChange={password => this.setState({ password })}
          />
          <ButtonBar buttons={buttons} />
        </div>
      </Dialog>
    )
  }

  async login() {
    let { name, password } = this.state
    password = await generateHash(password)
    this.props.login({ name, password })
  }

  async register() {
    let { name, password } = this.state
    password = await generateHash(password)
    this.props.register({ name, password })
  }
}

LoginButton.propTypes = {
  user: ImmuTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    urls: ImmuTypes.list,
  }),
  login: PropTypes.func,
  register: PropTypes.func,
}

export default connect(
  state => ({
    user: state.get('user'),
  }),
  { login, register },
)(LoginButton)
