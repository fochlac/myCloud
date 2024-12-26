import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
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
import { dateHumanized } from '../../utils/date'

function TimelineContent({ gallery, params }) {
  const [showEditGallery, setShowEditGallery] = useState(false)
  const [selectedImage, selectImage] = useState(null)
  const [index, setIndex] = useState(null)
  const sortedItems = useMemo(() => getSortedItems(gallery), [gallery])
  const clusters = useMemo(() => clusterItems(sortedItems), [sortedItems])
  const imageList = useMemo(() => new List(sortedItems.filter(item => item.has('path') && item.has('name') && !item.has('type'))), [sortedItems])

  const dispatch = useDispatch()

  const isEdit = params.edit === 'edit'

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
        <TimelineCluster selectImage={selectImage} key={i} index={i} cluster={cluster} isEdit={isEdit} gallery={gallery} />
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
          header={<span className={style.dialogTitle}>{index ? dateHumanized(imageList.getIn([index, 'imageTaken'])) : null}</span>}
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

export function Timeline({ gallery, params }) {
  if (!gallery) return <PageMissing />
  return <TimelineContent gallery={gallery} params={params} />
}

Timeline.propTypes = {
  gallery: ImmuTypes.map
}

const mapStoreToProps = (store, ownProps) => ({
  gallery: store.getIn(['galleries', ownProps.params.id])
})

export default connect(mapStoreToProps)(Timeline)
