import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import pages
import Navigation from './mainNavigation/navbar';
import LoginPage from './login/';
import HomePage from './home/home';
import StoragePage from './storage/';
import Search from './search/search';
import AboutPage from './about/';

// css imports - rework these into sane css structure
import './lainaus.css';
import './menuStyles.css';

class App extends Component {

  render() {

    return (
      <Router>
        <div className="App">
          <Navigation />
          <div className="container">
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/storage" component={StoragePage} />
            <Route exact path="/about" component={AboutPage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
