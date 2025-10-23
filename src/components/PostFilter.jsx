import PropTypes from 'prop-types'

export function PostFilter({ field, value, onChange }) {
  return (
    <div>
      {/* field is the paramter, a control/or property? */}
      {/* create a label for a filter control */}
      <label htmlFor={`filter-${field}`}>{field}: </label>
      {/* Create a textbox to specify a filter */}
      <input
        type='text'
        name={`filter-${field}`}
        id={`filter-${field}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

//make it required
PostFilter.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
