import React, { Component } from 'react'
import { Input, Button } from 'semantic-ui-react'
import axios from 'axios'
import { graphql, withApollo } from 'react-apollo'
import { promisify } from 'es6-promisify'
import request from 'request'
const requestPromisify = promisify(request)
const { rebrandApiKey } = require('../credentials')
const { CLICK_COUNT_QUERY } = require('../queries')
const { 
    CREATE_ANALYTICS_MUTATION, 
    CREATE_SHORT_URL_MUTATION 
} = require('../mutations')

class CreateShortUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            shortUrl:'',
            loading: false,
            copied: false,
            error: false
        };
    }

    copyToClipboard = (e) => {
        const shortUrl = this.state.shortUrl
        var dummy = document.createElement("input");
        document.body.appendChild(dummy)
        dummy.setAttribute('value', shortUrl)
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
        this.setState({ copied: true })
    }
    
    handleKeyPress = (event) => {
        if(event.key === "Enter"){
            this.createShortUrl()
        }
    }

    handleClick = async ({e, shortUrl}) => {
        // e.preventDefault()
        const response = await axios({
          method: 'GET',
          url: 'https://ipapi.co/json/',
        })
      
        const ip = response.data.ip
        const ipUrl = `${ip}+${shortUrl}`
        
        const {
          data
        } = await this.props.client.query({
            query: CLICK_COUNT_QUERY,
            variables: {
                ipUrl,
            },
            fetchPolicy: 'network-only',
        })

        const clickCount = data.analytics ? 
          data.analytics.clickCount + 1
          : 1

          console.log("clickCOunt: ",clickCount)
        const url = shortUrl
        try {
          await this.props.client.mutate({
            mutation:CREATE_ANALYTICS_MUTATION,
            variables: {
              ipUrl,
              url,
              clickCount
            },
            fetchPolicy:'no-cache'
          })
        } catch(e) {
          console.log("mutation error: ", e)
        }
    }

      
    createShortUrl = async () => {
        const { url } = this.state
        
        this.setState({
            loading: true,
            error:false
        })

        const options = { 
            method: 'POST',
            url: 'https://api.rebrandly.com/v1/links',
            headers: { 
                apikey: rebrandApiKey,
                'content-type': 'application/json' 
            },
            body: `{"destination":"${url}"}` 
        }

        const response = await requestPromisify(options)

        const shortUrl = JSON.parse(response.body).shortUrl
        const statusCode = response.statusCode

        this.setState({
            shortUrl: shortUrl,
            loading: false,
            error: statusCode === 200 ? false : true
        })

        await this.props.createShortUrlMutation({
            variables: {
                url,
                shortUrl,
            },
        });
    }

    render() {
          
        const {
            shortUrl,
            loading,
            copied,
            error,
            url
        } = this.state

        return (
            <React.Fragment>
                <Input
                    id="url"
                    type="text"
                    value={this.state.url}
                    style={{
                        padding:10,
                        width: 250
                    }}
                    placeholder="Link URL"
                    error={error}
                    onKeyPress={(event) => this.handleKeyPress(event)}
                    onChange={e => this.setState({ url: e.target.value })}
                />
                <Button 
                    loading={loading}
                    onClick={() => this.createShortUrl()}
                >
                    Create
                </Button>
                <div>
                    <a 
                        style={{padding:10}}
                        ref={(a) => this.textArea = a}
                        href={this.state.url}
                        target="_blank"   
                        rel="noopener noreferrer" 
                        onClick={(e) => this.handleClick({e, shortUrl})}
                    >
                        {shortUrl}
                    </a>
                    <Button
                        content='Copy'
                        icon='clipboard'
                        onClick={(event) => this.copyToClipboard(event)}
                    />

                    {copied && shortUrl &&
                        'Copied!'
                    }
                    
                </div>
            </React.Fragment>
        );
    }
}

export default graphql(CREATE_SHORT_URL_MUTATION, {
    name: 'createShortUrlMutation',
})(withApollo(CreateShortUrl));