import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'

class Url extends Component {
    render() {
        const {
            url,
            shortUrl,
            ips,
            clickCount,
            showLabel
        } = this.props
    
        return (
            <React.Fragment>
                <div>
                    {shortUrl}
                    
                </div>

            </React.Fragment>
        );
    }
}

Url.propTypes = {
    url: PropTypes.string,
    shortUrl: PropTypes.string,
};

export default Url;