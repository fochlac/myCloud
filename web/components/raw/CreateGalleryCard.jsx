import ButtonBar from 'RAW/ButtonBar'
import ImmuTypes from 'react-immutable-proptypes'
import InputRow from './InputRow'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './CreateGalleryCard.less'

class CreateGalleryCard extends React.Component {
  constructor(props) {
    super()

    this.state = {
      name: props.gallery ? props.gallery.get('name') : '',
      description: props.gallery ? props.gallery.get('description') : '',
    }

    this.submit = this.submit.bind(this)
  }

  render() {
    const buttons = [
      {
        text: 'Abbrechen',
        onClick: this.props.onClose,
        type: 'secondary',
      },
      {
        text: 'Abschicken',
        onClick: this.submit,
      },
    ]
    return (
      <div className={styles.card}>
        <h3 className={styles.head}>Galerie hinzufügen</h3>
        <InputRow
          onChange={name => this.setState({ name })}
          defaultValue={this.state.name}
          label="Name"
          required={true}
          autoFocus={true}
        />
        <InputRow
          defaultValue={this.state.description}
          onChange={description => this.setState({ description })}
          label="Beschreibung"
          element="textarea"
        />
        <ButtonBar buttons={buttons} />
      </div>
    )
  }

  submit() {
    const {
      props: { onSubmit, parent, gallery },
      state: { name, description },
    } = this

    let response = gallery || { parent, name, description }
    if (gallery) {
      response = response.set('name', name)
      response = response.set('description', description)
    }

    onSubmit(response)
  }
}

CreateGalleryCard.defaultProps = {
  parent: '',
}

CreateGalleryCard.propTypes = {
  gallery: ImmuTypes.map,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  parent: PropTypes.string,
}

export default CreateGalleryCard
