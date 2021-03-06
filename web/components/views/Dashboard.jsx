import BusyScreen from 'RAW/BusyScreen'
import DefaultPage from 'RAW/DefaultPage'
import GalleryList from 'CONNECTED/GalleryList'
import ImmuTypes from 'react-immutable-proptypes'
import { List } from 'immutable'
import React from 'react'
import { connect } from 'react-redux'

class Dashboard extends React.Component {
  render() {
    const { app, galleries } = this.props
    const busy = app.get('busy').includes('DASHBOARD')

    return (
      <DefaultPage>
        {(busy && <BusyScreen />) || null}
        <GalleryList elements={findRootGalleries(galleries)} />
      </DefaultPage>
    )
  }
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  galleries: store.get('galleries'),
})

Dashboard.propTypes = {
  app: ImmuTypes.map.isRequired,
  galleries: ImmuTypes.map.isRequired,
}

export default connect(mapStoreToProps)(Dashboard)

function findRootGalleries(galleries) {
  const children = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.get('children'))
  }, List())

  return galleries.filter(gallery => !children.includes(gallery.get('id'))).toList()
}
