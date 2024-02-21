// logEvents.js
/*************************
 * File Name: logEvents.js
 * Purpose: To provide a logging feature
 * 
 * Created Date: 20 Feb 2024
 * Authors:
 * PJR - Peter Rawsthorne
 * Revisions:
 * Date, Author, Description
 * 17 Feb 2024, PJR, File created
 * 20 Feb 2024, PJR, add date to log file name
 *      implement DEBUG global
 * 18 feb 2024, PJR, moved into github project qap-two
 *      enhanced with additional folder creation for yyyy
 * 20 Feb 2024, PJR, fixed the logs/yyyy folder creation bug
 * 20 Feb 2024, PJR, altered log file name
 *
 *************************/
// NPM installed Modules
const { format, getYear } = require('date-fns');
const { v4: uuid } = require('uuid');

// Node.js common core global modules
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (event, level, message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${level}\t${event}\t${message}\t${uuid()}`;
    try {
        // Include year when managing log folders
        const currFolder = 'logs/' + getYear(new Date());
        if(!fs.existsSync(path.join(__dirname, 'logs/'))) {
            // if the parent directory logs/ doesn't exist, create it
            // is there a bug here?
            await fsPromises.mkdir(path.join(__dirname, 'logs/'));
            if(!fs.existsSync(path.join(__dirname, currFolder))) {
                // create the directory for the year ./logs/yyyy
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        }
        else {
            if(!fs.existsSync(path.join(__dirname, currFolder))) {
                // create the directory for the year ./logs/yyyy
                await fsPromises.mkdir(path.join(__dirname, currFolder));
            }
        }
        // Include todays date in filename
        if(DEBUG) console.log(logItem);
        const fileName = `${format(new Date(), 'yyyyMMdd')}` + '_events.log';
        await fsPromises.appendFile(path.join(__dirname, currFolder, fileName), logItem + '\n');
    } catch (err) {
        console.log(err);
    }
}

module.exports = logEvents;