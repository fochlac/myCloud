import './BaseStyle.less'

import { add, getWeekNumber } from 'UTILS/date'

import { Link } from 'react-router-dom'
import React from 'react'
import { connect } from 'react-redux'
import styles from './Calendar.less'

const focusLevels = {
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  YEAR: 'YEAR',
  DECADE: 'DECADE',
}

export class Calendar extends React.Component {
  constructor(props) {
    super()

    this.state = {
      focus: props.focus,
    }

    this.generateWeek = cache(generateWeek)
    this.generateMonth = cache(generateMonth)
    this.generateYear = cache(generateYear)
    this.onScroll = this.onScroll.bind(this)
    //this.generateDecade = cache(generateDecade)
  }

  dates() {
    const {
      state: { focus },
      props: { level },
    } = this

    switch (level) {
      case focusLevels.WEEK:
        return this.generateWeek(focus)
      case focusLevels.MONTH:
        return this.generateMonth(focus)
      case focusLevels.YEAR:
        return this.generateYear(focus)
      case focusLevels.DECADE:
        return this.generateDecade(focus)
    }
  }

  render() {
    const {
      props: { level, focus },
    } = this

    return (
      <div className={styles.frame} onWheel={this.onScroll}>
        {level === focusLevels.WEEK && renderWeek(this.dates(), focus)}
        {level === focusLevels.MONTH && <div className={styles.month}>{this.dates().map(date => renderWeek(date, focus))}</div>}
      </div>
    )
  }

  onScroll(evt) {
    const {
      state: { focus },
      props: { level },
    } = this

    const direction = evt.deltaY > 0 ? 1 : -1

    evt.preventDefault()

    this.setState({
      focus: add(focus, {
        D: direction * (level === focusLevels.WEEK ? 1 : level === focusLevels.MONTH ? 7 : 0),
        M: direction * (level === focusLevels.YEAR ? 1 : level === focusLevels.DECADE ? 12 : 0),
      }),
    })
  }
}

const renderWeek = ({ days, weeknumber }, originalFocus) => (
  <div className={styles.week}>
    <div className={styles.weeknumber}>{weeknumber}</div>
    {days.map(date => <div className={styles.day + ' ' + (originalFocus === date.getTime() ? styles.today : '')}>{date.getDate()}</div>)}
  </div>
)

function generateWeek(focus) {
  const baseDay = focus.getDay()
  let days = []

  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    days.push(add(focus, { D: dayOfWeek - baseDay }))
  }

  return {
    weeknumber: getWeekNumber(focus),
    days,
  }
}

function generateMonth(focus) {
  let month = []

  for (let week = -2; week <= 2; week++) {
    month.push(generateWeek(add(focus, { D: 7 * week })))
  }

  return month
}

function generateYear(focus) {
  let year = []

  for (let month = -4; month <= 4; month++) {
    year.push(add(focus, { M: 1 * month }))
  }
}

function cache(func) {
  const cache = {}

  return date => {
    const base = new Date(date)

    const key = `${base.getFullYear()}_${base.getMonth()}_${base.getDate()}`

    if (!cache[key]) {
      cache[key] = func(base)
    }
    return cache[key]
  }
}

Calendar.defaultProps = {
  level: focusLevels.MONTH,
  focus: Date.now(),
}

export default connect(
  store => ({
    ...store.getIn(['app', 'calendar']).toJS(),
  }),
  {},
)(Calendar)
