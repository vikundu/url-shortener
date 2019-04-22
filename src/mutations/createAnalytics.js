import gql from 'graphql-tag'

export const CREATE_ANALYTICS_MUTATION = gql`
  mutation Analytic($ipUrl:String!, $clickCount: Int!, $url: String!){
      analytic(ipUrl: $ipUrl, clickCount: $clickCount, url: $url){
          ipUrl,
          clickCount,
          url
      }
  }
`