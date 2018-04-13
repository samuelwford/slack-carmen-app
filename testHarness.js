handler = require('./handler.js');

function mock_cb(context, error, response) {
  console.log("----------\n" + context + ":");
  console.log(response);  
}

handler.whereis({}, {}, (error, response) => { mock_cb("whereis", error, response) });

handler.whereis({ body: "token=b8ZCB6zG4tjpgSphbAUw4rlA&team_id=T3WG97HEZ&team_domain=geekcap&channel_id=C3WDQ2K1Q&channel_name=general&user_id=U3VNXNV4G&user_name=samuel.ford&command=%2Fwhereis&text=sam+dong+greg+paul&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT3WG97HEZ%2F346735694613%2FQkddlUiUmUyuPMizGvhViiso&trigger_id=346498157331.132553255509.1b24e5c55e8bf8b64ec40460c0b8d081"}, {}, (error, response) => { mock_cb("whereis-big-body", error, response) });

handler.whereis({ body: "command=%2Fwhereis&text=sam+dong+++greg+paul"}, {}, (error, response) => { mock_cb("whereis-extra-spaces", error, response) });

handler.whereis({ body: "command=%2Fwhereis&text=%3C%40U3VP4CLCR%7Csteven.haines%3E+today"}, {}, (error, response) => { mock_cb("whereis-encoded-user", error, response) });
