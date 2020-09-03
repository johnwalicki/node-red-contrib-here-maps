module.exports = function(RED) {
  function HEREapikeyNode(n) {
    RED.nodes.createNode(this,n);
    var node = this;
    //node.apikey = n.apikey;
  }
  RED.nodes.registerType("hereapikey", HEREapikeyNode, {
    credentials: {
      apikey: {type: "password"}
    }
  });

  function HERECalcRouteNode( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var waypoint0 = n.waypoint0;
    var waypoint1 = n.waypoint1;
    var calctype = n.calctype;
    var transport = n.transport;
    var traffic = n.traffic;
    var HEREConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    HEREConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = HEREConfigNode.credentials.apikey;

    node.on('input', function (msg) {

      msg.hereparams = msg.hereparams || {};

      if( typeof msg.hereparams.waypoint0 == 'undefined' ) {
        msg.hereparams.waypoint0 = waypoint0; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.waypoint0 = msg.hereparams.waypoint0;
      }

      if( typeof msg.hereparams.waypoint1 == 'undefined' ) {
        msg.hereparams.waypoint1 = waypoint1; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.waypoint1 = msg.hereparams.waypoint1;
      }

      if( typeof msg.hereparams.routetype == 'undefined' ) {
        msg.hereparams.routetype = calctype; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.routetype = msg.hereparams.routetype.toLowerCase();
      }

      if( typeof msg.hereparams.transport == 'undefined' ) {
        msg.hereparams.transport = transport; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.transport = msg.hereparams.transport.toLowerCase();
      }

      if( typeof msg.hereparams.traffic == 'undefined' ) {
        msg.hereparams.traffic = traffic; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.traffic = msg.hereparams.traffic.toLowerCase();
      }


      (async () => {
        try {
          const response = await axios.get('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?waypoint0=geo!'+msg.hereparams.waypoint0+'&waypoint1=geo!'+ msg.hereparams.waypoint1 + '&mode='+ msg.hereparams.routetype+';'+ msg.hereparams.transport+';traffic:'+ msg.hereparams.traffic +'&apiKey='+apiKey);
          //console.log(response.data)
          msg.payload = response.data;
          node.send(msg);
        } catch (error) {
          console.log(error.response.data);
          //console.log(error.response.status);
          node.warn(error.response.data);
          node.send(msg);
        }
      })();
    });
  }
  RED.nodes.registerType("here-routing",HERECalcRouteNode);
}
