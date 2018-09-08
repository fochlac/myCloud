import styles from './ImageUploader.less'

import React from 'react'
import Image from 'RAW/Image'
import {createImage} from 'STORE/actions'
import { connect } from 'react-redux'

export class ImageUploader extends React.Component {
  constructor(props) {
    super()
    this.state = {
      uploadPromise: Promise.resolve(),
    }
  }

  handleNewFile(evt) {
    const {parent, createImage} = this.props
    const files = evt.target.files
    console.log(files)

    let uploadPromise = this.state.uploadPromise

    for (let x = 0; x < files.length; x++) {
      uploadPromise = uploadPromise.then(createImage(files[x], parent))
    }

    this.setState({ uploadPromise })
  }

  render() {
    return (
      <div className>
        <div className={styles.uploadWrapper}>
          <Image />
          <button>Bilder Hochladen</button>
          <input
            type="file"
            name="Image"
            className={styles.input}
            onChange={evt => this.handleNewFile(evt)}
          />
        </div>
      </div>
    )
  }
}

export default connect(  () => ({}),  dispatch => ({ createImage: (file, parent) => dispatch(createImage(file, parent)) }))(ImageUploader)
