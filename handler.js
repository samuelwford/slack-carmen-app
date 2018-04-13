'use strict';

module.exports.whereis = (event, context, callback) => {
  let body = event.body + "";
  let paramsArray = body.split("&").map(param => param.split("="));
  
  let params = {};
  paramsArray.forEach(param => params[param[0]] = param[1]);
  
  let user = unescape(params.text + "");
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: params.text + "is in KP today",
      attachments: [
        { text: params.text }
      ]
    })
  };
    
  callback(null, response);
};

function unescape(text) {
  return text.replace('%3C', '<')
             .replace('%3E', '<')
             .replace('%40', '@')
             .replace('%7C', '|');
}