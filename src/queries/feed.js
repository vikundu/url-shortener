import gql from 'graphql-tag'


export const FEED_QUERY = gql`
query Feed($filter: String){
  feed(filter: $filter) {
    count
    links {
      id
      url
      shortUrl
    }
  }
}
`