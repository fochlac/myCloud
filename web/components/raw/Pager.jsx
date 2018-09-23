import ImmuTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'
import cx from 'UTILS/classnames'
import styles from './Pager.less'

export default class Pager extends React.Component {
  constructor(props) {
    super()

    this.state = {
      page: Math.floor(props.activeItem / props.size) + 1,
    }

    this.setPage = this.setPage.bind(this)
  }

  renderPagerLinks() {
    const { size, children } = this.props
    const { page } = this.state
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
          {page > 1 && <span className="fa fa-angle-left" onClick={() => this.setPage(page - 1)} />}
          {pages.map(pageNumber => (
            <span
              key={pageNumber}
              onClick={() => this.setPage(pageNumber)}
              className={cx(styles.page, pageNumber === this.state.page ? styles.activePage : '')}
            >
              {pageNumber}
            </span>
          ))}
          {page < pageCount && (
            <span className="fa fa-angle-right" onClick={() => this.setPage(page + 1)} />
          )}
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

  setPage(page) {
    const { onChange, size } = this.props
    this.setState({ page }, () => {
      typeof onChange === 'function' && onChange(page * size - 1)
    })
  }

  renderPager(additionalClass = '') {
    const { size, children } = this.props
    const { page } = this.state

    return (
      <div className={cx(styles.pager, additionalClass)}>
        {size < children.size ? <span>{this.renderPagerLinks()}</span> : null}
        <span className={styles.sizeArea}>
          Anzahl:
          {children.size % size === 0 || page < children.size / size ? size : children.size % size}
        </span>
      </div>
    )
  }

  render() {
    const { size, children, top, bottom, inactive, wrapper } = this.props
    const { page } = this.state

    if (inactive || children.size < size) {
      return <span>{wrapper(children)}</span>
    }

    return (
      <div className={styles.pagedList}>
        {top && this.renderPager()}
        <div className="pagedContent">
          {wrapper(
            children.filter((item, index) => index >= (page - 1) * size && index < page * size),
          )}
        </div>
        {bottom && this.renderPager(styles.bottom)}
      </div>
    )
  }
}

Pager.defaultProps = {
  size: 10,
  activeItem: 1,
  top: true,
  bottom: true,
  inactive: false,
  wrapper: children => children,
  onChange: Function.prototype,
}

Pager.propTypes = {
  size: PropTypes.number,
  activeItem: PropTypes.number,
  children: ImmuTypes.list,
  top: PropTypes.bool,
  bottom: PropTypes.bool,
  inactive: PropTypes.bool,
  wrapper: PropTypes.func,
  onChange: PropTypes.func,
}
