'use strict';

require('./sugar.min');
const repo = require('./repository');

// command is: /whereis [[@user @user ...] [today|tomorrow|next week|4/15|...] | ...]
module.exports.whereis = (event, context, callback) => {
  authorize(event, context, callback, params => {
    let users = parseUsers(params.commandText);
    let coalesced = coalesceStrings(users);
    let usersAndDates = parseDates(coalesced);
  
    let queries = buildQueries(usersAndDates);

    if (queries.length && queries[0].users.length == 0) {
      queries[0].users.push(params.user);
    }
  
    describe(queries);
    
    Promise.all(queries.map(execute))
      .then(values => {
        let flattened = [].concat.apply([], values);
        let response = {
          statusCode: 200,
          body: JSON.stringify({
            text: "Where they are:\n" + flattened.join('\n')
          })
        };

        console.log(response);
      
        callback(null, response);      
      })
      .catch(error => console.log(error));
  });  
};

// command is: /iamat [place] [today|tomorrow|next week|4/15|...]
// or alone (display everything): /iamat
module.exports.iamat = (event, context, callback) => {
  authorize(event, context, callback, params => {
    let parts = params.commandText.split(" ");
    let where = parts.shift();
    let when = parts.join(" ");
  
    let dateWhen = parseDate(when);
    let dateWhenKey = dateWhen.value.toJSON().substring(0, 10);
    
    let today = new Date();
    let todayKey = today.toJSON().substring(0, 10);
  
    let user = params.user;
    console.log(user);
    
    // find user (create if needed)
    repo.findUser(user)
      .then(result => {
        var document = result.item;
        document.where[dateWhenKey] = where;
        repo.updateUser(user, document.where)
          .then(result => {
            let locations = Object.keys(result.item.where)
              .sort()
              .filter(key => key >= todayKey)
              .map(key => {
                let date = new Date(key);
                let where = result.item.where[key]
                return " • " + where + " on " + date.toLocaleDateString();
              });
          
            let response = {
              statusCode: 200,
              body: JSON.stringify({ 
                response_type: 'in_channel',
                text: "Where is <@" + user.id + "|" + user.name + ">:\n" + locations.join("\n")
              })
            };
          
            console.log(response);
          
            callback(null, response);
          }, error => console.log(error));
      }, error => console.log(error));    
  });  
}

function authorize(event, context, callback, authorized) {
  console.log(event);
  
  let validToken = process.env.TOKEN || '';
  let params = parse(event);
  
  console.log("command: " + params.commandText);
  
  if (params.token == validToken) {
    console.log("Token '" + params.token + "' authorized.");
    authorized(params);
  } else if (params.token == null || params.token == '') {
    console.log("No token provided, not authorized.");
    callback(null, { statusCode: 401 });
  } else {
    console.log("Token '" + params.token + "' NOT VALID, unauthorized.");    
    callback(null, { statusCode: 403 });
  }
}

function parse(event) {
  var params = parseParams(event);
  
  params.commandText = unescape(params.text + "");  
  params.user = { id: params.user_id, name: params.user_name, kind: 'user' };
  
  return params;
}

// dump the queries to the log for diagnostic purposes
function describe(queries) {
  console.log("queries parsed: " + queries.length);
  queries.forEach(q => console.log(q));
}

// turn { body: 'foo=blah&bar=baz'} into { foo: 'blah', bar: 'baz' }
function parseParams(event) {
  let body = event.body + "";
  let paramsArray = body.split("&").map(param => param.split("="));
  
  let params = {};
  paramsArray.forEach(param => params[param[0]] = param[1]);

  return params;
}

// weak sauce here
function unescape(text) {
  return decodeURI(text).replace(/%40/g, '@').replace(/%2F/g, '/').replace(/\+/g, ' ');
}

// turn '<@U123|joe>+today' into [ { id: '123', name: 'joe' }, 'today' ]
function parseUsers(listOfNames) {
  return listOfNames.split(" ").filter(name => name).map(parseUser);
}

// turn '<@U123|joe>' into { id: '123', name: 'joe' }
function parseUser(name) {
  let match = name.match(/^<@(U\w+)\|(.+)>/);
  if (match) {
    return { id: match[1], name: match[2], kind: 'user' };
  } else {
    return name;
  }
}

// turn [ 'next', 'tuesday' ] into [ 'next tuesday' ]
function coalesceStrings(array) {
  let coalesced = [];
  let strings = [];
  
  while (array.length) {
    let el = array.shift();
    if (typeof el === 'string') {
      strings.push(el);
    } else {
      if (strings.length) {
        coalesced.push(strings.join(' '));
        strings = [];
      }
      coalesced.push(el);
    }
  }
  
  if (strings.length) {
    coalesced.push(strings.join(' '));
  }
  
  return coalesced;
}

// turn [ 'today', 'tomorrow', '4/15', 'next tuesday' ] into [ 'Wed Apr 18 2018 10:00:00 GMT-0400 (EDT)', ... ]
function parseDates(array) {
  return array.map(parseDate);
}

// turn 'today' into 'Wed Apr 18 2018 10:00:00 GMT-0400 (EDT)'
function parseDate(item) {
  if (typeof item === 'string') {
    var date = { value: Sugar.Date.create(item), kind: 'date' };
    if (date.value == 'Invalid Date') {
      date.value = Sugar.Date.create('today');
    }
    return date;
  }
  return item;
}

// turn [ user, user, date, user. ... ] into [ query, query, ... ]
function buildQueries(items) {
  var queries = [];
  var query = { users: [], date: parseDate('today'), kind: 'query' };
  
  while (items.length) {
    let item = items.shift();
    if (item.kind == 'date') {
      query.date = item;      
      queries.push(query);
      query = { users: [], date: parseDate('today'), kind: 'query' };
    } else {
      query.users.push(item);
    }
  }
  
  if (query.users.length) {
    queries.push(query);
  }
  
  return queries;
}

function execute(query) {
  let dateKey = query.date.value.toJSON().substring(0, 10);
  let dateString = query.date.value.toLocaleDateString();
  
  return new Promise((resolve, reject) => {
    Promise.all(query.users.map(repo.findUser))
      .then(values => {
        let results = values.map(data => {
          let userString = "<@" + data.user.id + "|" + data.user.name + ">";
          var location = " • It isn't known where " + userString + " is on " + dateString + ".";
          
          if (data.item) {
            let where = data.item.where[dateKey];
            if (where) {
              location = " • " + userString + " is at " + where + " on " + dateString;
            }
          }
          
          return location;
        });
        resolve(results);
      });
  });
}