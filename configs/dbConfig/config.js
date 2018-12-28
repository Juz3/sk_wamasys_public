/**
 *  <config.js>
 *
 *  Copyright information
 *
 *      Copyright (C) 2018 Jussi Koivumäki <firstname.lastname@cs.tamk.fi>
 * 
 * 
 * @author Jussi Koivumäki
 * @since 2018-05-09
 *
 */

// MySQL module
var mysql = require('mysql');

// keys file
const keys = require('../keys');

/*
// MySQL connection *FROM UBUNTU WITH LOCAL MYSQL!*
exports.connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'UbMysliRadio',
    database : 'seduKurikkaVarasto'
});
*/

// MySQL connection *FROM WINDOWS @ HOME!*
exports.connection = mysql.createConnection({
    host : 'mydb.tamk.fi',
    user : keys.mydbUserSecret,
    password : keys.mysqlPwSecret,
    database : keys.mydbNameSecret,
    dateStrings : true
});

// End of file
