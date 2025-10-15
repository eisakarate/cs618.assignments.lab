//get postfrom the webAPI
export const getPosts = async (queryParams) => {
  console.log(`$queryParams:` + queryParams)
  console.log(`${import.meta.env.VITE_BACKEND_URL}/posts?`)
  //construct a route
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

//add a second funcion
export const createPost = async (token, post) => {
  //create a POST request, and push the post information the endpoint
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`, //set the token into the header
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}

export const getPostById = async (postId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`)
  return await res.json()
}
