'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.exportToGlobal = exportToGlobal;

var _config = require('./config');

var _errors = require('./errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line
var globalInstance = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : Function('return this')();

function exportToGlobal(key, value) {
  globalInstance[key] = value;
}
// TODO: Using web at core bridge

var CoreBridge = function () {
  function CoreBridge() {
    _classCallCheck(this, CoreBridge);

    this.bridge = globalInstance;
    this.instanceOnMessage = null;
    this.defaultOption = {
      method: 'get'
    };
  }

  _createClass(CoreBridge, [{
    key: 'sendMessage',
    value: function sendMessage(message) {
      this.bridge.postMessage(JSON.stringify(message), '*');
    }
  }, {
    key: 'onMessage',
    value: function onMessage(_onMessage) {
      if (this.instanceOnMessage) {
        this.bridge.removeEventListener('message', this.instanceOnMessage);
        this.instanceOnMessage = null;
      }
      this.instanceOnMessage = this.bridge.addEventListener('message', function (e) {
        try {
          var data = JSON.parse(e.data);
          if (data) {
            _onMessage(true, data);
          }
          _onMessage(false, 'Invalid return');
        } catch (e) {
          _onMessage(null, e.message);
          /* handle error */
        }
      });
    }
  }, {
    key: 'appendFetchOption',
    value: function appendFetchOption(option) {
      this.defaultOption = _extends({}, this.defaultOption, option);
    }
  }, {
    key: 'fetch',
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function (url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return Promise.race([
      // eslint-disable-next-line
      fetch(url, _extends({}, this.defaultOption, {
        options: options
      })).then(function (res) {
        return res.json();
      }), new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(_errors.ERROR_FETCH_TIMEOUT);
        }, _config.TIMEOUT);
      })]);
    })
  }]);

  return CoreBridge;
}();

exports.default = CoreBridge;