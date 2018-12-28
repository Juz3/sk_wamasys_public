 /**
 *  <storageMethods.js>
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
import { Link } from 'react-router-dom';
import axios from 'axios';

import {Button,
  Container, 
  Row, 
  Form, 
  FormGroup, 
  Input, 
  Label} from 'reactstrap';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class StorageMethods extends React.Component {
  constructor(props) {
    super(props);
    this.state= { 
        itemName:'',
        itemEnumber:'',
        itemOrdernum:'',
        itemInstore:'',
        itemStatus:'',
        itemAlert:'',
        eNumberLinkStyle: {
          paddingTop: 0,
          paddingBottom:0
        }
    };
  }

  handleClick(event) {

    var apiBaseUrl = "http://localhost:5000/api/";

    var self = this;

    console.log("values: ",
      self.state.itemName,
      self.state.itemEnumber,
      self.state.itemOrdernum,
      self.state.itemInstore,
      self.state.itemStatus,
      self.state.itemAlert);

    // check empty values not implemented! 

    // this object
    //var self = this;

    if(self.state.itemName.length > 0 && 
      self.state.itemEnumber.length > 0 &&
      self.state.itemInstore.length >= 0) {
    
      console.log("if statement passed, moving to payload part");
      var payload = {
        "name": self.state.itemName,
        "eNumber": self.state.itemEnumber,
        "orderNum": self.state.itemOrdernum,
        "inStore": self.state.itemInstore,
        "status": self.state.itemStatus,
        "alert": self.state.itemAlert
      }
      console.log(payload);

      if(typeof cookies.get('jwtAuth') !== 'undefined') {
        axios.post(apiBaseUrl+'add', payload, 
        {
          withCredentials: true,
          headers:
          {
            Authorization: cookies.get('jwtAuth')
          }
        })
        .then(function (response) {
            console.log(response);
            
            if(response.data.code == 200) {
              console.log("item added successfully");
  
              alert("Tuote lisätty tietokantaan");

            } else {
              console.log("error occurred: storageMethods:129",response.data.code);

              if(response.data.code == 403) {
                alert("Nykyisellä käyttäjällä ei ole oikeuksia lisätä tuotteita tietokantaan. Ota yhteyttä adminiin");
              }
            }
        })
        .catch(function (error) {
            console.log("error in axios post storageMethods:133", error);
        });

      } else {
        alert("Kirjaudu sisään admin- tai manager-tason käyttäjällä, jotta voit lisätä tuotteita");
        console.log("cannot insert items to database, no jwt cookie found");
        
      }
    } else {
      console.log("error in if statement, storageMethods:98");
    }
  }

  render() {
    return (
      <div> 
        <div className="mainContainer">
            <Container className="registerForm">
              <Row className="registerForm">
                <div className="storageForm">
                  <Form>
                    <FormGroup>
                      <Label for="Name" className='StorageLabels'>Tuotteen nimi</Label>
                      <Input type="text" name="itemName" id="itemName" 
                      placeholder="Name" 
                      onChange = {(event) => 
                        this.setState({
                          itemName:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Enumber" className='StorageLabels'>Sähkönumero</Label>
                      <Label><Link className="nav-link" to="http://www.sahkonumerot.fi/">
                        style = {this.state.eNumberLinkStyle}>
                        (?)
                      </Link></Label>
                      <Input type="text" name="itemEnumber" id="itemEnumber" 
                      placeholder="Enumber" 
                      onChange = {(event) => 
                        this.setState({
                          itemEnumber:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Ordernum" className='StorageLabels'>Tilausnumero</Label>
                      <Input type="text" name="itemOrdernum" id="itemOrdernum" 
                      placeholder="Ordernum" 
                      onChange = {(event) => 
                        this.setState({
                          itemOrdernum:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Instore" className='StorageLabels'>Varastosaldo</Label>
                      <Input type="text" name="itemInstore" id="itemInstore" 
                      placeholder="itemInstore" 
                      onChange = {(event) => 
                        this.setState({
                          itemInstore:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Status" className='StorageLabels'>Status</Label>
                      <Input type="text" name="itemStatus" id="itemStatus" 
                      placeholder="Status = 1: kulutus || Status = 0: lainattava"
                      onChange = {(event) => 
                        this.setState({
                          itemStatus:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <FormGroup>
                      <Label for="Alert" className='StorageLabels'>Hälytysraja</Label>
                      <Input type="text" name="itemAlert" id="itemAlert" 
                      placeholder="Alert" 
                      onChange = {(event) => 
                        this.setState({
                          itemAlert:event.target.value
                        })
                      }/>
                    </FormGroup>
                    <Button className="submitBtn-register" onClick={(event) => 
                      this.handleClick(event)} style={this.state.okBtnStyle}>
                        Lisää tuote varastoon
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

export default StorageMethods;