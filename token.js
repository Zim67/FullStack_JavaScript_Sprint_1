// Add logging to the CLI project by using eventLogging
// load the logEvents module
const logEvents = require("./logEvents");

// define/extend an EventEmitter class
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}

// initialize an new emitter object
const myEmitter = new MyEmitter();
// add the listener for the logEvent
myEmitter.on("log", (event, level, msg) => logEvents(event, level, msg));

// Node.js common core global modules
const fs = require("fs");
const path = require("path");

const crc32 = require("crc/crc32");
const { format } = require("date-fns");

const myArgs = process.argv.slice(2);

var tokenCount = function () {
  if (DEBUG) console.log("token.tokenCount()");
  return new Promise(function (resolve, reject) {
    fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
      if (error) reject(error);
      else {
        let tokens = JSON.parse(data);
        let count = Object.keys(tokens).length;
        console.log(`Current token count is ${count}.`);
        myEmitter.emit(
          "log",
          "token.tokenCount()",
          "INFO",
          `Current token count is ${count}.`
        );
        resolve(count);
      }
    });
  });
};

function newToken(username) {
  if (DEBUG) console.log("token.newToken()");

  let newToken = JSON.parse(`{
        "created": "1969-01-31 12:30:00",
        "username": "username",
        "email": "user@example.com",
        "phone": "5556597890",
        "token": "token",
        "expires": "1969-02-03 12:30:00",
        "confirmed": "tbd"
    }`);

  let now = new Date();
  let expires = addDays(now, 3);

  newToken.created = `${format(now, "yyyy-MM-dd HH:mm:ss")}`;
  newToken.username = username;
  newToken.token = crc32(username).toString(16);
  newToken.expires = `${format(expires, "yyyy-MM-dd HH:mm:ss")}`;

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.push(newToken);
    userTokens = JSON.stringify(tokens);

    fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
      if (err) console.log(err);
      else {
        console.log(`New token ${newToken.token} was created for ${username}.`);
        myEmitter.emit(
          "log",
          "token.newToken()",
          "INFO",
          `New token ${newToken.token} was created for ${username}.`
        );
      }
    });
  });
  return newToken.token;
}

function updateToken(argv) {
  if (DEBUG) console.log("token.updateToken()");
  if (DEBUG) console.log(argv);

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;

    let tokens = JSON.parse(data);
    let updated = false;

    tokens.forEach((obj) => {
      if (obj.username === argv[3]) {
        if (DEBUG) console.log(obj);

        switch (argv[2].toLowerCase()) {
          case "p":
            obj.phone = argv[4];
            updated = true;
            break;
          case "e":
            obj.email = argv[4];
            updated = true;
            break;
          default:
            // TODO: handle incorrect options #
            console.log("Invalid option. Use -p for phone or -e for email.");
            return;
        }

        if (DEBUG) console.log(obj);
      }
    });

    if (updated) {
      const userTokens = JSON.stringify(tokens);
      fs.writeFile(__dirname + "/json/tokens.json", userTokens, (err) => {
        if (err) console.log(err);
        else {
          console.log(
            `Token record for ${argv[3]} was updated with ${argv[4]}.`
          );
          myEmitter.emit(
            "log",
            "token.updateToken()",
            "INFO",
            `Token record for ${argv[3]} was updated with ${argv[4]}.`
          );
        }
      });
    }
  });
}

function tokenApp() {
  if (DEBUG) console.log("tokenApp()");

  switch (myArgs[1]) {
    case "--count":
      if (DEBUG) console.log("token.tokenCount() --count");
      tokenCount();
      break;
    case "--list":
      if (DEBUG) console.log("token.tokenList() --list");
      tokenList();
      break;
    case "--new":
      if (myArgs.length < 3) {
        console.log("invalid syntax. node myapp token --new [username]");
        myEmitter.emit(
          "log",
          "token.newToken() --new",
          "WARNING",
          "invalid syntax, usage displayed"
        );
      } else {
        newToken(myArgs[2]);
      }
      break;
    case "--upd":
      if (myArgs.length < 5) {
        console.log(
          "invalid syntax. node myapp token --upd [option] [username] [new value]"
        );
        myEmitter.emit(
          "log",
          "token.updateToken() --upd",
          "WARNING",
          "invalid syntax, usage displayed"
        );
      } else {
        updateToken(myArgs);
      }
      break;
    case "--fetch":
      if (myArgs.length < 3) {
        console.log("invalid syntax. node myapp token --fetch [username]");
        myEmitter.emit(
          "log",
          "token.fetchRecord() --fetch",
          "WARNING",
          "invalid syntax, usage displayed"
        );
      } else {
        fetchToken(myArgs[2]);
      }
      break;
    case "--search":
      if (DEBUG) console.log("token.searchToken()");
      if (myArgs.length < 3) {
        console.log("invalid syntax. node myappl token --search [criteria]");
        myEmitter.emit(
          "log",
          "token.searchToken() --search",
          "WARNING",
          "invalid syntax, usage displayed"
        );
      } else {
        const searchType = myArgs[2][0];
        const searchCriteria = myArgs.slice(3).join(" ");

        switch (searchType) {
          case "e":
            searchToken("e", searchCriteria);
            break;
          case "p":
            searchToken("p", searchCriteria);
            break;
          case "u":
            searchToken("u", searchCriteria);
            break;
          default:
            console.log(
              'Invalid search type. Please use "e" for email, "p" for phone, or "u" for username.'
            );
            break;
        }
      }
      break;
    case "-add":
      if (myArgs.length < 4) {
        console.log(
          "Invalid syntax. Usage: node myapp user --add [username] [email] [phone]"
        );
        myEmitter.emit(
          "log",
          "user.addUser() -- add",
          "WARNING",
          "Invalid syntax, usage displayed"
        );
      } else {
        addUser(myArgs[2], myArgs[3], myArgs[4]);
      }
      break;
    case "--info":
      if (myArgs.length < 3) {
        console.log("invalid syntax. node myapp token --info [username");
        myEmitter.emit(
          "log",
          "token.searchUserToken() --info",
          "WARNING",
          "invalid syntax, usage displayed"
        );
      } else {
        searchUserToken(myArgs[2]);
      }
      break;
    case "--help":
    case "--h":
    default:
      fs.readFile(__dirname + "/views/token.txt", (error, data) => {
        if (error) throw error;
        console.log(data.toString());
      });
  }
}

function tokenList() {
  if (DEBUG) console.log("token.tokenList() --list");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    tokens.forEach((token) => {
      console.log(`Token: ${token.token}, Username: ${token.username}`);
    });
  });
}

function fetchToken(username) {
  if (DEBUG) console.log("token.fetchToken()");
  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;
    let tokens = JSON.parse(data);
    const foundToken = tokens.find((token) => token.username === username);
    if (foundToken) {
      console.log(`Token for ${username}: ${foundToken.token}`);
    } else {
      console.log(`Token not found for username: ${username}`);
    }
  });
}

function searchToken(type, criteria) {
  if (DEBUG) console.log("token.searchToken()");

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;

    let tokens = JSON.parse(data);

    let results = [];

    switch (type) {
      case "e":
        results = tokens.filter((token) =>
          token.email.toLowerCase().includes(criteria.toLowerCase())
        );
        break;
      case "p":
        results = tokens.filter((token) =>
          token.phone.toLowerCase().includes(criteria.toLowerCase())
        );
        break;
      case "u":
        results = tokens.filter((token) =>
          token.username.toLowerCase().includes(criteria.toLowerCase())
        );
        break;
      default:
        console.log(
          'Invalid search type. Please use "e" for email, "p" for phone, or "u" for username.'
        );
        break;
    }

    if (results.length > 0) {
      console.log(`Tokens matching the criteria:`);
      results.forEach((token) => {
        console.log(`Token: ${token.token}, Username: ${token.username}`);
      });
    } else {
      console.log("No tokens found matching the criteria.");
    }
  });
}

function addUser(username, email, phone) {
  if (DEBUG) console.log("user.addUser()");

  fs.readFile(__dirname + "/json/users.json", "utf-8", (error, data) => {
    if (error) throw error;

    let users = JSON.parse(data);

    if (users.find((user) => user.username === username)) {
      console.log(`User with username ${username} already exists.`);
      return;
    }

    const newUser = {
      username,
      email,
      phone,
    };

    users.push(newUser);

    fs.writeFile(
      __dirname + "/json/users.json",
      JSON.stringify(users, null, 2),
      (err) => {
        if (err) console.log(err);
        else {
          console.log(
            `User ${username} added with email: ${email} and phone: ${phone}`
          );
          myEmitter.emit(
            "log",
            "user.addUser()",
            "INFO",
            `User ${username} added with email: ${email} and phone: ${phone}`
          );
        }
      }
    );
  });
}

function updateUser(username, email, phone) {
  if (DEBUG) console.log("user.updateUser()");

  fs.readFile(__dirname + "/json/users.json", "utf-8", (error, data) => {
    if (error) throw error;

    let users = JSON.parse(data);

    const user = users.find((user) => user.username === username);

    if (user) {
      if (email) {
        user.email = email;
      }
      if (phone) {
        user.phone = phone;
      }

      fs.writeFile(
        __dirname + "/json/users.json",
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) console.log(err);
          else {
            console.log(
              `User ${username} updated with email: ${user.email} and phone: ${user.phone}`
            );
            myEmitter.emit(
              "log",
              "user.updateUser()",
              "INFO",
              `User ${username} updated with email: ${user.email} and phone: ${user.phone}`
            );
          }
        }
      );
    } else {
      console.log(`User with username ${username} not found.`);
    }
  });
}

function searchUserToken(username) {
  if (DEBUG) console.log("searchUserToken()");

  fs.readFile(__dirname + "/json/tokens.json", "utf-8", (error, data) => {
    if (error) throw error;

    let tokens = JSON.parse(data);

    const userToken = tokens.find((token) => token.username === username);

    if (userToken) {
      console.log(`User Information for ${username}:`);
      console.log(`Username: ${userToken.username}`);
      console.log(`Phone: ${userToken.phone}`);
      console.log(`Email: ${userToken.email}`);
      console.log(`Token ID: ${userToken.token}`);
    } else {
      console.log(`User not found for username: ${username}`);
    }
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  tokenApp,
  newToken,
  tokenCount,
  // fetchRecord,
};