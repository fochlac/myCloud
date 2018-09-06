import './InfoBubble.less'

import React from 'react'

function InfoBubble({ symbol, style, children, arrow }) {
  return (
    <span className={'fa InfoBubble ' + symbol}>
      <span className="InfoBubbleContent" style={style}>
        {children}
      </span>
      <span className={'InfoBubbleTriangle ' + arrow} />
    </span>
  )
}

InfoBubble.defaultProps = {
  symbol: 'fa-info-circle',
  children: null,
}

export default InfoBubble
