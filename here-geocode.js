module.exports = function(RED) {
  function HEREGeoSearch( n ) {
    RED.nodes.createNode(this,n );
    var node = this;
    var name = n.name;
    var query = n.query;
    var in_var = n.in;
    var HEREConfigNode;
    var apiKey;
    const axios = require('axios');

    // Retrieve the config node
    HEREConfigNode = RED.nodes.getNode(n.apikey);
    apiKey = HEREConfigNode.credentials.apikey;

    node.on('input', function (msg) {

      msg.hereparams = msg.hereparams || {};

      //query, required parameter
      if( typeof msg.hereparams.query == 'undefined' ) {
        msg.hereparams.query = query; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.query = msg.hereparams.query.toLowerCase();
      }
      // saving the api call in api_str variable
      var api_str='https://geocode.search.hereapi.com/v1/geocode?q='+msg.hereparams.query+'&apiKey='+apiKey;

      //in, optional parameter
      if( typeof msg.hereparams.in_var == 'undefined' ) {
        msg.hereparams.in_var = in_var; // take the default or the node setting
      } else {
        // passed in param, override default or node setting
        msg.hereparams.in_var = msg.hereparams.in_var;
      }
      
      //Add the optional parameters to the api call if they are not empty
      if(msg.hereparams.in_var!=""){
        api_str=api_str+'&in=countryCode:'+msg.hereparams.in_var;
      }

      (async () => {
        try {
          const response = await axios.get(api_str);
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
