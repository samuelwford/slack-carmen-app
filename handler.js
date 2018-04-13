'use strict';

// command is: /whereis [[@user @user ...] [today|tomorrow|next week|4/15|...] | ...]
module.exports.whereis = (event, context, callback) => {
  let params = parseParams(event);
  let commandText = unescape(params.text + "");
  let users = parseUsers(commandText);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: users
    })
  };
    
  callback(null, response);
};

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

function parseUsers(listOfNames) {
  return listOfNames.split("+").filter(name => name).map(parseUser);
}

function parseUser(name) {
  console.log(name);
  let match = name.match(/^<(@U\w+)\|(.+)>/);
  if (match) {
    console.log(match);
    return { id: match[1], name: match[2] };
  } else {
    return name;
  }
}