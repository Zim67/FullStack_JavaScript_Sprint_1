/*************************
 * File Name: myapp.js
 * Purpose: The main routines to start the initialization app
 *
 * Commands:
 * see usage.txt file
 *
 * Created Date: 20 Feb 2024
 * Authors:
 * PJR - Peter Rawsthorne
 * Revisions:
 * Date, Author, Description
 * 17 Feb 2024, PJR, File created
 * 20 Feb 2024, PJR, altered for lecture prep
 *
 *************************/
global.DEBUG = true;

const fs = require("fs");
const { initializeApp } = require('./init.js');
const { configApp } = require('./Config.js');
const { tokenApp } = require('./token.js')

const myArgs = process.argv.slice(2);
if(DEBUG) if(myArgs.length >= 1) console.log('the myapp.args: ', myArgs);

switch (myArgs[0]) {
    case 'init':
    case 'i':
        if(DEBUG) console.log(myArgs[0], ' - initialize the app.');
        initializeApp();
        break;
    case 'config':
    case 'c':
        if(DEBUG) console.log(myArgs[0], ' - display the configuration file');
        configApp();
        break;
    case 'token':
    case 't':
        if(DEBUG) console.log(myArgs[0], ' - generate a user token');
        tokenApp();
        break;
    case '--help':
    case '--h':
    default:
        fs.readFile(__dirname + "/usage.txt", (error, data) => {
            if(error) throw error;
            console.log(data.toString());
        });
}