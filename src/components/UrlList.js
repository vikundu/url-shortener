import React, { Component } from 'react'
import { Query, withApollo } from 'react-apollo'
import { Message } from 'semantic-ui-react'
import Url from './Url'
const { CLICK_COUNT_FILTER_QUERY, FEED_QUERY } = require('../queries')
const { NEW_LINKS_SUBSCRIPTION } = require('../subscriptions')


const subscribeToNewLinks = subscribeToMore => {
  
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev
      const newLink = subscriptionData.data.newLink
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);
      if (exists) return prev;

      console.log("newLink",newLink)
      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      })
    }
  })
}

class UrlList extends Component{
 

  constructor(props){
    super(props)

    this.state = {
      ips:[],
      showLabel: false
    }
  }

  handleClick = async ({shortUrl}) => {
  
    const {
      data
    } = await this.props.client.query({
        query: CLICK_COUNT_FILTER_QUERY,
        variables: {
            url: shortUrl,
        },
        fetchPolicy: 'network-only' ,
    })

    const ips = Object.keys(data.analyticsIp).map(key => {
      
      const ip = data.analyticsIp[key].ipUrl.split("+")[0]
      console.log(ip)
      return ip
    })

    this.setState({
      ips,
      showLabel: true
    })
    window.scrollTo(0, 0)
  }


  render(){
    const {
      filter
    } = this.props

    const {
      ips,
      showLabel,
    } = this.state

    return (
        <Query
          query={FEED_QUERY}
          variables={{filter}}
        >
        {({data, loading, error, subscribeToMore}) => {
          
          if(loading) return <p>Loading...</p>
          if(error) {
            return <p>Error</p>
          }
          subscribeToNewLinks(subscribeToMore)
          return (
            <ul>
              {
                  this.state.showLabel && ips.length > 0 &&
                  <Message
                    hidden={!showLabel}
                  >
                  <ul>
                      <li>IP List: {ips}</li>
                  </ul>
                  </Message>

                }
              {data.feed.links.map(({id,url,shortUrl}) => 
                <li key={id} onClick={() => this.handleClick({shortUrl}) }>
                  <Url
                    url={url}
                    shortUrl={shortUrl}  
                    ips={this.state.ips}
                    showLabel={this.state.showLabel}
                  />
                  
                </li>
                
              )}

            </ul>
          )
        }}
        </Query>
    )
}}

export default withApollo(UrlList)