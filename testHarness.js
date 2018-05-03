handler = require('./handler.js');
repo = require('./repository');

function mock_cb(context, error, response) {
  console.log("----------\n" + context + ":");
  console.log(response);  
}

repo.findUser( { id: 'U3VNXNV4G' })
  .then(function(result) {
    console.log("result -----");
    console.log(result);
  },
  function(error) {
    console.log("error -----");
    console.log(error);
  });

repo.findUser( { id: 'ABC123' })
  .then(function(result) {
    console.log("result -----");
    console.log(result);
  },
  function(error) {
    console.log("error -----");
    console.log(error);
  });

handler.whereis({}, {}, (error, response) => { mock_cb("whereis", error, response) });

// whereis @samuel.ford today
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+today&token=abc123"}, {}, (error, response) => { mock_cb("whereis-encoded-user", error, response) });

// whereis @steven.haines next tuesday @jdoe
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+next+tuesday+%3C%40U123ABC%7Cjdoe%3E&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @samuel.ford today", error, response) });

// whereis @samuel.ford 5/1
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+5%2F1&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @samuel.ford 5/1", error, response) });

// whereis 5/1
handler.whereis({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=5%2F1&token=abc123"}, {}, (error, response) => { mock_cb("/whereis 5/1", error, response) });

// whereis @steven.haines lsadjfksd @jdoe
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+lsadjflksd+%3C%40U123ABC%7Cjdoe%3E&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @steven.haines lsadjfksd @jdoe", error, response) });

handler.iamat({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fiamat&text=kp+today&token=abc123"}, {}, (error, response)=> { mock_cb("/iamat kp today", error, response) });

handler.iamat({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fiamat&text=help&token=abc123"}, {}, (error, response) => { mock_cb("/iamat help", error, response) });

handler.whereis({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=?&token=abc123"}, {}, (error, response) => { mock_cb("/whereis help", error, response) });
