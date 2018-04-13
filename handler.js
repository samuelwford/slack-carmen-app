'use strict';

module.exports.whereis = (event, context, callback) => {
  let body = event.body + "";
  let paramsArray = body.split("&").map(param => param.split("="));
  
  let params = {};
  paramsArray.forEach(param => params[param[0]] = param[1]);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: "@samuelford is in KP today, @jdoe is in FA",
      attachments: [
        { text: params.text }
      ]
    })
  };
    
  callback(null, response);
};