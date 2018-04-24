'use strict';

require('./sugar.min');
const repo = require('./repository');

// command is: /whereis [[@user @user ...] [today|tomorrow|next week|4/15|...] | ...]
module.exports.whereis = (event, context, callback) => {
  
  let params = parseParams(event);
  let commandText = unescape(params.text + "");
  let users = parseUsers(commandText);
  let coalesced = coalesceStrings(users);
  let usersAndDates = parseDates(coalesced);
  
  let queries = buildQueries(usersAndDates);
  
  if (queries.length == 0) {
    queries.push({
      users: [{
        id: params.user_id, 
        name: params.user_name, 
        kind: 'user'
      }], 
      date: new Date(), 
      kind: 'query'
    });
  }

  Promise.all(queries.map(execute))
    .then(values => {
      let flattened = [].concat.apply([], values);
      console.log("consolidated promise results");
      console.log(flattened);
    });
  
  // let
  // .reduce([], (acc, thenable) => { thenable.then(data => { acc.push(data) }, error => { console.log(error) }) });
  
  let response = {
    statusCode: 200,
    body: JSON.stringify({
      text: '' //locations.join('\n')
    })
  };

  callback(null, response);      
};

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
  return decodeURI(text).replace(/%40/g, '@');
}

// turn '<@U123|joe>+today' into [ { id: '123', name: 'joe' }, 'today' ]
function parseUsers(listOfNames) {
  return listOfNames.split("+").filter(name => name).map(parseUser);
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
      if (query.users.length) {
        queries.push(query);
        query = { users: [], date: parseDate('today'), kind: 'query' };
      }
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
          let where = data.item.where[dateKey];
          let userString = "<@" + data.user.id + "|" + data.user.name + ">";
          if (where == undefined) {
            return userString + " is home on " + dateString;
          } else {
            return userString + " is at " + where + " on " + dateString;
          }                
        });
        resolve(results);
      });
  });
}