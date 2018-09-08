import Image from './Image'
import { Link } from 'react-router-dom'
import { Map } from 'immutable'
import React from 'react'
import styles from './GalleryCard.less'
import InputRow from './InputRow'

class CreateGalleryCard extends React.Component {
  constructor(props) {
    super()

    this.state = {
      name: '',
      description: ''
    }

    this.submit = this.submit.bind(this)
  }

  render() {
    return (
      <div className={styles.card}>
        <h3 className={styles.head}>Gallerie hinzufügen</h3>
        <InputRow onChange={(name) => this.setState({name})} label="Name" required={true}/>
        <InputRow onChange={(description) => this.setState({description})} label="Description" element="textarea"/>
        <button className={styles.button} onClick={this.submit}>Abschicken</button>
      </div>
    )
  }

  submit() {
    const {props: {createGallery, parent}, state: {name, description}} = this

    createGallery({parent, name, description})
  }
}

CreateGalleryCard.defaultProps = {
  parent: ''
}

export default CreateGalleryCard
