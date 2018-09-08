import styles from './BusyScreen.less'

import React from 'react'

export default function BusyScreen() {
  return <div className={styles.busyBackground}>
      <div className={styles.loadingCircle} />
      <div className={styles.loadingCircleContent}>
        <span className="fa fa-2x fa-calendar" />
      </div>
    </div>
}
