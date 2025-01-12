import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import ImmuTypes from 'react-immutable-proptypes'
import PageMissing from 'RAW/PageMissing'
import CreateGalleryCard from 'RAW/CreateGalleryCard'
import Dialog from 'RAW/Dialog'
import { getSortedItems, clusterItems } from '../../utils/timeline'
import style from './Timeline.less'
import TimelineCluster from '../raw/TimelineCluster'
import { updateGallery } from 'STORE/actions'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import GallerySlider from '../connected/GallerySlider'
import { List } from 'immutable'

function TimelineContent({ gallery, isEdit }) {
  const [showEditGallery, setShowEditGallery] = useState(false)
  const [selectedImage, selectImage] = useState(null)
  const [index, setIndex] = useState(null)
  const sortedItems = useMemo(() => getSortedItems(gallery), [gallery])
  const clusters = useMemo(() => clusterItems(sortedItems, gallery.get('clusterThreshold')), [sortedItems, gallery])
  const imageList = useMemo(() => new List(sortedItems.filter(item => item.has('path') && item.has('name') && !item.has('type'))), [sortedItems])

  const dispatch = useDispatch()

  const currentImage = imageList.get(index)
  const currentImageTitle = currentImage && clusters.find(cluster => cluster.imageTitles[currentImage.get('id')])?.imageTitles[currentImage.get('id')]

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>
          <h2>{gallery.get('name')}</h2>
          {isEdit && <span className={style.edit}><span onClick={() => setShowEditGallery(true)} className="fa fa-pencil"></span></span>}
          {isEdit && <Link to={`/timelines/${gallery.get('id')}`} className={style.edit}><span className="fa fa-arrow-left"></span></Link>}
        </div>
        {gallery.has('description') && (
          <div className={style.description}>
            <p>{gallery.get('description')}</p>
          </div>
        )}
      </div>
      {clusters.map((cluster, i) => (
        <TimelineCluster
          key={cluster.dateTime}
          cluster={cluster}
          isEdit={isEdit}
          gallery={gallery}
          selectImage={selectImage}
        />
      ))}
      {showEditGallery && (
        <Dialog
          onClose={() => setShowEditGallery(false)}
          header={<h4>Galerie bearbeiten</h4>}
        >
          <CreateGalleryCard
            onClose={() => setShowEditGallery(false)}
            onSubmit={gallery => dispatch(updateGallery(gallery)).then(() => setShowEditGallery(false))}
            gallery={gallery}
            parent={gallery.get('id')}
          />
        </Dialog>
      )}
      {!!selectedImage && (
        <Dialog
          headerClassName={style.dialogHeader}
          className={style.dialog}
          onClose={() => {
            selectImage(null)
            setIndex(null)
          }}
          header={(
            <span className={style.dialogTitle}>
              {currentImageTitle || ''}
            </span>
          )}
        >
          <GallerySlider
            hideEdit={!isEdit}
            noNavigation
            onClose={() => {
              selectImage(null)
              setIndex(null)
            }}
            gallery={gallery}
            images={imageList}
            startImage={selectedImage}
            onChangeIndex={setIndex}
          />
        </Dialog>
      )}
    </div>
  )
}

TimelineContent.propTypes = {
  gallery: ImmuTypes.map
}

export function Timeline({ gallery, edit }) {
  if (!gallery) return <PageMissing />
  const canWrite = gallery.getIn(['accessToken', 'access']) === 'write'
  const isEdit = edit === 'edit' && canWrite

  if (edit === 'edit' && !canWrite) {
    return <Redirect to={`/timelines/${gallery.get('id')}`} />
  }
  return <TimelineContent gallery={gallery} isEdit={isEdit} />
}

Timeline.propTypes = {
  gallery: ImmuTypes.map
}

const mapStoreToProps = (store, ownProps) => ({
  gallery: store.getIn(['galleries', String(ownProps.id)])
})

export default connect(mapStoreToProps)(Timeline)
