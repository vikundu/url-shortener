import gql from 'graphql-tag'

export const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      shortUrl
    }
  }
`