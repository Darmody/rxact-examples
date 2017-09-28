import { ajax } from 'rxjs/observable/dom/ajax'

const API_HOST = 'https://api.github.com'

const apiCall = (url) => ajax({
  responseType: 'json',
  crossDomain: true,
  url,
})

export const fetchUser = name => apiCall(`${API_HOST}/users/${name}`)

export const fetchStarred = (name, page) => apiCall(`${API_HOST}/users/${name}/starred?page=${page}`)

export const fetchRepo = name => apiCall(`${API_HOST}/repos/${name}`)

export const fetchStargazers = (name, page) => apiCall(`${API_HOST}/repos/${name}/stargazers?page=${page}`)
