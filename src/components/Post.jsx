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
  author,
  //bibliography,
  id,
  fullPost = false,
}) {
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
      {/* <div>
        <h4>Bibilography:</h4>
        <ul>
          {bibliography.map((bibliography, index) => (
            <li key={index}>{bibliography}</li>
          ))}
        </ul>
      </div> */}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  bibliography: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
