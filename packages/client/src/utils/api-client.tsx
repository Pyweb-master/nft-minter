import {queryCache} from 'react-query'
import * as auth from '../auth-provider'
const apiURL = process.env.REACT_APP_API_URL

async function client(
  endpoint,
  {data = null, token = null, headers: customHeaders = null, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      queryCache.clear()
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location.toString())
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}