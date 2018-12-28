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

import {Container, 
    Row, 
    Nav,
    NavItem,
    Table} from 'reactstrap';

import Cookies from 'universal-cookie';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Storage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          getData:false,
          token:'',
          storageData: [],
          tableStyle : {
            //color: 'rgb(39, 167, 71)',
            display: ''
          }
        }
    }
    
  componentDidMount() {

    // API base url address
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://floating-fortress-36530.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }
    var self = this;

    const cookies = new Cookies();

    //console.log('get cookie from storagepage', cookies.get('jwtAuth'));

    // If cookie is found, send axios request. Otherwise print example table
    if(typeof cookies.get('jwtAuth') !== 'undefined') {

      axios.get(apiBaseUrl + 'storage', 
      {
        withCredentials: true,
        headers:
        {
          Authorization: cookies.get('jwtAuth')
        }
      }).then(function (response) {
        self.setState({ 
          storageData: response.data.response,
          getData: true
        });
      }).catch(function (error) {
        // log error
        console.log("error in axios get storage", error);
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
    } else {
      // If jwt cookie is not found, show example table
      self.setState({
        tableStyle: {
          display: 'none'
        }
      })
    }
  }  
    
  render() {

    // Data object, fetched from api via axios get() at componentDidMount()
    const data = this.state.storageData;

    // stringify response data fo debugging
    //console.log('data array from state: ', JSON.stringify(data));
    //console.log(data.length);

    // Fetch data from data object and map to a table
    const listItems = data.map((d) => 

        <tr key= {"row" + d.ID}>
        <th className = 'itemID' scope="row" key = 'd.ID'>{d.ID}</th>
        <td className = 'itemName' key = 'd.name'>{d.name}</td>
        <td className = 'itemEnumber' key = 'd.eNumber'>{d.eNumber}</td>
        <td className = 'itemOrdernum' key = 'd.orderNum'>{d.orderNum}</td>
        <td className = 'itemInstore' key = 'd.inStore'>{d.inStore}</td>
        <td className = 'itemStatus' key = 'd.status'>{d.status}</td>
        <td className = 'itemAlert' key = 'd.alert'>{d.alert}</td>
      </tr>
      
    );

    return (
      <div> 
        <div className="topNav">
        <Nav>
          <NavItem>
            <Link className="nav-link" to="/add">
                Lisää tuotteita varastoon
            </Link>
          </NavItem>
        </Nav>

        </div>
        <div className="mainContainer">
            <Container>
              <Row>
                
                <div className="midInputCol">
                  <div className='storageList'>
                    <Table hover className = 'storageListHeader' style = {this.state.tableStyle}>
                      <thead>
                        <tr key="tableHeaderRow">
                          <th className = 'itemID'>#</th>
                          <th className = 'itemName'>Nimi</th>
                          <th className = 'itemEnumber'>Sähkönumero</th>
                          <th className = 'itemOrdernum'>Tilausnumero</th>
                          <th className = 'itemInstore'>Varastosaldo</th>
                          <th className = 'itemStatus'>Status</th>
                          <th className = 'itemAlert'>Hälytysraja</th>
                        </tr>
                      </thead>
                      <tbody className = 'storageList' key = 'd.tbody'>
                        {listItems }
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Row>
            </Container>
        </div>
      </div>
    )
  }
}

export default Storage;