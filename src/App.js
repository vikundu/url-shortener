import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import UrlList from './components/UrlList'
import CreateShortUrl from './components/CreateShortUrl'

class App extends Component {
  render() {
    return (
        <div className="center w85">
          <Header />
          <div className="ph3 pv1 ">
            <Switch>
              <Route exact path= '/' component={CreateShortUrl}/>
              <Route exact path= '/list' component={UrlList}/>
            </Switch>
          </div>
        </div>
    );
  }
}

export default App;
