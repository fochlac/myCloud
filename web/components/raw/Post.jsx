import React from 'react'
import { connect } from 'react-redux'
import { formatDateTime } from 'UTILS/date'
import style from './Post.less'

const PostFrame = ({ children, post, className = '', menu = null, comments = [] }) => (
  <div className={`${style.post} ${className}`}>
    <div className={style.top}>
      <span>
        {post.get('name')}
        {post.get('date') && ` - ${formatDateTime(post.get('date'))}`}
      </span>
      <span>{menu}</span>
    </div>
    <div className={style.body}>{children}</div>
    {comments.map(comment => <Comment comment={comment} />)}
  </div>
)

const Comment = ({ comment }) => (
  <div className="comment">
    <span className="infoBlock">
      <UserIcon id={comment.get('user')} />
      <span className="date">{formatDateTime(comment.get('created'))}</span>
      <CommentInteraction id={comment.get('user')} />
    </span>
    <p className="text">{comment.get('content')}</p>
  </div>
)

export const Post = ({ post }) => {
  return (
    <PostFrame post={post}>
      {post.get('type') === 'event' && (
        <div>
          asda
          <br />
          <br />
          asdasd
        </div>
      )}
      {post.get('type') === 'note' && (
        <div>
          asdas
          <br />
          <br />
          asdas
        </div>
      )}
    </PostFrame>
  )
}

export const BusyPost = () => (
  <PostFrame post={{ get: type => type === 'name' && <div className={style.animatedLineSmall} /> }} className="busy">
    <div className={style.animatedLine} />
    <div className={style.animatedLine} />
    <div className={style.animatedLineHalf} />
  </PostFrame>
)

function getTypeFromPostId(id) {
  switch (id.split('_')[0]) {
    case 'e':
      return 'events'
    case 'n':
      return 'notes'
  }
}

export default connect((store, ownprops) => ({ post: store.getIn([getTypeFromPostId(ownprops.post), ownprops.post]) }))(Post)
