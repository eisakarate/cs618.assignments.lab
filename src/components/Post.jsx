import PropTypes from 'prop-types'
import { User } from './User'
import { Link } from 'react-router-dom'
import slug from 'slug'
/*
 *.jsx allows embedding of HTML with JavaScript, sort of like Blazor
 */
export function Post({
  title,
  contents,
  author: userId,
  bibliography,
  _id,
  fullPost = false,
}) {
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${_id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      <div>{contents}</div>
      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
      <div>
        <h4>Bibilography:</h4>
        <ul>
          {bibliography.map((bibliography, index) => (
            <li key={index}>{bibliography}</li>
          ))}
        </ul>
      </div>
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  bibliography: PropTypes.arrayOf(PropTypes.string),
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
