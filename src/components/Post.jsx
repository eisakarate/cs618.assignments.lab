import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
/*
 *.jsx allows embedding of HTML with JavaScript, sort of like Blazor
 */
export function Post({ title, contents, author, id, fullPost = false }) {
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      <div>{contents}</div>
      {author && (
        <em>
          <br />
          Written by <User {...author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
