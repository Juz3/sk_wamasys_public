 /**
 *  <Navigation.js>
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
  Link,
  withRouter } from 'react-router-dom';

import {
  Button,
  Navbar,
  Nav,
  NavItem } from 'reactstrap';

import Cookies from 'universal-cookie';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isCookie: false,
      loggedOut: false,
      logoutButtonStyle: {
        display: 'none'
      },
      loginStyle: {
        display: ''
      },
      searchStyle: {
        display: 'none'
      },
      storageStyle: {
        display: 'none'
      },
      homeStyle: {
        display: 'none'
      }
    };
  }

  componentDidMount() {

    const cookies = new Cookies();
    
    if(typeof cookies.get('jwtAuth') !== 'undefined') {

      //console.log("navbar cookie 1");
      //console.log(typeof cookies.get('jwtAuth'))

      // decode jwt here and set link visibilities here!!!
      this.setState({
        isCookie: true,
        logoutButtonStyle: {
          display: ''
        }
      });
    } else {
      //console.log("navbar cookie else 1");
      //console.log(cookies.get('jwtAuth'));
      this.setState({
        isCookie: false,
        logoutButtonStyle: {
          display: 'none'
        },
        loginStyle: {
          display: ''
        }
      });
    }
  }

  render() {
    const cookies = new Cookies();

    if(typeof cookies.get('jwtAuth') !== 'undefined') {
    
      if(this.state.isCookie === false) {
        this.setState({
          isCookie: true,
          logoutButtonStyle: {
            display: ''
          },
          loginStyle: {
            display: 'none'
          },
          searchStyle: {
            display: ''
          },
          storageStyle: {
            display: ''
          },
          homeStyle: {
            display: ''
          }
        })
      }
    }

    const LogOutButton = withRouter(
      ({ history }) =>
        <Button className="logOutBtn" style={this.state.logoutButtonStyle}
          onClick={() => {
            
            // remove jwt cookie
            cookies.remove('jwtAuth');

            this.setState({
              isCookie: false,
              logoutButtonStyle: {
                display: 'none'
              },
              loggedOut: true,
              loginStyle: {
                display: ''
              },
              searchStyle: {
                display: 'none'
              },
              storageStyle: {
                display: 'none'
              },
              homeStyle: {
                display: 'none'
              }
            });
        
            alert("Kirjauduttu ulos");
            // redirect back to index page
            history.push("/login")
            
          }}
        >
          Kirjaudu ulos
        </Button>
    );

    return (

      <div>
        <div className="topNav">
          <Navbar expand="md">
            <Nav className="mr-auto" navbar>
              <NavItem className="logoImg">
                <Link to="/home">
                  <img alt="logoimg" src={require("../icon.png") }/>
                </Link>
              </NavItem>
            </Nav>
            <Nav className="titleLink" navbar>
              <NavItem className="titleLink">
                <Link className="navbar-brand" to="/home">
                  <p>
                    Kurikan amiksen varastojärjestelmä - 
                    Koulutuskeskus Sedu, Kurikka
                  </p>
                </Link>
              </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem className="logOutNav">
                <LogOutButton />
              </NavItem>
            </Nav>
          </Navbar>
        </div>

        <div className="topNavLinks">
          <Nav>
            <NavItem style={this.state.loginStyle}>
              <Link className="nav-link" to="/login">
                  Kirjaudu sisään
              </Link>
            </NavItem>
            <NavItem style={this.state.homeStyle}>
              <Link className="nav-link" to="/home">
                  Koti
              </Link>
            </NavItem>
            <NavItem style={this.state.searchStyle}>
              <Link className="nav-link" to="/search">
                  Haku
              </Link>
            </NavItem>
            <NavItem style={this.state.storageStyle}>
              <Link className="nav-link" to="/storage">
                  Varaston selaus
                </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/about">
                  Esittely
              </Link>
            </NavItem>
          </Nav>
        </div>
      </div>
    );
  }
}