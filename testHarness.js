// to test:
// set these variables:
// export TOKEN=abc123
// export CARMEN_TABLE=carmen-dev
// export AWS_REGION=us-east-1

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

handler.whereis({}, {}, (error, response) => { mock_cb("whereis", error, response) }, { command: "/whereis", commandText: "" });

// whereis @samuel.ford today
handler.carmen({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+today&token=abc123"}, {}, (error, response) => { mock_cb("whereis-encoded-user", error, response) });

// whereis @steven.haines next tuesday @jdoe
handler.carmen({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+next+tuesday+%3C%40U123ABC%7Cjdoe%3E&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @samuel.ford today", error, response) });

// whereis @samuel.ford 5/1
handler.carmen({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+5%2F1&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @samuel.ford 5/1", error, response) });

// whereis 5/1
handler.carmen({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=5%2F1&token=abc123"}, {}, (error, response) => { mock_cb("/whereis 5/1", error, response) });

// whereis @steven.haines lsadjfksd @jdoe
handler.carmen({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+lsadjflksd+%3C%40U123ABC%7Cjdoe%3E&token=abc123"}, {}, (error, response) => { mock_cb("/whereis @steven.haines lsadjfksd @jdoe", error, response) });

handler.carmen({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fiamat&text=kp+today&token=abc123"}, {}, (error, response)=> { mock_cb("/iamat kp today", error, response) });

handler.carmen({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fiamat&text=help&token=abc123"}, {}, (error, response) => { mock_cb("/iamat help", error, response) });

handler.carmen({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=?&token=abc123"}, {}, (error, response) => { mock_cb("/whereis help", error, response) });

handler.carmen({ body: 'token=abc123&team_id=T3WG97HEZ&team_domain=geekcap&channel_id=G3WR77LV8&channel_name=privategroup&user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=%3C%40U3X6DLBK9%7Ctroybugos%3E&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT3WG97HEZ%2F388448314001%2Fy0Owx7szVytUthWNPuW5Py3A&trigger_id=388448314033.132553255509.3058242d76a0d4a95e4578c850efb14a'}, {}, (error, response) => { mock_cb("/whereis captured", error, response) });