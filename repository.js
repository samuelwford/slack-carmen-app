'use strict'

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

AWS.config.update({ region: 'us-east-1' });

const WHEREIS_TABLE = 'where-is';

var findUser = function(user) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: WHEREIS_TABLE,
      Key: { user: user.id },
    };
    
    var response = { user: user };
    
    dynamo.get(params).promise()
      .then(function(result) { 
              resolve({ user: user, item: result.Item });
            },
            function(error) { 
              reject(error);
            });
  });
}

var updateUser = function(user, schedule) {
  var document = {
    user: user.id,
    where: schedule
  };
  
  let params = {
    TableName: WHEREIS_TABLE,
    Item: document,
    ReturnValues: 'NONE'
  };
  
  dynamo.put(params).promise()
    .then(() => resolve(document))
    .catch(error => reject(error));
}

module.exports.findUser = findUser;
module.exports.updateUser = updateUser;