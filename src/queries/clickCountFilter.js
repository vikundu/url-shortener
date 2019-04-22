import gql from 'graphql-tag'

export const CLICK_COUNT_FILTER_QUERY = gql`
query Analytics($url: String!){
  analyticsIp(filter: $url) {
    clickCount,
    ipUrl
  }
}
`