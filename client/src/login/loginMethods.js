 /**
 *  <loginMethods.js>
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
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';

import {
  Button,
  Container, 
  Row, 
  Form, 
  FormGroup, 
  Input, 
  Label
} from 'reactstrap';

class LoginMethods extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = { 
        loginID: '',
        password: '',
        isLogged: false,
        authToken: '',
        userID: ''
    };
  }

  onKeyPress(event) {
    if (event.which === 13 /* 13 == Enter-key */) {
      //console.log("event",event);
      event.preventDefault();

      this.handleClick(event);
    }
  }

  logInput(event) {
    console.log(event.target.value)
    this.setState({
      loginID:event.target.value
    })
  }

  // client side login validation function before sending to server
  validateLogin(login, password) {

    let loginIdValid = false;
    let loginPwValid = false;

    // loginID
    if(login.length > 5 && login.length < 8) {
      
      let idPattern = /\d{6,7}/
      let matchLoginId = idPattern.test(login);
      console.log("login regex match:", matchLoginId);

      let illegalPattern = /^(?!.*(;|{|\||}|\\)).*$/
      let matchLoginIdIllegal = illegalPattern.test(login);
      console.log("login illegal regex match:", matchLoginIdIllegal);

      if(matchLoginId && matchLoginIdIllegal) {
        loginIdValid = true;
      } else {
        loginIdValid = false;
      }
    }

    // Password
    if(password.length > 3 && password.length <= 64) {
      
      let pwPattern = /^(?!.*(;|{|\||}|\\)).*$/

      let matchPw = pwPattern.test(password);

      console.log("password regex match:", matchPw);

      if(matchPw) {
        loginPwValid = true;
      } else {
        loginPwValid = false;
      }
    }

    // When both loginID and pw are valid, return true and continue login post.
    if(loginIdValid && loginPwValid) {
      
      return true;

    } else {

      console.log("Login ID or password is invalid");
      return false;
    }
  }

  handleClick(event){
    // api url
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://floating-fortress-36530.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    // this object  
    var self = this;

    const cookies = new Cookies();

    // run client-side validation:
    if(this.validateLogin(self.state.loginID, self.state.password)) {
      
      // payload strings: These need to match table column names
      // Do not log this, because security.
      var payload = {
        "login": self.state.loginID,
        "password": self.state.password
      }

      // syntax: Axios.post().then().catch();
      axios.post(apiBaseUrl+'login', payload)
      .then(function (response) {
          // Axios response
          if(response.data.code === 200) {
            // LOGIN SUCCESS:
              self.setState({
                authToken: response.data.token,
                userID: response.data.userID
              });
              //console.log(self.state.authToken.payload["userID"].string);
              
              // Set JWT cookie, if identical one does not exist
              if(cookies.get('jwtAuth') === self.state.authToken) {
                //console.log("cookie match existing one");
              } else {
                // set jwt as cookie
                cookies.set('jwtAuth', self.state.authToken, { path: '/'});
              }

              self.setState({
                isLogged:true
              })
              console.log("Login successful! (loginmethods.js) login:", 
              self.state.isLogged + ", user ID: " + self.state.userID);

          } else if(response.data.code === 204) {

              alert("Väärä käyttäjätunnus / salasana.");
          } else {
              // Here might be a bug if jwt is not valid!!
              console.log(response.data.code)
              alert("name does not exist");
          }
      })
      // If there's an error
      .catch(function (error) {
          // log error
          console.log("error in axios post", error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('error in response', error.response.data);
            console.log('error in response', error.response.status);
            console.log('error in response', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser, 
            // and an instance of http.ClientRequest in node.js
            console.log('error in request', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error elsewhere', error.message);
          }
          console.log('error config: ', error.config);
      });
    } else {
      // error before post
      console.log("ValidateLogin returned false, check validation");
      alert("Tarkista käyttäjätunnus ja salasana");
    }
  }

  render() {
    
    // After login, redirect to home page
    if(this.state.isLogged) {
      return(
        <Redirect to="/home"/>
      )
    } else  {
      return (
        <div> 
          <div className="mainContainer">
              <Container className="loginForm">
                <Row className="loginForm">
                  <div className="loginForm">
                    <Form>
                      <FormGroup>
                        <Label for="loginID">Käyttäjätunnus</Label>
                        <Input type="text" name="text" id="loginID" 
                          placeholder="Käyttäjätunnus" 
                          onChange = {(event) => 
                            this.setState({
                              loginID:event.target.value
                            })
                          }
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">Salasana</Label>
                        <Input type="password" name="text" id="password" 
                          placeholder="Salasana" 
                          onChange = {(event) => 
                            this.setState({
                              password:event.target.value
                            })
                          }
                          onKeyPress = {(event) => 
                            this.onKeyPress(event)
                          } 
                        />
                      </FormGroup>
                      <Button className="submitBtn-login" 
                        id="submit-login" 
                        style={this.state.okBtnStyle}
                        onClick={(event) => {
                          this.handleClick(event);
                        }}
                      >
                        Kirjaudu
                      </Button>
                    </Form>
                  </div>
                </Row>
              </Container>
          </div>
        </div>
      )
    }

    
  }
}

export default LoginMethods;