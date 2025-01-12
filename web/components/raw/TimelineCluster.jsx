import React, { Fragment, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Card from 'RAW/Card'
import style from './TimelineCluster.less'
import cx from '../../utils/classnames'
import { dateHumanized } from '../../utils/date'
import { useDispatch } from 'react-redux'
import { useInView } from "react-intersection-observer";
import { createTextNode, deleteTextNode, updateTextNode } from '../../store/actions/galleries'

function EditableTextNode({ node, isEdit }) {
  const [text, setText] = useState((node.get('text') || '').trim())
  const [type, setType] = useState(node.get('type'))
  const dispatch = useDispatch()
  const onSubmit = useRef()

  if (!isEdit) {
    const Type = node.get('type') === 'title' ? 'h3' : 'p'
    return <Type>{node.get('text')}</Type>
  }

  onSubmit.current = () => {
    if (text !== node.get('text') || type !== node.get('type')) {
      dispatch(updateTextNode({ ...node.toJS(), text: text || ' ', type }))
    }
  }

  return (
    <div className={style.inputWrapper}>
      <input
        className={style.input}
        type="text"
        value={text}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onSubmit.current()}
      />
      <select onChange={(e) => {
        setType(e.target.value)
        setTimeout(() => onSubmit.current(), 100)
      }} value={type}>
        <option value="title">Title</option>
        <option value="description">Subtitle</option>
      </select>
      <span
        className={cx(style.iconButton, 'fa fa-trash')}
        onClick={() => dispatch(deleteTextNode(node.toJS()))}
      />
    </div>
  )
}

function TimelineCluster({ cluster, isEdit, gallery, selectImage }) {
  const hasHeader = !!cluster.title && (isEdit || cluster.title.get('text').trim().length)
  const dispatch = useDispatch()
  const { ref, inView } = useInView()
  const startDate = dateHumanized(cluster.dateTime)
  const endDate = dateHumanized(cluster.endDateTime)

  return (
    <div ref={ref} className={style.cluster}>
      <div className={cx(style.dateLine, { [style.hasHeader]: hasHeader || isEdit })}>
        {!!cluster.dateTime ? (
          <span className={style.wrapper}>
            <span>{startDate}</span>
            {startDate !== endDate && (
              <>
                <span className={style.separator}> - </span>
                <span>{dateHumanized(cluster.endDateTime)}</span>
              </>
            )}
          </span>
        ) : null}
      </div>
      <div className={style.content}>
        {hasHeader ? (
          <div className={style.titleSection}>
            <EditableTextNode node={cluster.title} isEdit={isEdit} />
          </div>
        ) : isEdit ? (
          <span
            onClick={() =>
              dispatch(
                createTextNode({
                  galleryId: gallery.get('id'),
                  dateTime: cluster.dateTime - 1000,
                  type: 'title',
                  text: ' ',
                }),
              )
            }
            className={cx(style.iconButton, style.headlineIcon, 'fa fa-plus-circle')}
          >Add Headline</span>
        ) : null}
        {cluster.segments.map((segment, i) => {
          if (segment.type === 'images') {
            return (
              <div key={i} className={style.imageGrid}>
                {segment.images.map((image, j) => (
                  <Fragment key={j}>
                    {inView ? (
                      <Card
                        size={50}
                        image={image}
                        onClick={() => selectImage(image.get('id'))}
                        className={style.thumbnail}
                        noWrapper
                      />

                    ) : (
                      <div className={style.thumbnail} />
                    )}
                    {isEdit && (
                      <span
                        onClick={() =>
                          dispatch(
                            createTextNode({
                              galleryId: gallery.get('id'),
                              dateTime: Number(image.get('imageTaken')) + 1000,
                              type: 'title',
                              text: ' ',
                            }),
                          )
                        }
                        className={cx(style.iconButton, 'fa fa-plus-circle')}
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            )
          }

          if (segment.type === 'text') {
            return (
              <div key={i} className={style.textNode}>
                <EditableTextNode node={segment.node} isEdit={isEdit} />
              </div>
            )
          }

          return null
        })}
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
