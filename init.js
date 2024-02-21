bnmncgngfgf
/*************************
 * File Name: init.js
 * Purpose: The routines to initialize the app
 * 
 * Commands:
myapp init --all      creates the folder structure and config file
myapp init --mk       creates the folder structure
myapp init --cat      creates the config file with default settings
 *
 * Created Date: 2024 - 02  - 20
 * Authors:
 * PJR - Peter Rawsthorne
 * Revisions:
 * Date, Author, Description
 * 17 Feb 2024, PJR, File created
 * 17 Feb 2024, PJR, added createFiles() for init, config, and token views
 * 18 Feb 2024, PJR, re-hydrated project from the spring
 * 19 Feb 2024, PJR, altered for lecture prep
 *************************/
// Node.js common core global modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require('./logEvents');
// define/extend an EventEmitter class
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on('log', (event, level, msg) => logEvents(event, level, msg));

const { folders, configjson, usagetxt } = require('./templates');

function createFolders() {
    if(DEBUG) console.log('init.createFolders()');
    myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders should be created.');
    let mkcount = 0;
    folders.forEach(foldername => {
        if(DEBUG) console.log(foldername);
        try {
            if(!fs.existsSync(path.join(__dirname, foldername))) {
                fsPromises.mkdir(path.join(__dirname, foldername));
                mkcount++;
            }
        } catch (err) {
            console.log(err);
        }
    });
    if(mkcount === 0) {
        if(DEBUG) console.log('All folders already exist.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders already existed.');
    } else if (mkcount <= folders.length) {
        if(DEBUG) console.log(mkcount + ' of ' + folders.length + ' folders were created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', mkcount + ' of ' + folders.length + ' folders needed to be created.');
    } else {
        if(DEBUG) console.log('All folders successfully created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders successfully created.');
    }
};

function createFiles() {
    if(DEBUG) console.log('init.createFiles()');
    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Files should be created.');
    try {
        let configdata = JSON.stringify(configjson, null, 2);
        if(!fs.existsSync(path.join(__dirname, './json/config.json'))) {
            fs.writeFile('./json/config.json', configdata, (err) => {
                if(err) {
                    console.log(err)
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', 'config.json creation was unsuccessful.');
                }
                else {
                    if(DEBUG) console.log('Data written to config file');
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json successfully created.');
                }
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', 'config.json already exists.'); 
        }
       
        if(!fs.existsSync(path.join(__dirname, './views/usage.txt'))) {
            fs.writeFile('./views/usage.txt', usagetxt, (err) => {
                if(DEBUG) console.log('Data written to usage.txt file');
                myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt successfully created.');
            });
        } else {
            myEmitter.emit('log', 'init.createFiles()', 'INFO', './views/usage.txt already exists.'); 
        }
    } catch(err) {
        console.log(err);
    }
};

const myArgs = process.argv.slice(2);
function initializeApp() {
    if(DEBUG) console.log('initializeApp()');
    myEmitter.emit('log', 'initializeApp()', 'INFO', 'init feature was called.');
    
    switch (myArgs[1]) {
    case '--all':
        if(DEBUG) console.log('--all createFolders() & createFiles()');
        createFolders();
        createFiles();
        myEmitter.emit('log', 'init --all', 'INFO', 'Create all folders and files.');
        break;
    case '--cat':
        if(DEBUG) console.log('--cat createFiles()');
        // TODO: Do all the folders exist? See issue #6 in github
        createFiles();
        myEmitter.emit('log', 'init --cat', 'INFO', 'Create all files.');
        break;
    case '--mk':
        if(DEBUG) console.log('--mk createFolders()');
        createFolders();
        myEmitter.emit('log', 'init --mk', 'INFO', 'Create all folders.');
        break;
    case '--help':
    case '--h':
    default:
        fs.readFile(__dirname + "/views/init.txt", (error, data) => {
            if(error) throw error;              
            console.log(data.toString());
        });
    }
}

module.exports = {
    initializeApp,
  }