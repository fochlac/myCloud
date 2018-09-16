import { loadGalleries, login, register } from 'STORE/actions'

import ButtonBar from 'RAW/ButtonBar'
import Dialog from 'RAW/Dialog'
import ImmuTypes from 'react-immutable-proptypes'
import InputRow from 'RAW/InputRow'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { generateHash } from '../../utils/crypto'
import styles from './LoginButton.less'

const initialState = {
  showLogin: false,
  name: '',
  password: '',
}

const ui = {
  name: /^[a-zA-Z0-9]{5,20}$/,
  password: /^.{5,200}$/,
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
    const { error } = this.state
    const buttons = [
      { type: 'secondary', text: 'Abbrechen', onClick: () => this.setState(initialState) },
      { text: 'Anmelden', onClick: this.login },
      { text: 'Registrieren', onClick: this.register },
    ]

    return (
      <Dialog header="Anmeldung" onClose={() => this.setState(initialState)}>
        <div className={styles.wrapper}>
          {error && (
            <div className={styles.error}>Fehler bei der Anmeldung. Bitte versuche es erneut.</div>
          )}
          <InputRow
            label="Name"
            onChange={name => this.setState({ name })}
            userInterface={ui.name}
          />
          <InputRow
            label="Passwort"
            type="password"
            userInterface={ui.password}
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
    this.props
      .login({ name, password })
      .then(() => {
        this.setState(initialState)
        this.props.loadGalleries()
      })
      .catch(() => this.setState({ error: true }))
  }

  async register() {
    let { name, password } = this.state
    password = await generateHash(password)
    this.props
      .register({ name, password })
      .then(() => {
        this.setState(initialState)
        this.props.loadGalleries()
      })
      .catch(() => this.setState({ error: true }))
  }
}

LoginButton.propTypes = {
  user: ImmuTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    urls: ImmuTypes.list,
  }),
  loadGalleries: PropTypes.func,
  login: PropTypes.func,
  register: PropTypes.func,
}

export default connect(
  state => ({
    user: state.get('user'),
  }),
  { login, register, loadGalleries },
)(LoginButton)
