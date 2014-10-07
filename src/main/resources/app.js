/**
 * Created by spousty on 3/15/14.
 */

var vertx = require('vertx');
var container = require('vertx/container');
var console = require('vertx/console');

//for the web server
var ip = container.env['OPENSHIFT_VERTX_IP'] || '127.0.0.1';
var port = parseInt(container.env['OPENSHIFT_VERTX_PORT'] || 8080);

//for the mongo persistor
var dbdns = container.env['OPENSHIFT_MONGODB_DB_HOST'];
var dbport = parseInt(container.env['OPENSHIFT_MONGODB_DB_PORT']);
var dbusername = container.env['OPENSHIFT_MONGODB_DB_USERNAME'];
var dbpassword =container.env['OPENSHIFT_MONGODB_DB_PASSWORD'];
var database = container.env['OPENSHIFT_APP_NAME'];



//may want to add
// gzip_file: true
//
// By default the SockJS bridge registers at URL prefix:
// {"prefix": "/eventbus"}
container.deployModule("io.vertx~mod-web-server~2.0.0-final",
    {   port: port,
        host: ip,
        web_root: "web",
        index_page: "index.html",
        bridge: true,
        outbound_permitted: [
            { address: "flights.updated" }
        ]
    }, function(err, deployID){
    console.log("started web server")});

container.deployVerticle("com.openshift.FeedGetter");
container.deployVerticle("FlightPublisher.py")
container.deployModule("io.vertx~mod-mongo-persistor~2.0.0-final",{
    host: dbdns,
    port: dbport,
    username: dbusername,
    password: dbpassword,
    db_name: database
    },
    function(err, deployID){
        console.log("started mongo persistor " + err)
    }
);
