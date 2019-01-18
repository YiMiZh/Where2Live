
"use strict";
var mysql = require("mysql");

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"website",
    password:""
});

connection.connect(function(err){
    if (err) {
        console.log("Error Connection to DB" + err);
        return;
    }
    console.log("Connection established...");
});





const bcrypt = require('bcrypt-nodejs');
let generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
let validPassword = function(TruePassword, TypeInPassword) {
    return bcrypt.compareSync(TruePassword, TypeInPassword);
};

// mysql.then()



module.exports = {
    connection: connection,
    validPassword: validPassword,
    generateHash: generateHash,
    // db: db
};

