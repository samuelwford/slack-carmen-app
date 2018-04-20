'use strict'

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const WHEREIS_TABLE = 'where-is';

var findUserById = function(userId) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: WHEREIS_TABLE,
      Key: { user: userId },
      ProjectionExpression: 'schedule'
    };
    
    dynamo.get(params).promise()
      .then(result => resolve(result.Item))
      .catch(error => reject(error));
  });
}

var updateUser = function(userId, schedule) {
  var document = {
    user: userId,
    schedule: schedule
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

module.exports.findUserById = findUserById;
module.exports.updateUser = updateUser;