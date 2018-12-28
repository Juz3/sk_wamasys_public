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
import { Redirect } from 'react-router-dom';

import {Button,
  Container, 
  Row, 
  Form, 
  FormGroup, 
  Input, 
  Label,
  Table} from 'reactstrap';

import Cookies from 'universal-cookie';
import axios from 'axios';


const cookies = new Cookies();

const loanNotReturned = 0
const loanReturned = 1

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state= { 
      // OK button style
      okBtnStyle : {
        color: '#27a747',
        background: '#191a1d'
      },
      isLoggedIn : false,
      eNumber : '',
      responseData: [],
      resultArray: [],
      searchTableStyle: {
        display: 'none'
      },
      itemList: [],
      loanList: [],
      headingStyle: {
        background: '#26272b'
      },
      searchCounter: 0,
      loanData: [],
      firstItemToLoanAdded: false,
      userID: '',
      selectedAmount: '',
      addToDB: true,
      loanCreated: false
    };
  }

  componentDidMount() {    

    // get cookie if it exists
    if(typeof cookies.get('jwtAuth') !== 'undefined') {
      console.log('cookie found, proceed');
      this.setState({
        isLoggedIn: true
      });

    } else {
      console.log("session cookie doesn't exist");
      this.setState({
        isLoggedIn: false
      });
    }
  }

  /*
  *  Input listener function for searching with Enter-key
  * 
  *  @param event onClick event from search button click 
  */
  onKeyPress(event) {
    /* Enter key */
    if (event.which === 13 ) {
      event.preventDefault();
      console.log(event);
      this.inputCheck(event);
    }
  }

  /*
  *  Input listener function for disabling Enter-key at amount-field
  * 
  *  @param event keypress event at input field
  */
  onKeyPressAtAmount(event) {
    /* Enter key */
    if (event.which === 13 ) {
      event.preventDefault();
      //console.log(event);
    }
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({selectedAmount: event.target.value});
  }

  inputCheck(event) {

    if(this.state.isLoggedIn === true) {
      //console.log("inputcheck function ran, eNumber: ", eNumber.value);
    
      this.setState({
        okBtnStyle: {
          background: '#8a8a8a'
        },
        searchTableStyle: {
          display: ''
        }
      });
     this.handleClick(event);
    } else {
      alert("Kirjaudu sisään, jotta voit käyttää hakua");
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

    // check input for only digits
    var regex_eNumber = /^\d+$/

    if(self.state.eNumber.length === 7 && regex_eNumber.test(self.state.eNumber)) {

      // payload strings; These need to match table column names
      var payload = {
        "eNumber": self.state.eNumber
      }

      var searchCounter = self.state.searchCounter;

      // Axios.post(apiurl, payload, {axios options}).then().catch();
      axios.post(apiBaseUrl+'search', payload, 
      {
        withCredentials: true,
        headers:
        {
          Authorization: cookies.get('jwtAuth')
        }
      })
      .then(function (response) {
        // Axios response
        console.log("axios search post response: ", response);
        if(response.data.status === 200) {
          // search post SUCCESS:
          self.setState({
            searchCounter: self.state.searchCounter + 1
          })

          console.log("search successful! search count:", searchCounter);

          console.log("first search, count:", searchCounter);
          self.setState({
            responseData: response.data.searchResults,
            userID: response.data.userID
          });

          console.log("user ID from response: ", self.state.userID);

          // run listItems function
          self.listItems();

        } else if(response.data.status === 204) {
          //console.log("error, something went wrong");
          alert("error");
        } else if(response.data.status === 403) {
          alert("Kirjaudu sisään");
        } else {
          //console.log("item does not exist / else error", response);
          alert("bonus error");
        }
      })
      // If there's an error
      .catch(function (error) {
        // log error
        
        //console.log("error in axios post", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx

          //console.log('error in response', error.response.data);
          //console.log('error in response', error.response.status);
          //console.log('error in response', error.response.headers);
          alert('Haussa tapahtui virhe. Kirjaudu uudestaan sisään');
          self.setState({isLoggedIn: false});
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          alert('Haussa tapahtui virhe. Ota yhteyttä järjestelmänvalvojaan, jos virhe toistuu');
          //console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          alert('Haussa tapahtui virhe. Ota yhteyttä järjestelmänvalvojaan, jos virhe toistuu');
          //console.log('Error elsewhere', error.message);
        }      
      });

    } else {
      // error before post
      console.log("Error, invalid input");
      alert("Haussa tapahtui virhe. Sähkönumerossa on oltava 7 numeroa.");
    }
  }

  listItems() {

    var self = this;

    self.setState({
      searchTableStyle: {
        display: 'block'
      }
    });

    if(self.state.responseData.length > 0) {
      // Data object, fetched from api via axios post() at ()
      console.log(self.state.responseData.length);
      var responseData = self.state.responseData;

      // stringify response data fo debugging
      console.log('pure data array from state: ', JSON.stringify(responseData));

      console.log(self.state.responseData.length);             
      
      console.log("resp data array PROPER", responseData);
      console.log("additive result array", self.state.resultArray);

      var localResultArray = self.state.resultArray;

      // if current is not the first item searched, set result to match new search response
      if(self.state.searchCounter > 1) {
        
        self.setState({ 
          resultArray: responseData
        });
        localResultArray = self.state.resultArray;

      // if first search, populate array with response
      } else {

        for (var i = 0; i < responseData.length; i++) {
          self.state.resultArray.push(responseData[i]);
        }
      }

      var idList = [];

      // Fetch data from data object and map to a table
      var listItems = localResultArray.map((d) => 

        <tr key = {'resultRow' + d.ID}>
          <th className = 'itemID' scope="row" key = 'd.ID'>{d.ID}</th>
          <td className = 'itemName' key = 'd.name'>{d.name}</td>
          <td className = 'itemEnumber' key = 'd.eNumber'>{d.eNumber}</td>
          <td className = 'itemOrdernum' key = 'd.orderNum'>{d.orderNum}</td>
          <td className = 'itemInstore' key = 'd.inStore'>{d.inStore}</td>
          <td className = 'itemStatus' key = 'd.status'>{d.status}</td>
          <td className = 'itemAlert' key = 'd.alert'>{d.alert}</td>
          <td className = 'itemAmount' key = 'd.amount'>
            <Input bsSize = "sm" type = "text" name = "amount" id = "amount" 
              onChange={this.handleChange.bind(this)}
              onKeyPress = {(event) => 
                this.onKeyPressAtAmount(event)
              }
            />
          </td>
          <td className = 'itemAddToList' key = 'd.Add'>
          <Button size="sm" onClick={(event) => 
            self.addToLoanCart(event, localResultArray)} > Lisää koriin
          </Button>
          </td>
        </tr>
      );
      
      //console.log("id list: ", JSON.stringify(idList));

      self.setState({
        itemList: listItems
      });
    // if response data is undefined
    } else {
      alert("Hakemaasi tuotetta ei löydy");
      console.log("response data is undefined", self.state.responseData.length);
    }
  }
  
  addToLoanCart(event, respData) {
    
    var self = this;

    if(self.state.selectedAmount !== '0' || 
      self.state.selectedAmount !== 'undefined' ||
      self.state.selectedAmount !== 'null') {

      console.log("selected amount: ", self.state.selectedAmount);
      console.log(respData);
  
      // if not the first item searched, push item to loanlist array
      if(!self.state.firstItemToLoanAdded) {
        console.log("search count: ", self.state.searchCounter);
        for (var i = 0; i < respData.length; i++) {
          respData[i].amount = (self.state.selectedAmount);
          self.state.loanData.push(respData[i]);
          
        }
        self.setState({
          firstItemToLoanAdded: true
        });
  
      } else {
  
        respData[0].amount = (self.state.selectedAmount);
        var searchResultItem = respData[0];
        
        console.log("item From SearchResult:", searchResultItem);
  
        //for (var i = 0; i < self.state.loanData.length; i++) {
  
          checkAndAdd(searchResultItem);
        //}
  
        // check if search result is already added, if not, add
        function checkAndAdd(searchResultItem) {
          //var id = arr.length + 1;
          var isFound = self.state.loanData.some((loopedItem) => {
            return loopedItem.ID === searchResultItem.ID;
          });
          if (!isFound) { 
            console.log("not found, added");
            self.state.loanData.push(searchResultItem); 
          } else {
            alert("Valittu tuote on jo korissa");
            console.log("item already on list, not added");
          }
        }
      }

      console.log("tulosta hakutulos array", respData);
      
      // map response data to a new array and a table
      var listLoanItems = self.state.loanData.map((d) => 
        <tr key = {'rowID_' + d.ID}>
          <th className = 'itemID' scope="row" key = 'd.ID'>{d.ID}</th>
          <td className = 'itemName' key = 'd.name'>{d.name}</td>
          <td className = 'itemEnumber' key = 'd.eNumber'>{d.eNumber}</td>
          <td className = 'itemOrdernum' key = 'd.orderNum'>{d.orderNum}</td>
          <td className = 'itemInstore' key = 'd.inStore'>{d.inStore}</td>
          <td className = 'itemStatus' key = 'd.status'>{d.status}</td>
          <td className = 'itemAlert' key = 'd.alert'>{d.alert}</td>
          <td className = 'itemAmount' key = 'd.amount'>{d.amount}</td>
        </tr>
      );
  
      console.log("tulosta alemman taulukon sisältö: ", self.state.loanData);
  
      self.setState({
        loanList: listLoanItems
      });
      //alert("Tuote lisätty lainalistaan");
    } else {
      alert("Valitse haluttu kappalemäärä.");
      console.log("selected amount is undefined");
    }

  }

  // Loan function
  createNewLoan(event, loanData) {

    var self = this;

    console.log("lisättävä laina: ", JSON.stringify(loanData));

    // api url
    var apiBaseUrl;
    if(process.env.NODE_ENV === 'production') {
      apiBaseUrl = "https://floating-fortress-36530.herokuapp.com/api/";
    } else {
      apiBaseUrl = "http://localhost:5000/api/";
    }

    // new date, converted to mySQL format. Timezone is UTC
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    console.log("UTC Date: ", date);

    // wtf - TODO
    if(1 < 2) {

      // payload strings for new insert to table 'loan'
      var payloadLoan = {
        "time": date,
        "userID": self.state.userID,
        "status": loanNotReturned, // 0 : loan not returned, 1: loan returned
        "comment": "placeholder-kommentti"
      }

      // Axios.post(apiurl, payload, {axios options}).then().catch();
      axios.post(apiBaseUrl + 'loan', payloadLoan, 
      {
        withCredentials: true,
        headers:
        {
          Authorization: cookies.get('jwtAuth')
        }
      })
      .then(function (response) {
        // Axios response
        console.log("axios loan post response: ", response);
        if(response.data.code === 200) {
          //loan post SUCCESS:
          console.log("loan created successfully");
          
          //var loanID = 999;
          var loanID = response.data.loanID;

          //console.log("loanID:", loanID);

          console.log("loandata:", loanData);
          console.log("loandata length:", loanData.length);

          var loanListArray = [];

          // loop through items in loan
          for(var i = 0; i < loanData.length; i++) {
            
            //console.log(loanData[i].ID);
            //console.log(loanData[i].amount);
            loanListArray.push([null, loanID, loanData[i].ID, parseInt(loanData[i].amount, 10)]);
            
            //console.log("in array",loanListArray);
            
          }

          console.log("loan list array before post:", loanListArray);

          // !!! DO SALDO UPDATE HERE !!! 'axios.put': instore = instore - loanAmount

          // Insert into loanList
          axios.post(apiBaseUrl+'loanlist', [loanListArray], 
          {
            withCredentials: true,
            headers:
            {
              Authorization: cookies.get('jwtAuth')
            }
          })
          .then(function (response) {

            console.log("axios loanlist post response: ", response);

            if(response.data.code === 200) {
              //loanlist post SUCCESS:
              console.log("loanlist items created successfully");
              alert("Laina luotu");
              self.setState({
                loanCreated: true
              });
            } else if(response.data.code === 403) {
              alert("Nykyisellä käyttäjällä ei ole oikeuksia luoda lainoja. Ota yhteyttä ylläpitäjään");
            }

          }).catch(function (error) {
            console.log("error in 2nd axios", error);
          });
          
        } else {
          console.log("error occurred: search:512",response.data.code);

          if(response.data.code === 403) {
            alert("Nykyisellä käyttäjällä ei ole oikeuksia luoda lainoja. Ota yhteyttä ylläpitäjään");
          }
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
          alert('Haussa tapahtui virhe. Kirjaudu uudestaan sisään');
          self.setState({isLoggedIn: false});
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          alert('Haussa tapahtui virhe. Ota yhteyttä järjestelmänvalvojaan, jos virhe toistuu');
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          alert('Haussa tapahtui virhe. Ota yhteyttä järjestelmänvalvojaan, jos virhe toistuu');
          console.log('Error elsewhere', error.message);
        }      
      });

    } else {
      // error before post
      console.log("Error, invalid input");
      alert("invalid input");
    }
  }

  render() {

    // After created loan, redirect to home page
    // BAD PRACTICE TO SET STATE HERE -- FIX
    if(this.state.loanCreated) {
      this.setState({
        loanCreated: false
      })
      return (
        <Redirect to="/home"/>
      )
    } else  {
      return (
        <div> 
          <div className="mainContainer">
              <Container>
                <Row>
                  <div className="searchForm">
                    <Form className="searchForm">
                      <FormGroup>
                        <p className="searchInstructions"> Ohjeet:<br/></p>
                        <ul className="searchInstructions">
                          <li className="searchInstructions">
                          Skannaa tuotteesta viivakoodi, joka sisältää sähkönumeron. 
                          Sähkönumeron voi syöttää myös kirjoittamalla. 
                          Jatka painamalla 'Enter' tai 'Hae'-painiketta.
                          </li><br/>
                          <li className="searchInstructions">
                          Aseta haluttu kappalemäärä hakutuloksessa 
                          ja paina 'Lisää koriin'-painiketta. Yhdessä lainassa voi olla useita tuotteita.
                          </li><br/>
                          <li className="searchInstructions">
                          Alempi lista näyttää lainattavat tuotteet kappalemäärineen, 
                          vahvistaaksesi lainan, paina 'Lainaa valitut tuotteet'-painiketta.
                          </li><br/>
                        </ul>
                        
                        <Label for="productInput">Hae tuote - syötä sähkönumero</Label>
                        <Input type="text" name="text" id="eNumber" 
                        placeholder="sähkönumero" 
                        onChange = {(event) => 
                          this.setState({
                            eNumber:event.target.value
                          })
                        }
                        onKeyPress = {(event) => 
                          this.onKeyPress(event)
                        } />
                      </FormGroup>
                      <Button className="submitBtn-ok" 
                        onClick = {(event) => 
                          this.inputCheck(event)
                        } 
                        style={this.state.okBtnStyle}>
                          Hae
                      </Button>
                    </Form>
                  </div>
                </Row>
              </Container>
          </div>
          <div className="mainContainer" style={this.state.searchTableStyle}>
              <Container>
                <Row>
                  
                  <div className="midInputCol">
                    <p style={this.state.headingStyle}>Hakutulokset</p>
                    
                    <div className='storageList' id='hakulista'> 
                    <Form><FormGroup>
                      
                      <Table hover className = 'storageListHeader'>
                        <thead>
                          <tr>
                            <th className = 'itemID'>#</th>
                            <th className = 'itemName'>Nimi</th>
                            <th className = 'itemEnumber'>Sähkönumero</th>
                            <th className = 'itemOrdernum'>Tilausnumero</th>
                            <th className = 'itemInstore'>Varastosaldo</th>
                            <th className = 'itemStatus'>Status</th>
                            <th className = 'itemAlert'>Hälytysraja</th>
                            <th className = 'itemAmount'>Määrä</th>
                            <th className = 'itemAddToList'>Valitse</th>
                          </tr>
                        </thead>
                        <tbody key = "resultRowTableBody" className = 'storageList'>
                        { this.state.itemList }
                        </tbody>
                      </Table>
                      </FormGroup>
                    </Form>
                    </div>
  
                    <p style={this.state.headingStyle}>Lainakori</p>
  
                    <div className='loanList'> 
                      <Table hover className = 'loanListTable' id='lainalista'>
                        <thead>
                          <tr>
                            <th className = 'itemID'>#</th>
                            <th className = 'itemName'>Nimi</th>
                            <th className = 'itemEnumber'>Sähkönumero</th>
                            <th className = 'itemOrdernum'>Tilausnumero</th>
                            <th className = 'itemInstore'>Varastosaldo</th>
                            <th className = 'itemStatus'>Status</th>
                            <th className = 'itemAlert'>Hälytysraja</th>
                            <th className = 'itemAmount'>Määrä</th>
                          </tr>
                        </thead>
                        <tbody key = "loanListTableBody" className = 'storageList'>
                        {this.state.loanList }
                        </tbody>
  
                      </Table>
                      <Button size="sm" onClick={(event) => 
                        this.createNewLoan(event, this.state.loanData)} > Lainaa valitut tuotteet
                      </Button>
                    </div>
                  </div>
                </Row>
              </Container>
          </div>
        </div>
      )
    }

    
  }
}

export default Search;