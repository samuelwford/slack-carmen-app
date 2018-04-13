'use strict';

module.exports.whereis = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      text: "@samuelford is in KP today, @jdoe is in FA",
      attachments: [
        { text: JSON.stringify(event) }
      ]
    })
  };
    
  callback(null, response);
};