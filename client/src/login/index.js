 /**
 *  <index.js>
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

import { Button } from 'reactstrap';

import LoginMethods from './loginMethods';
// import RegisterMethods from '../register/registerMethods';

const okBtnStyle = {
  color: '#fff',
  background: '#0c0e14',
  textAlign: 'center'
}

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    /*
    var loginButtons = [];
    loginButtons.push(
      <div key="loginSubmitButtonDiv">
         <Button className="submitBtn-ok" 
           style = {okBtnStyle} 
           onClick = {(event) => 
          this.handleClick(event)}>Login / Register</Button>
      </div>
    )
    */
    this.state = {
      name:'',
      password:'',
      login:'',
      loginscreen:[],
      registerScreen:[],
      loginmessage:'',
      //loginButtons:loginButtons,
      buttonLabel:'Register',
      isLoggedIn:false,
      isRegisterPressed:false,
      okBtnStyle : {
        color: 'rgb(39, 167, 71)',
        background: '#191a1d',
        textAlign: 'center'
      }
    }
  }

  componentWillMount() {
    var loginscreen = [];
    loginscreen.push(<LoginMethods key="loginMethods" 
      parentContext={this} 
      appContext={this.props.parentContext}/>
    );
    //var loginmessage = "Ei tunnuksia? Luo uusi tunnus";
    var loginmessage = "";
    this.setState({
      loginscreen:loginscreen,
      loginmessage:loginmessage
    })
  }

  /*
  handleClick(event) {
    //console.log("event",event);
    var loginmessage;
    var loginscreen = [];
    if(!this.state.isLoggedIn && !this.state.isRegisterPressed) {

      loginscreen.push(<RegisterMethods key="registerMethods" 
        parentContext={this} 
        appContext={this.props.parentContext}/>
      );
      loginmessage = "Takaisin kirjautumiseen";
      console.log("back to login");
      this.setState({
        loginscreen:loginscreen,
        loginmessage:loginmessage,
        buttonLabel:"Login",
        isRegisterPressed:true
      })
    } else if(!this.state.isLoggedIn && this.state.isRegisterPressed) {

      loginscreen.push(<LoginMethods key="loginMethods" 
        parentContext={this} 
        appContext={this.props.parentContext}/>
      );
      loginmessage = "Luo tunnus";
      console.log("back to registration");
      this.setState({
        loginscreen:loginscreen,
        loginmessage:loginmessage,
        buttonLabel:"Register",
        isRegisterPressed:false
      })
    }
  }
  */

  render() {
    return (
      <div className="loginscreen">
        {this.state.loginscreen}
        <div className="loginInfoBox">
          {this.state.loginButtons}
          {this.state.loginmessage}
        </div>
      </div>
    );
  }
}

export default LoginPage;