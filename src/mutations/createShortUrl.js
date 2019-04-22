import gql from 'graphql-tag'

export const CREATE_SHORT_URL_MUTATION = gql`
    mutation Post($url: String!, $shortUrl: String!) {
        post(url: $url, shortUrl: $shortUrl) {
            url,
            shortUrl
        }
    }
`