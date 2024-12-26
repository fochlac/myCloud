import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Card from 'RAW/Card'
import style from './TimelineCluster.less'
import cx from '../../utils/classnames'
import { dateHumanized } from '../../utils/date'
import { useDispatch } from 'react-redux'
import { createTextNode, deleteTextNode, updateTextNode } from '../../store/actions/galleries'



function EditableTextNode({ node, isEdit }) {
  const [text, setText] = useState(node.get('text'))
  const dispatch = useDispatch()

  if (!isEdit) {
    const Type = node.get('type') === 'title' ? 'h3' : 'p'
    return <Type>{node.get('text')}</Type>
  }

  const onSubmit = () => {
    if (text !== node.get('text')) {
      dispatch(updateTextNode({ ...node.toJS(), text }))
    }
  }

  return (
    <div className={style.inputWrapper}>
      <input className={style.input} type="text" value={text} onChange={(e) => setText(e.target.value)} onBlur={onSubmit} />
      <span className={cx(style.iconButton, 'fa fa-trash')} onClick={() => dispatch(deleteTextNode(node.toJS()))} />
    </div>
  )
}

function TimelineCluster({ cluster, isEdit, gallery, selectImage }) {
  const hasHeader = !!cluster.title
  const dispatch = useDispatch()

  return (
    <div className={style.cluster}>
      <div className={cx(style.dateLine, { [style.hasHeader]: hasHeader || isEdit })}>
        {!!cluster.dateTime ? <span>{dateHumanized(cluster.dateTime)}</span> : null}
      </div>
      <div className={style.content}>
        {hasHeader ? (
          <div className={style.titleSection}>
            <EditableTextNode node={cluster.title} isEdit={isEdit} />
          </div>
        ) : isEdit ? (
          <span
            onClick={() =>
              dispatch(createTextNode({ galleryId: gallery.get('id'), dateTime: cluster.dateTime - 1000, type: 'title', text: 'Title' }))
            }
            className={cx(style.iconButton, 'fa fa-plus-circle')}
          />
        ) : null}
        {cluster.segments.map((segment, i) =>
          segment.type === 'images' ? (
            <div key={i} className={style.imageGrid}>
              {segment.images.map((image, j) => (
                <Fragment key={j}>
                  <Card image={image} onClick={() => selectImage(image.get('id'))} className={style.thumbnail} noWrapper />
                  {isEdit && (
                    <span
                      onClick={() =>
                        dispatch(createTextNode({ galleryId: gallery.get('id'), dateTime: image.get('imageTaken') - 1000, type: 'description', text: 'Description' }))
                      }
                      className={cx(style.iconButton, 'fa fa-plus-circle')}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          ) : (
            <div key={i} className={style.textNode}>
              <EditableTextNode node={segment.node} isEdit={isEdit} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

TimelineCluster.propTypes = {
  cluster: PropTypes.shape({
    title: PropTypes.object,
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['images', 'text']).isRequired,
        images: PropTypes.array,
        node: PropTypes.object,
      }),
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
}

export default TimelineCluster
