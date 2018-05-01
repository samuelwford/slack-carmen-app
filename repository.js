'use strict'

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

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
              let document = result.Item;
              
              if (Object.keys(document) == 0) {
                document.user = user.id,
                document.where = {}
              }
              
              console.log(document);
              
              resolve({ user: user, item: document });
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
    ReturnValues: 'ALL_NEW'
  };
  
  dynamo.put(params).promise()
    .then(result => {
      resolve({ user: user, item: result.Item });
    })
    .catch(error => reject(error));
}

module.exports.findUser = findUser;
module.exports.updateUser = updateUser;