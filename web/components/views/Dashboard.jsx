import Post, { BusyPost } from 'RAW/Post.jsx'

import DefaultPage from 'CONNECTED/DefaultPage'
import React from 'react'
import { connect } from 'react-redux'
import { load_posts } from 'STORE/actions.js'
import style from './Dashboard.less'

const BusyNote = () => (
  <div className={style.busyNote}>
    <span className="fa fa-refresh fa-spin fa-lg" />
    <p>Posts werden geladen</p>
  </div>
)

export class Dashboard extends React.Component {
  componentDidMount() {
    // this.props.load_posts()
  }

  render() {
    const { posts, app } = this.props
    const busy = app.get('busy').includes('LOAD_POSTS')

    return (
      <DefaultPage>
        {busy && <BusyNote />}
        {!posts.length && busy ? <BusyPost /> : posts.map(post => <Post post={post} key={post} />)}
      </DefaultPage>
    )
  }
}

const mapStoreToProps = (store, ownProps) => ({
  app: store.get('app'),
  posts: store.get('posts'),
})

export default connect(
  mapStoreToProps,
  { load_posts },
)(Dashboard)
