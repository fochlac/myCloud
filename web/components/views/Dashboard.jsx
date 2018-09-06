import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'CONNECTED/DefaultPage'
import GalleryList from 'CONNECTED/GalleryList'
import React from 'react'
import { connect } from 'react-redux'
import { loadGalleries } from 'STORE/actions.js'
import style from './Dashboard.less'

export class Dashboard extends React.Component {
  componentDidMount() {
    this.props.loadGalleries()
  }

  render() {
    const { app } = this.props
    const busy = app.get('busy').includes('DASHBOARD')

    return (
      <DefaultPage>
        {busy && <BusyScreen />}
        <GalleryList />
      </DefaultPage>
    )
  }
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  posts: store.get('posts'),
})

export default connect(
  mapStoreToProps,
  { loadGalleries },
)(Dashboard)
