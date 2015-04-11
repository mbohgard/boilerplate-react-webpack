var api = 'http://127.0.0.1:5151/api/service';
var allOptions = require('file!../dummy-getAllOptions.json');

var Reflux = require('reflux');
var request = require('superagent');
var _ = require ('lodash');
var merge = require('deepmerge');

var constants = require('../constants');
var AppActions = require('../actions/actions.js');

var AppStore = Reflux.createStore({
  listenables: [AppActions],

  data: {
    services: [],           // services list
    options: [],            // options list with games, platforms, locations etc (from dummy-getAllOptions.json)
    addingService: false,   // bool to show/hide add service forms
    addedServices: [],      // client added services
    loading: false,         // loading bool when doing ajax requests
    error: false,           // error code from ajax
    errorMessage: null      // error message from ajax
  },

  /**
   * function to be run on initialization
   * @return undefined
   */
  init: function () {
    // get both services and options on init
    this.onGetAll();
  },

  /**
   * to be run before api call
   * set loading mode, reset errors, triggers update
   * @return undefined
   */
  initAPICall: function () {
    this.data.loading = true;
    this.data.error = false;
    this.data.errorMessage = null;
    
    this.trigger(this.data);
  },

  /**
   * executed after api call
   * disable loading mode, triggers update
   * @param  {Object} error    [error response from api]
   * @param  {Object} response [response from api]
   * @return undefined
   */
  endAPICall: function (error, response) {
    this.data.loading = false;
    this.trigger(this.data);

    // log error and/or response
    console.log(error ? error : 'no error', response ? response : 'no response');
  },

  getInitialState: function () {
    return this.data;
  },

  /**
   * get all services and options
   * triggers onGetAllOptions after successful response
   * @param  {Function} componentCallback [callback function from component]
   * @return undefined
   */
  onGetAll: function (componentCallback) {
    var responseText;

    this.initAPICall();

    request.get(api, function (error, response) {
      var responseText = JSON.parse(response.text);

      if (error) {
        this.data.loading = false;
        this.data.error = error.status;
        this.data.errorMessage = responseText.message;
        this.trigger(this.data);
      } else {
        this.data.services = responseText;
        this.onGetAllOptions(componentCallback);
      }
      
    }.bind(this));
  },

  /**
   * get all options, currently from local dummy-getAllOptions.json
   * @param  {Function} componentCallback [callback function from component]
   * @return undefined
   */
  onGetAllOptions: function (componentCallback) {
    request.get(allOptions, function (error, response) {
      if (error) {
        this.data.error = true;
        this.data.errorMessage = "Something went wrong with local options JSON";
      } else {
        this.data.options = JSON.parse(response.text);
      }

      this.endAPICall(error, response);
    }.bind(this));
  },

  /**
   * toggle forms for "add new service"
   * @return undefined
   */
  onToggleNewService: function () {
    this.data.addingService = !this.data.addingService;

    this.trigger(this.data);
  },

  
  /**
   * add new client side service
   * no api call since api doesn't support service creation without placement(s)
   * @param  {Object} data [forms data]
   * @return undefined
   */
  onAddService: function (data) {
    var service = {
      "status": "inactive",
      "placement": {},
      "platform": _.invert(constants.identifiers)[data.platform],
      "game": _.invert(constants.identifiers)[data.game],
      "version": data.version,
      "hosts": {},
      "id": "temp-" + new Date().getTime(),
      "client": true // client side key
    }

    this.data.addedServices.unshift(service);

    this.trigger(this.data);
  },

  /**
   * get single service from api
   * @param  {String}   id                [id of service to get]
   * @param  {Function} componentCallback [callback function from component]
   * @param  {Boolean}  pollingCall       [true if call is made on interval (over and over...)]
   * @return undefined
   */
  onGetService: function (id, componentCallback, pollingCall) {
    var responseText, services;

    // set loading=true only if call is not polled
    if (!pollingCall) this.initAPICall();

    request.get(api + '/' + id, function (error, response) {
      responseText = JSON.parse(response.text);

      services = this.data.services.map(function (service) {
        if(service.id === id) {
          // replace existing service with new response
          service = responseText;
        }
        return service;
      });

      this.data.services = services;

      this.endAPICall(error, response);
    }.bind(this));
  },

  /**
   * generate placement object for service creation
   * @param  {Object} data [forms data]
   * @return {Object}      [placement object]
   */
  getPlacementObject: function (data) {
    var provider = _.invert(constants.identifiers)[data.provider],
        location = _.invert(constants.identifiers)[data.location],
        placement = {},
        hosts = parseInt(data.hosts, 10);

    placement[provider] = {};
    placement[provider][location] = hosts;

    return placement;
  },

  /**
   * generate json for service creation
   * @param  {Object} data [forms data]
   * @return {Object}      [json object with new service]
   */
  getCreateServiceJSON: function (data) {
    var service = data.service,
        placement = this.getPlacementObject(data);

    return {
      "game": service.game,
      "platform": service.platform,
      "version": service.version,
      "placement": placement
    };
  },

  /**
   * generate json for service update
   * @param  {Object} data [forms data]
   * @return {Object}      [json object with updated placement]
   */
  getUpdateServiceJSON: function (data) {
    var service = data.service,
        placement = this.getPlacementObject(data),
        pm = merge(service.placement, placement);

    // remove any locations with 0 hosts
    for (var p in pm) {
      for (var l in pm[p]) {
        if (pm[p][l] === 0) delete pm[p][l];
      }
    }

    return {
      "placement": pm
    }
  },

  /**
   * create new service through api
   * @param  {Object}   data              [forms data]
   * @param  {Function} componentCallback [callback function from component]
   * @return undefined
   */
  onCreateService: function (data, componentCallback) {
    var requestData = this.getCreateServiceJSON(data),
        responseText, addedServices;

    this.initAPICall();

    request.post(api)
      .send(requestData)
      .end(function (error, response) {
        responseText = JSON.parse(response.text);

        if (error) {
          this.data.error = error.status;
          this.data.errorMessage = responseText.message;
        } else {
          // add service to services list
          this.data.services.push(responseText);
          
          // remove from client added services list
          addedServices = this.data.addedServices.filter(function (service) {
            return data.service.id !== service.id;
          });

          this.data.addedServices = addedServices;
        }

        if (componentCallback) componentCallback(responseText);

        this.endAPICall(error, response);        
      }.bind(this)
    );
  },

  /**
   * update a service (send new placement info)
   * @param  {Object}   data              [forms data]
   * @param  {Function} componentCallback [callback function from component]
   * @return undefined
   */
  onUpdateService: function (data, componentCallback) {
    var id = data.service.id,
        requestData = this.getUpdateServiceJSON(data),
        responseText, services,
        hasPlacement = JSON.stringify(requestData).match(/\d+/);

    // if json has no placements, delete service instead
    if (!hasPlacement) {
      this.onDeleteService(id);
      return;
    }

    this.initAPICall();

    request.put(api + '/' + id)
      .send(requestData)
      .end(function (error, response) {
        responseText = JSON.parse(response.text);

        if (error) {
          this.data.error = error.status;
          this.data.errorMessage = responseText.message;
        } else {
          // find service and replace it with new response
          services = this.data.services.map(function (service) {
            if (service.id === id) {
              service = responseText;
            }

            return service;
          });
          
          this.data.services = services;
        }

        if (componentCallback) componentCallback(error);

        this.endAPICall(error, response);
      }.bind(this)
    );
  
  },

  /**
   * delete a service
   * @param  {String} id [id of service to delete]
   * @return undefined
   */
  onDeleteService: function (id) {
    var addedServices = this.data.addedServices,
        services;

    this.initAPICall();

    // if service is client added, just remove from addedServices list
    for (var i = 0; i < addedServices.length; i++) {
      if (addedServices[i].id === id) {
        addedServices.splice(i, 1);
        this.endAPICall();
        return;
      }
    }

    request.del(api + '/' + id)
      .end(function (error, response) {

        if (error) {
          this.data.error = error.status;
          this.data.errorMessage = JSON.parse(response.text).message;
        } else if (response.status === 204) {
          services = this.data.services.filter(function (service) {
            return service.id !== id;
          });

          // replace services with all but deleted service
          this.data.services = services;
        }

        this.endAPICall(error, response);
        
      }.bind(this)
    );
  },

  /**
   * clear error status & message
   * @return undefined
   */
  onClearError: function () {
    this.data.error = false;
    this.data.errorMessage = null;

    this.trigger(this.data);
  }

});

module.exports = AppStore;