/**
 *  <routes.js>
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
 * @author Jussi Koivumäki
 * 
 * First edit 2018-04-16
 *
 */

// Bcrypt module
const bcrypt = require('bcrypt');

// rounds for bcrypt
const saltRounds = 12; 

// MySQL connection
const sqlCon = require('../configs/dbConfig/config');

// Jsonwebtoken
const jwt = require('jsonwebtoken');

// keys file
const keys = require('../configs/keys');

const validationFile = require('../validation/validate');

// Connect to MySQL database
sqlCon.connection.connect((err, res) => {
  if(!err) {
    console.log("DB connection successful");
  } else {
    console.log("Error connecting to database", err);
  }
});

// USER REGISTRATION
exports.register = (req, res) => {

  /*
  let userData = [
    req.body.name,
    req.body.login,
    req.body.status,
    req.body.email,
    req.body.password
  ]
  */

  let requestOkay = false;
  // validate request, continue if true.
  if(validationFile.data.validateRequest(req.body)) {
    console.log("validate request true");
    requestOkay = true;
  } else {
    console.log("bad request, access forbidden");
    requestOkay = false;
  }

  //if(requestOkay === true && validationFile.data.validateRegister(req.body)) {
    if(requestOkay === true) {

    // Bcrypt hash function, encrypt password and add user to database
    bcrypt.hash(req.body.password, saltRounds, (err, bcryptedPassword) => {
      var user = {
        "name":req.body.name,
        "login":req.body.login,
        "status":req.body.status,
        "email":req.body.email,
        "password":bcryptedPassword
      }
      // New user insert query
      sqlCon.connection.query('INSERT INTO user SET?', [user], 
        (error, results, fields) => {
        if(error) {
          console.log("Error occurred(loginroute insert query)", error);
          // Code 400 : http code for bad request
          // Code 200 : http code for successful request
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        } else {
          //console.log('query results: ', results);
          // Send response (OK)
          console.log("User registered successfully");
          
          res.send({
            "code":200,
            "success":"User registered successfully"
          });
        }
      });
    });
  } else {
    console.log("Invalid request, registration denied");
    res.sendStatus(403);
  }

  
}



// USER LOGIN
exports.login = (req, res) => {
  
  let requestOkay = false;
  // validate request, continue if true.
  if(validationFile.data.validateRequest(req.body)) {
    console.log("validate request true");
    requestOkay = true;
  } else {
    console.log("bad request, access forbidden");
    requestOkay = false;
  }

  if(requestOkay === true && typeof(req.body.login) !== "undefined" && 
  typeof(req.body.password) !== "undefined") {
    // validate login data, continue if true.
    if(validationFile.data.validateLogin(req.body.login, req.body.password)) {
      // Login ID
      var loginID = req.body.login;
      // Login Password
      var password = req.body.password;
  
      var bearerToken = 'this is the jwt memory';
      //console.log(bearerToken);

      var loginDate = new Date();
      var realMonth = (loginDate.getMonth() + 1)
      // conversion to finnish hours on heroku logs
      if(process.env.NODE_ENV === 'production') { 
        var finnishHours = (loginDate.getHours() + 2);
      } else {
        var finnishHours = loginDate.getHours();
      }
      var accurateDate = loginDate.getDate() + "." + realMonth 
      + "." + loginDate.getFullYear() + " " + finnishHours + ":" 
      + loginDate.getMinutes() + ":" + loginDate.getSeconds();

  
      // Login user select query, comparing login ID to User database
      sqlCon.connection.query('SELECT * FROM user WHERE login = ?', [loginID], 
        (error, results, fields) => {
  
        // if there's an error in login id query
        if(error) {
          console.log("error occurred",error);
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        // If login id is found from database
        } else {
          console.log('attempting login with user ID:', loginID, ' at Finnish time:', accurateDate);
          if(results.length > 0) {
  
            // Compare password to hashed password
            bcrypt.compare(password, results[0].password, (err, doesItMatch) => {
              // If it matches
              if(doesItMatch) {
                // create jwt payload
                const payload = { 
                  userID: results[0].ID,
                  name: results[0].name, 
                  login: results[0].loginID, 
                  status: results[0].status 
                }
  
                // Sign the Token
                // expiresIn : seconds
                jwt.sign(payload, keys.jwtSecretKey, {expiresIn: '7200s'}, 
                  (err, token) => {
  
                      if(err) {
                          console.log("error occurred in  jwt sign ", err);
                          res.sendStatus(403);
                      } else {
                          //console.log("jwt sign success ", token);
                          bearerToken = 'Bearer ' + token;
                          //console.log(bearerToken);

                          console.log('Login successful');
                          // Send response (OK)
                          res.send({
                              "code": 200,
                              "success": "Login successful",
                              token: bearerToken,
                              userID: payload.userID
                          });
                      }
                    }
                );
  
              } else {
                res.send({
                  "code":204,
                  "success":"name and password do not match"
                });
              }
            });
          } else {
            res.send({
              "code":204,
              "success":"name does not exist, field is empty"
            });
          }
        }
      });
    //} else if (typeof(req.body.login) === "undefined") {
      
    } else {
      console.log("Login denied due to error in login validation.");
    }
  } else {
    console.log("Invalid request, login denied");
    res.sendStatus(403);
  }
}

// GET Home route
exports.getHome = (req, res) => {

  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);

    // If jwt is verified, continue
    } else {

      var userID = authData.userID;

      //homepage select query, returns user data
      sqlCon.connection.query('SELECT * FROM user WHERE ID = ?', [userID],
      (error, results, fields) => {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if(error) {
          console.log("Error occurred(loginroute select from user query)", error);
          // Code 400 : http code for bad request
          // Code 200 : http code for successful request
          // Send response
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        } else {
          //console.log('user select query completed')

          // Send response
          res.send(
            JSON.stringify({
              "status": 200, 
              "error": null, 
              "response": results
            })
          );
        }
      });
    }
  });
}

// GET Home route
exports.getLoan = (req, res) => {

  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);

    // If jwt is verified, continue
    } else {

      var userID = authData.userID;

      //homepage select query, returns user data
      var loanQuery = 'SELECT loan.time, loan.status, loan.comment, ' +
      'storage.name, loanList.loaned ' +
      'FROM loan ' +
      'INNER JOIN loanList ' +
      'ON loan.ID = loanList.loanID ' +
      'INNER JOIN user ' +
      'ON loan.userID = user.ID ' +
      'INNER JOIN storage ' +
      'ON loanList.item = storage.ID ' +
      'WHERE user.ID = ? ' +
      'ORDER BY loan.time'
      sqlCon.connection.query(loanQuery, [userID],
      (error, results, fields) => {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if(error) {
          console.log("Error occurred(loginroute select from loan query)", error);
          // Code 400 : http code for bad request
          // Code 200 : http code for successful request
          // Send response
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        } else {
          console.log('loan select query completed');
          // Send response
          res.send(
            JSON.stringify({
              "status": 200, 
              "error": null, 
              "response": results
            })
          );
        }
      });
    }
  });
}

// Get Storage route 
// if JWT is valid, send sql query to list all items from table 'Storage'
exports.getStorage = (req, res) => {

  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);
    // If jwt is verified, continue
    } else {
      // console.log("jwt verified ", JSON.stringify(authData));

      //storage select query, gives all items from storage
      sqlCon.connection.query('SELECT * FROM storage', (error, results, fields) => {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if(error) {
          console.log("Error occurred(loginroute select from storage query)", error);
          // Code 400 : http code for bad request
          // Code 200 : http code for successful request
          // Send response
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        } else {
          //console.log('storage select query completed')

          // Send response
          res.send(
            JSON.stringify({
              "status": 200, 
              "error": null, 
              "response": results
            })
          );
        }
      });
    }
  });
}

exports.search = (req, res) => {

  var searchVal = req.body.eNumber;

  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {

      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);
    // If jwt is verified, continue
    } else {
      // user id from token
      //console.log("jwt verified, userID: ", authData.userID);
      
      // Login user select query, comparing login ID to User database
      sqlCon.connection.query('SELECT * FROM storage WHERE eNumber = ?', [searchVal], 
      (error, results, fields) => {
  
        if(error) {
          console.log("Error occurred(search select from storage query)", error);
          // Code 400 : http code for bad request
          // Code 200 : http code for successful request
          // Send response
          res.send({
            "code":400,
            "failed":"Error occurred"
          })
        } else {
          //console.log('storage select query completed')
          // Send response
          res.send(
            JSON.stringify({
              "status": 200, 
              "error": null, 
              "searchResults": results,
              "userID": authData.userID
            })
          );
        }
      });
    }
  });
}

// Storage add item -route
exports.addItemToStorage = (req, res) => {

  // item from request body
  var item = {
    "name":req.body.name,
    "eNumber":req.body.eNumber,
    "orderNum":req.body.orderNum,
    "inStore":req.body.inStore,
    "status":req.body.status,
    "alert":req.body.alert
  }

  // Log request body
  //console.log("req",  req.body);

  // verify jsonwebtoken
  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);
    // If jwt is verified, proceed.
    } else {
      console.log("jwt verified ", JSON.stringify(authData));

      // If user.status is not 2 or 3, do nothing
      if(authData.status == 1 ) {
        console.log("wrong user status: ",authData.status);
        console.log("Please login as adminstrator or manager.");
        res.send({
          "code":403,
          "failed":"No privileges"
        })
      } else if(authData.status == 0) {
        console.log("wrong user status: ",authData.status);
        console.log("Please login as adminstrator or manager.");
        res.send({
            "code":403,
            "failed":"No privileges"
        })
      } else {
        // New item insert query
        console.log("correct status: proceed",authData.status);
        sqlCon.connection.query('INSERT INTO storage SET?', item, 
        (error, results, fields) => {
          if(error) {
            console.log("Error occurred(storageroute insert query)", error);
            // Code 400 : http code for bad request
            // Code 200 : http code for successful request
            res.send({
              "code":400,
              "failed":"Error occurred"
            })
          } else {
            //console.log('r:204 The solution is: ', results);
            res.send({
              "code":200,
              "success":"Item added successfully"
            });
          }
        });
      }
    }
  });
}

var waitForID = false;
var currentLoanID;

// Loan add loans -route
exports.makeLoan = (req, res) => {
  // item from request body
  var loan = {
    "time":req.body.time,
    "userID":req.body.userID,
    "status":req.body.status,
    "comment":req.body.comment
  }

  // Log request body
  console.log("loan req body",  req.body);

  // verify jsonwebtoken
  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden
      res.sendStatus(403);
    // If jwt is verified, proceed.
    } else {
      console.log("jwt verified ", JSON.stringify(authData));

      // If user.status is not 2 or 3, do nothing
      if(authData.status == 0 ) {
          console.log("wrong user status: ",authData.status);
          console.log("Please login as user, adminstrator or manager.");
          res.send({
              "code":403,
              "failed":"No privileges"
          })
      } else {
        // New loan insert query
        console.log("correct status: proceed to make loan",authData.status);
        
        sqlCon.connection.query('INSERT INTO loan SET?', [loan], 
        (error, results, fields) => {
          if(error) {
            console.log("Error occurred(loan route insert query)", error);
            // Code 400 : http code for bad request
            // Code 200 : http code for successful request
            res.send({
              "code":400,
              "failed":"Error occurred"
            })

          } else {
            
            // Get new loan ID
            sqlCon.connection.query('SELECT LAST_INSERT_ID() AS lastLoanID',
            (error, results, fields) => {
              // error will be an Error if one occurred during the query
              // results will contain the results of the query
              // fields will contain information about the returned results fields (if any)
              if(error) {
                console.log("Error occurred(last insert id query)", error);
              } else {
                console.log('last insert id query completed')
                // Capture created loan ID
                console.log("last loan id:", results[0].lastLoanID);
                currentLoanID = results[0].lastLoanID;
                waitForID = true;
                
                if(waitForID === true) {
                  console.log("loan create success!");
                  console.log("New loan inserted to loan table");
    
                  res.send({
                    "code":200,
                    "success":"Loan created successfully",
                    loanID:currentLoanID
                  });
                  waitForID = false;
                }
              }
            });
            
            
            
            /*
            console.log("New loan inserted to loan table");

            res.send({
              "code":200,
              "success":"Loan created successfully"
            });
            */
          }
        });
        
      }
    }
  });
}

// Loan add loans -route
exports.addToLoanList = (req, res) => {
  // item from request body
  var item = {
    "loanID":req.body.loanID,
    "item":req.body.item,
    "loaned":req.body.loaned
  }

  var loanListArray = req.body;

  console.log(loanListArray);

  // Log request body
  console.log("loanlist req body",  req.body);

  // verify jsonwebtoken
  jwt.verify(req.token, keys.jwtSecretKey, (err, authData) => {
    // If jwt verification gives an error
    if(err) {
      console.log("error in jwt verify", err);
      // Send forbidden status
      res.sendStatus(403);
    // If jwt is verified, proceed.
    } else {
      console.log("jwt verified @loanlist query ", JSON.stringify(authData));

      // If user.status is not 2 or 3, do nothing
      if(authData.status == 0 ) {
        console.log("wrong user status: ", authData.status);
        console.log("Please login as user, adminstrator or manager.");
        res.send({
          "code":403,
          "failed":"No privileges"
        })
      } else {
        // New loan insert query
        console.log("correct status: proceed to add to loanlist");
        
        sqlCon.connection.query('INSERT INTO loanList VALUES ?', loanListArray, 
        (error, results, fields) => {
          if(error) {
            console.log("Error occurred(loanlist insert query)", error);
            // Code 400 : http code for bad request
            // Code 200 : http code for successful request
            res.send({
              "code":400,
              "failed":"Error occurred"
            })
          } else {
            //console.log('r:204 The solution is: ', results);
            res.send({
              "code":200,
              "success":"Loanlist created successfully"
            });
          }
        });
        
      }
    }
  });
}

// End of file
