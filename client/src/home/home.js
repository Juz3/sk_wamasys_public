 /**
 *  <home.js>
 *
 *  Copyright information
 *
 *      Copyright (C) 2018 Jussi Koivumäki <firstname.lastname@cs.tamk.fi>
 *
 *  License
 * 
 *      Permission to use, copy, modify, and/or distribute this software 
 *      for any purpose with or without fee is hereby granted, provided that 
 *      the above copyright notice and this permission notice appear in all copies.
 *
 *      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
 *      WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
 *      MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
 *      ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
 *      WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN 
 *      AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING 
 *      OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * 
 * @author Jussi Koivumäki
 * 
 *
 */

import React from 'react';
import {  
  Col,
  Container,
  Row,
  Table } from 'reactstrap';

import Cookies from 'universal-cookie';
import axios from 'axios';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: [],
      userLoanData: [],
      homePageDivStyle: {
        color: 'rgb(0,0,0)'
      }
    };
  }

  getUserData() {
    // API base url address
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://floating-fortress-36530.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    var self = this;

    const cookies = new Cookies();

    // If cookie is found, send axios request. Otherwise print example table
    if(typeof cookies.get('jwtAuth') !== 'undefined') {

      axios.get(apiBaseUrl + 'home', 
      {
        withCredentials: true,
        headers:
        {
          Authorization: cookies.get('jwtAuth')
        }
      }).then(function (response) {
        self.setState({ 
          userData: response.data.response
        });

      }).catch(function (error) {
        // log error
        console.log("error in axios get home", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('error in response', error.response.data);
          console.log('error in response', error.response.status);
          console.log('error in response', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error elsewhere', error.message);
        }  
      });
    } else if (typeof cookies.get('jwtAuth') == 'undefined') {

      self.setState({
        homePageDivStyle: {
          display: 'none'
        }
      });
      
    } else {
      console.log("home page get other error")
    }
  }

  getLoanData() {
    // API base url address
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://floating-fortress-36530.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    var self = this;

    const cookies = new Cookies();

    // If cookie is found, send axios request. Otherwise print example table
    if(typeof cookies.get('jwtAuth') !== 'undefined') {

      // If jwt cookie is found,

      axios.get(apiBaseUrl + 'homeloan', 
      {
        withCredentials: true,
        headers:
        {
          Authorization: cookies.get('jwtAuth')
        }
      }).then(function (response) {
        self.setState({ 
          userLoanData: response.data.response
        });

      }).catch(function (error) {
        // log error
        console.log("error in axios get loan data", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('error in response', error.response.data);
          console.log('error in response', error.response.status);
          console.log('error in response', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error elsewhere', error.message);
        }  
      });
    } else if (typeof cookies.get('jwtAuth') == 'undefined') {

      self.setState({
        homePageDivStyle: {
          display: 'none'
        }
      });
      
    } else {
      console.log("home page get LOAN other error")
    }
  }

  componentDidMount() {

    this.getUserData();
    this.getLoanData();

  }

  /* 
   * Converts status from user-database to string value.
   */
  getStatus(status) {
    // admin user status: 3
    const admin = "Ylläpito"

    // manager user status: 2
    const manager = "Esimies"
    
    // normal user status: 1
    const normalUser = "Peruskäyttäjä"

    // removed user status: 0
    const removedUser = "Poistettu käyttäjä"

    if(status === 3) {
      return admin;
    } else if(status === 2) {
      return manager;
    } else if(status === 1) {
      return normalUser;
    } else if(status === 0) {
      return removedUser;
    } else {
      console.log("cannot get status, error")
    }
  }

  render() {

    // Data object, fetched from api via axios get() at componentDidMount()
    const data = this.state.userData;

    // Fetch data from data object and map to a table
    const listUserData = data.map((d) => 
        <tr key= {"row" + d.ID}>
        <th className = 'userID' scope="row" key = 'd.ID'>{d.ID}</th>
        <td className = 'userName' key = 'd.name'>{d.name}</td>
        <td className = 'userLogin' key = 'd.login'>{d.login}</td>
        <td className = 'userStatus' key = 'd.status'>{this.getStatus(d.status)}</td>
        <td className = 'userEmail' key = 'd.email'>{d.email}</td>
      </tr>
    );

    // Loan Data object, fetched from api via axios get() at componentDidMount()
    const loanData = this.state.userLoanData;
//<th className = 'loanTime' scope="row" key = 'd.time'>{d.time.slice(0, 19).replace('T', ' ')}</th>
    // Fetch data from data object and map to a table
    const listUserLoanData = loanData.map((d) => 
        <tr key= {"row" + d.time}>
        
        <th className = 'loanTime' scope="row" key = 'd.time'>{d.time.slice(0, 19).replace('T', ' ')}</th>
        <td className = 'loanStatus' key = 'd.status'>{d.status}</td>
        <td className = 'loanComment' key = 'd.comment'>{d.comment}</td>
        <td className = 'loanItemName' key = 'd.name'>{d.name}</td>
        <td className = 'loanLoaned' key = 'd.loaned'>{d.loaned}</td>
      </tr>
    );
      
    return (

      <div>
        <div className="onlyBgColor" style={this.state.homePageDivStyle}>
          <Container>
            <Row>
              <Col className="homePageUserData">
                <h2 className = "userDataHeading">Käyttäjän tiedot</h2>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="userDataContainer" >
          <Container>
            <Row>
              <div className="midInputCol">
                <div className='userDataList'>
                  <Table className = 'userDataTable' style={this.state.homePageDivStyle}>
                    <thead>
                      <tr key="tableHeaderRow" >
                        <th className = 'userID'>ID</th>
                        <th className = 'userName'>Nimi</th>
                        <th className = 'userLogin'>Käyttäjätunnus</th>
                        <th className = 'userStatus'>Käyttäjätaso</th>
                        <th className = 'userEmail'>Sähköpostiosoite</th>
                      </tr>
                    </thead>
                    <tbody className = 'userDataList' key = 'd.tbody'>
                      {listUserData}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col className="homePageUserData">
                <h2 className = "userDataHeading">Lainat</h2>
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <div className="midInputCol">
                <div className='userDataList'>
                <Table className = 'userDataTable' style={this.state.homePageDivStyle}>
                    <thead>
                      <tr key="tableHeaderRow" >
                        <th className = 'loanTime'>aika</th>
                        <th className = 'loanStatus'>status</th>
                        <th className = 'loanComment'>kommentti</th>
                        <th className = 'loanItemName'>tuote</th>
                        <th className = 'loanLoaned'>määrä</th>
                      </tr>
                    </thead>
                    <tbody className = 'userLoanDataList' key = 'd.tbody'>
                      {listUserLoanData}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Row>
          </Container>
        </div>
      </div>   
    );
  }
}

export default HomePage;
