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

// handler.whereis({}, {}, (error, response) => { mock_cb("whereis", error, response) });

// handler.whereis({ body: "token=b8ZCB6zG4tjpgSphbAUw4rlA&team_id=T3WG97HEZ&team_domain=geekcap&channel_id=C3WDQ2K1Q&channel_name=general&user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=sam+dong+greg+paul&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT3WG97HEZ%2F346735694613%2FQkddlUiUmUyuPMizGvhViiso&trigger_id=346498157331.132553255509.1b24e5c55e8bf8b64ec40460c0b8d081"}, {}, (error, response) => { mock_cb("whereis-big-body", error, response) });

// handler.whereis({ body: "command=%2Fwhereis&text=sam+dong+++greg+paul"}, {}, (error, response) => { mock_cb("whereis-extra-spaces", error, response) });

// whereis @samuel.ford today
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+today"}, {}, (error, response) => { mock_cb("whereis-encoded-user", error, response) });

// whereis @steven.haines next tuesday @jdoe
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+next+tuesday+%3C%40U123ABC%7Cjdoe%3E"}, {}, (error, response) => { mock_cb("whereis-encoded-user-2", error, response) });

// whereis @samuel.ford 5/1
handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VNXNV4G%7Csamuel.ford%3E+5%2F1"}, {}, (error, response) => { mock_cb("whereis-encoded-user-3", error, response) });

// whereis 5/1
handler.whereis({ body: "user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=5%2F1"}, {}, (error, response) => { mock_cb("whereis-encoded-user-4", error, response) });

// handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+lsadjflksd+%3C%40U123ABC%7Cjdoe%3E"}, {}, (error, response) => { mock_cb("whereis-encoded-user-3", error, response) });
