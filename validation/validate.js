/**
 *  <validate.js>
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
 * First edit 2018-11-13
 * 
 * This is an external server-side validation file, which is called from routes.
 *
 */

var validationMethods = {};

// Request validation
validationMethods.validateRequest = function (requestBody) {

  let bodyLengthJson = JSON.stringify(requestBody).length;

  const maxBodyLength = 160;
  const minBodyLength = 30;
  
  console.log("req body length:", JSON.stringify(requestBody).length);

  // check for appropriate length of request body object as a string.
  if(bodyLengthJson < maxBodyLength && bodyLengthJson > minBodyLength) {

    console.log("request ok");
    return true;

  // send false for invalid requests
  } else {
    console.log("request invalid");
    return false;
  }
}

// Login validation
validationMethods.validateLogin = function (login, password) {

  console.log("inside server validation function.")

  let validLogin = false;
  let validPassword = false;

  if(login.length > 4 && login.length < 8) {

    let idPattern = /\d{6,7}/
    let matchLoginId = idPattern.test(login);
    console.log("login regex match:", matchLoginId);

    if(matchLoginId) {
      validLogin = true;
    } else {
      validLogin = false;
    }
  }

  if(password.length > 3 && password.length < 65) {

    let pwPattern = /^(?!.*(;|{|\||}|\\)).*$/
    let matchPw = pwPattern.test(password);
    console.log("password regex match:", matchPw);

    if(matchPw) {
      validPassword = true;
    } else {
      validPassword = false;
    }
  }

  // if both login and password are valid, return true.
  if(validLogin && validPassword) {
    return true;
  } else {
    return false;
  }

};

/*
// Register validation
validationMethods.validateRegister = function (userData) {
  //-----codehere------
};

// Search validation
validationMethods.validateSearch = function (parameters) {
  //-----codehere------
};

// Add-to-Storage validation
validationMethods.validateAddToStorage = function (parameters) {
  //-----codehere------
};
*/

exports.data = validationMethods;
