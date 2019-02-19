import {
  ERROR_INVALID_RETURN,
  ERROR_MISSING_APP_CONFIG,
  ERROR_MISSING_CLIENT_INFORMATION,
} from './errors';
import {EVENTS_TYPES, REQUEST_TYPES} from './types';
import CoreBridge, {exportToGlobal} from './core';
import {ENDPOINTS} from './config';

class QuantaSDK extends CoreBridge {
  constructor(config, callback) {
    super();
    if (!config || !config.appId || !config.appClientSecret) {
      throw ERROR_MISSING_APP_CONFIG;
    }
    // Variable
    console.log('init App');
    this.config = config;
    this.callback = callback;
    this.requests = {};
    this.postMessage = null;
    this.user = {};

    // Events
    this.onResponse = null;

    this.initial(config, callback);
  }
  parseUserInformation() {
    // eslint-disable-next-line
    const params = new URLSearchParams(this.bridge.location.search);
    // Iterate the search parameters.
    this.user.clientId = params.get('client_id');

    if (!this.user.clientId) {
      throw ERROR_MISSING_CLIENT_INFORMATION;
    }
    this.user.token = params.get('token');
    return this.user;
  }
  // Check if user login
  async checkAuthentication(clientId, token) {
    try {
      const result = await this.fetch(
        `${
          ENDPOINTS.checkAuthentication
        }?access_token=${token}&client_id=${clientId}`,
      );
      if (result && result.status === 'success') {
        return result;
      }
      throw ERROR_INVALID_RETURN;
    } catch (err) {
      return false;
    }
  }
  // TODO: should exchange userId and appClientSecret to temporary key
  async initial(config, callback) {
    this.parseUserInformation();
    // TODO: fetch with server to validate appId and appClientSecret
    // Check user authentication
    if (this.user && this.user.token && this.user.clientId) {
      const user = await this.checkAuthentication(
        this.user.clientId,
        this.user.token,
      );
      if (user) {
        this.user.isAuthentication = true;
        this.user.authenticationData = user;
      }
    } else {
      this.user.isAuthentication = false;
    }
    this.bridge.instanceQuantaSDK = this;
    // Start watcher
    this.responseWatcher();
    // SDK loaded
    if (callback) {
      callback(this);
    }
  }
  request(type, data) {
    const uid = this.generateUid();
    const message = {
      uid,
      ...data,
    };
    this.requests[uid] = {
      ...message,
      onResponse: null,
    };
    switch (type) {
      default:
        this.sendMessage(message);
    }
    return this.generateObserver(uid);
  }
  on(type, callback) {
    switch (type) {
      case EVENTS_TYPES.RESPONSE:
        this.onResponse = callback;
    }
  }
  // First params isSuccess, sencond is data
  responseWatcher() {
    this.onMessage((success, data) => {
      this.onResponse && this.onResponse(success, data);
      if (this.requests[data.uid] && this.requests[data.uid].onResponse) {
        this.requests[data.uid].onResponse(success, data);
      }
      delete this.requests[data.uid];
    });
  }
  // Observer specific request
  generateObserver(uid) {
    const item = this.requests[uid];
    return function(callback) {
      item.onResponse = callback;
    };
  }
  generateUid() {
    const time = new Date().getTime();
    return +time.toString(16);
  }
}
// Export at global platform
exportToGlobal('QuantaSDK', QuantaSDK);
exportToGlobal('QuantaRequestTypes', REQUEST_TYPES);

export {QuantaSDK, REQUEST_TYPES, EVENTS_TYPES};
