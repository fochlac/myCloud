import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import { Swipeable } from 'UTILS/Swipe'
import cx from 'UTILS/classnames'
import styles from './Pager.less'

const SwipableDiv = Swipeable(props => <div {...props} />)

export default class Pager extends React.Component {
  constructor(props) {
    super()

    const size = Math.floor((window.outerWidth - 50) / 180) * Math.floor((window.outerHeight - 200) / 220) || 1
    this.state = {
      page: Math.floor(props.activeItem / size) + 1,
      size
    }

    this.wrapperRef = React.createRef()
    this.updateSize = this.updateSize.bind(this)
    this.setPage = this.setPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.prevPage = this.prevPage.bind(this)

    if (ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.updateSize())
    }
  }

  componentDidMount() {
    this.updateSize()
    this.resizeObserver.observe(this.wrapperRef.current)
  }

  componentWillUnmount () {
    cancelAnimationFrame(this.sizeUpdateRequest)
    this.resizeObserver && this.resizeObserver.disconnect()
  }

  renderPagerLinks() {
    const { children } = this.props
    const { size, page } = this.state
    const pageCount = Math.ceil(children.size / size)

    let pages = []

    if (pageCount > 9) {
      if (page < 3) {
        pages = [1, 2, 3, 4, 5]
      } else if (page > pageCount - 3) {
        pages = [4, 3, 2, 1, 0].map(val => pageCount - val)
      } else {
        pages = [page - 2, page - 1, page, page + 1, page + 2]
      }

      return (
        <span className={styles.pagerList}>
          {page > 1 && <span className="fa fa-angle-double-left" onClick={() => this.setPage(1)} />}
          {page > 1 && <span className="fa fa-angle-left" onClick={this.prevPage} />}
          {pages.map(pageNumber => (
            <span
              key={pageNumber}
              onClick={() => this.setPage(pageNumber)}
              className={cx(styles.page, pageNumber === this.state.page ? styles.activePage : '')}
            >
              {pageNumber}
            </span>
          ))}
          {page < pageCount && <span className="fa fa-angle-right" onClick={this.nextPage} />}
          {page < pageCount && (
            <span className="fa fa-angle-double-right" onClick={() => this.setPage(pageCount)} />
          )}
        </span>
      )
    } else {
      return (
        <span className={styles.pagerList}>
          {Array.from(Array(pageCount).keys())
            .map(val => val + 1)
            .map(pageNumber => (
              <span
                key={pageNumber}
                onClick={() => this.setPage(pageNumber)}
                className={cx(styles.page, pageNumber === this.state.page ? styles.activePage : '')}
              >
                {pageNumber}
              </span>
            ))}
        </span>
      )
    }
  }

  updateSize () {
    const { top, bottom, elementSize, activeItem } = this.props
    this.sizeUpdateRequest = requestAnimationFrame(() => {

      if (this.wrapperRef.current) {
        const { width, height } = this.wrapperRef.current.getBoundingClientRect()

        const size = Math.floor(width / elementSize.width) * Math.floor((height - (top ? 35 : 0) - (bottom ? 35 : 0)) / elementSize.height) || 1

        if (size !== this.state.size) {
          this.setState({ page: Math.floor(activeItem / size) + 1, size })
        }
      }
    })
  }

  setPage(page) {
    const { onChange } = this.props
    const { size } = this.state
    this.setState({ page }, () => {
      typeof onChange === 'function' && onChange(page * size - 1)
    })
  }

  renderPager(additionalClass = '') {
    const { children } = this.props
    const { size, page } = this.state

    return (
      <div className={cx(styles.pager, additionalClass)}>
        {size < children.size ? <span>{this.renderPagerLinks()}</span> : null}
      </div>
    )
  }

  nextPage() {
    const {
      props: { children },
      state: { size, page },
    } = this
    const pageCount = Math.ceil(children.size / size)

    if (page < pageCount) {
      this.setState({ page: page + 1 })
    }
  }

  prevPage() {
    const {
      state: { page },
    } = this

    if (page > 1) {
      this.setState({ page: page - 1 })
    }
  }

  render() {
    const { children, top, bottom, inactive, wrapper } = this.props
    const { size, page } = this.state

    if (inactive || !size || children.size < size) {
      return <div className={styles.wrapper} ref={this.wrapperRef}>{wrapper(children)}</div>
    }

    return (
      <SwipableDiv
        onSwipeLeft={this.nextPage}
        onSwipeRight={this.prevPage}
        className={styles.pagedList}
      >
        <div className={cx(styles.wrapper, styles.pagedList)} ref={this.wrapperRef}>
          {top && this.renderPager()}
          <div className="pagedContent">
            {wrapper(
              children.filter((item, index) => index >= (page - 1) * size && index < page * size),
            )}
          </div>
          {bottom && this.renderPager(styles.bottom)}
        </div>
      </SwipableDiv>
    )
  }
}

Pager.defaultProps = {
  elementSize: {
    width: 100,
    height: 100
  },
  activeItem: 1,
  top: true,
  bottom: true,
  inactive: false,
  wrapper: children => children,
  onChange: Function.prototype,
}

Pager.propTypes = {
  elementSize: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }),
  activeItem: PropTypes.number,
  children: ImmuTypes.list,
  top: PropTypes.bool,
  bottom: PropTypes.bool,
  inactive: PropTypes.bool,
  wrapper: PropTypes.func,
  onChange: PropTypes.func,
  id: PropTypes.string,
}
