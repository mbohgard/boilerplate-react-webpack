var Reflux = require('reflux');

module.exports = Reflux.createActions([
    "getAll"                // get all services
  , "getAllOptions"         // get all providers and locations (from dummy json)
  , "getService"            // get a single service
  , "createService"         // create new service with placement
  , "updateService"         // update existing service
  , "deleteService"         // kill service

  , "toggleNewService"      // toggle new service forms
  , "addService"            // add service, client only, api call

  , "clearError"            // clear errors
]);