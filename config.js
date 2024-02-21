const fs = require('fs');
const myArgs = process.argv.slice(2);

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

const { configjson } = require('./templates')

function displayConfig() {
    if(DEBUG) console.log('conigf.displayConfig()');
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) throw error; // should write a log event for the error, github issue #12
        console.log(JSON.parse(data));
    });
    myEmitter.emit('log', 'config.displayConfig()', 'INFO', 'display config.json displayed');
}

function resetConfig() {
    if(DEBUG) console.log('config.resetConfig()');
    let configdata = JSON.stringify(configjson, null, 2);
    fs.writeFile(__dirname + '/json/config.json', configdata, (error) => {
        if(error) throw error;   // issue #12 also applies here
        if(DEBUG) console.log('Config file reset to original state');
        myEmitter.emit('log', 'config.resetConfig()', 'INFO', 'config.json reset to original state.');
    });
}

function setConfig() {
    if(DEBUG) console.log('config.setConfig()');
    if(DEBUG) console.log(myArgs);

    let match = false;
    fs.readFile(__dirname + "/json/config.json", (error, data) => {
        if(error) throw error;
        if(DEBUG) console.log(JSON.parse(data));
        let cfg = JSON.parse(data);
        for(let key of Object.keys(cfg)){
            if(key === myArgs[2]) {
                cfg[key] = myArgs[3];
                match = true;
            }
        }
        if(!match) {
            console.log(`invalid key: ${myArgs[2]}, try another.`)
            myEmitter.emit('log', 'config.setConfig()', 'WARNING', `invalid key: ${myArgs[2]}`);
        }
        if(DEBUG) console.log(cfg);
        data = JSON.stringify(cfg, null, 2);
        // looks like this code is writing the file again even if there is
        fs.writeFile(__dirname + '/json/config.json', data, (error) => {
            if (error) throw error;
            if(DEBUG) console.log('Config file successfully updated.');
            myEmitter.emit('log', 'config.setConfig()', 'INFO', `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`);
        });
    });

    myEmitter.emit('log', 'config.setConfig()', 'INFO', `config.json "${myArgs[2]}": updated to "${myArgs[3]}"`);
}

function configApp() {
    if(DEBUG) console.log('configApp()');

    switch (myArgs[1]) {
    case '--show':
        if(DEBUG) console.log('--show');
        displayConfig();
        break;
    case '--reset':
        if(DEBUG) console.log('--reset');
        resetConfig();
        break;
    case '--set':
        if(DEBUG) console.log('--set');
        setConfig();
        break;
    case '--help':
    case '--h':
    default:
        fs.readFile(__dirname + "/views/config.txt", (error, data) => {
            if(error) throw error;
            console.log(data.toString());
        });
    }
}

module.exports = {
    configApp,
}