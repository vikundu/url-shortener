import gql from 'graphql-tag'

export const CLICK_COUNT_QUERY = gql`
query Analytic($ipUrl: String!){
  analytic(ipUrl: $ipUrl) {
    clickCount
  }
}
`
