import { Map } from 'immutable'
import { StateStream } from 'rxact'

const initialState = Map({
  pageCount: 0,
  hasNext: true,
})

const paginationStream = new StateStream('pagination', initialState)

paginationStream.nextPage = ajaxResponse => {
  const link = ajaxResponse.xhr.getResponseHeader('link') || ''
  let hasNext = true

  if (!link) {
    hasNext = false
  }

  const nextLink = link.split(',').find(s => s.indexOf('rel="next"') > -1)

  if (!nextLink) {
    hasNext = false
  }

  paginationStream.next(state => state
    .update('pageCount', value => value + 1)
    .set('hasNext', hasNext)
  )
}

paginationStream.cleanPage = () => paginationStream.next(state => state
  .merge({ pageCount: 0, hasNext: true })
)

export default paginationStream
