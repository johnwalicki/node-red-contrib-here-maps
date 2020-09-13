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

  function HEREGeoSearch( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var lon_lat = n.lon_lat;
    var query = n.query;
    var HEREConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    HEREConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = HEREConfigNode.credentials.apikey;

    node.on('input', function (msg) {

      msg.hereparams = msg.hereparams || {};

      if( typeof msg.hereparams.lon_lat == 'undefined' ) {
        msg.hereparams.lon_lat = lon_lat; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.lon_lat = msg.hereparams.lon_lat;
      }

      if( typeof msg.hereparams.query == 'undefined' ) {
        msg.hereparams.query = query; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.query = msg.hereparams.query.toLowerCase();;
      }

      (async () => {
        try {
          const response = await axios.get('https://geocode.search.hereapi.com/v1/geocode?q='+msg.hereparams.query+'&apiKey='+apiKey);
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
  RED.nodes.registerType("here-geocode",HEREGeoSearch);
}
