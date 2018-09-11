import React from 'react'
import DefaultPage from 'RAW/DefaultPage'
import styles from './PageMissing.less'
import { Link } from 'react-router-dom'

export default function PageMissing() {
  return (
    <DefaultPage showButtons additionalClass={styles.center}>
      <h2>404 - Page missing</h2>
      <Link to="/">Zurück zum Start</Link>
    </DefaultPage>
  )
}
