const second = 1000,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  week = 7 * day,
  year = 365 * day,
  tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  tage_kurz = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

function fill(val, n) {
  return ('0'.repeat(n) + val).slice(-n)
}

export const formatDate = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date)

  return `${fill(src.getDate(), 2)}.${fill(src.getMonth() + 1, 2)}.${fill(src.getFullYear(), 2)}`
}

export const formatDayNameDate = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date)

  return `${tage[src.getDay()]}, ${fill(src.getDate(), 2)}.${fill(src.getMonth() + 1, 2)}.${fill(src.getFullYear(), 2)}`
}

export const formatDayShort = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date)

  return tage_kurz[src.getDay()]
}

export const formatTime = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date)

  return `${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`
}

export const formatDateTime = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date)

  return `${fill(src.getDate(), 2)}.${fill(src.getMonth() + 1, 2)}.${fill(src.getFullYear(), 2)} - ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`
}
export const formatTimeShort = date => {
  const src = new Date(date.toString().length === 10 ? date * 1000 : date),
    diff = Date.now() - (date.toString().length === 10 ? date * 1000 : date)

  if (diff < -week) {
    return `${fill(src.getDate(), 2)}.${fill(src.getMonth() + 1, 2)}${diff > -year ? '' : '.' + src.getFullYear()} ${fill(src.getHours(), 2)}:${fill(
      src.getMinutes(),
      2,
    )}`
  } else if (diff < -day) {
    return `${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`
  } else if (diff < -1.5 * hour) {
    return `in ${-Math.round(diff / hour)} Stunden`
  } else if (diff < -hour) {
    return `in 1 Stunde`
  } else if (diff < -minute) {
    return `in ${-Math.floor(diff / minute)} Minuten`
  } else if (diff < 0) {
    return `in 1 Minute`
  } else if (diff < 2 * minute) {
    return `vor 1 Minute`
  } else if (diff < hour) {
    return `vor ${Math.floor(diff / minute)} Minuten`
  } else if (diff < 2 * hour) {
    return `vor 1 Stunde`
  } else if (diff < day) {
    return `vor ${Math.round(diff / hour)} Stunden`
  } else if (diff < week) {
    return `letzten ${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`
  }
  return `${fill(src.getDate(), 2)}.${fill(src.getMonth() + 1, 2)}${diff < year ? '' : '.' + src.getFullYear()} ${fill(src.getHours(), 2)}:${fill(
    src.getMinutes(),
    2,
  )}`
}

export const round = (date, duration) => {
  return new Date(Math.round(+date / (+duration * 1000)) * (+duration * 1000))
}

export const getWeekNumber = focus => {
  let d = new Date(Date.UTC(focus.getFullYear(), focus.getMonth(), focus.getDate()))
  let dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

export const daysInMonth = rawDate => {
  const base = new Date(rawDate)
  return new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
}

export const time_values = {
  M: 'M',
  MONTH: 'MONTH',
  DAY: 'DAY',
  D: 'D',
  YEAR: 'YEAR',
  Y: 'Y',
}

export const add = (base, values) =>
  Object.keys(values).reduce((date, type) => {
    let value = values[type]

    switch (type) {
      case time_values.MONTH:
      case time_values.M:
        const newMonth = date.getMonth() + value
        date.setMonth(newMonth % 12)
        date.setFullYear(date.getFullYear() + Math.floor(newMonth / 12))
        return date

      case time_values.Y:
      case time_values.YEAR:
        date.setFullYear(date.getFullYear() + value)
        return date

      case time_values.D:
      case time_values.DAY:
        let newDay = date.getDate() + value
        let month_days = daysInMonth(date)

        while (month_days < newDay) {
          date = add(date, { M: 1 })
          newDay = newDay - month_days
          month_days = daysInMonth(date)
        }

        date.setDate(newDay)

        return date
    }
  }, new Date(base))
