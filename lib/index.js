'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENTS_TYPES = exports.REQUEST_TYPES = exports.QuantaSDK = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var _types = require('./types');

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QuantaSDK = function (_CoreBridge) {
  _inherits(QuantaSDK, _CoreBridge);

  function QuantaSDK(config) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { global: true };

    _classCallCheck(this, QuantaSDK);

    var _this = _possibleConstructorReturn(this, (QuantaSDK.__proto__ || Object.getPrototypeOf(QuantaSDK)).call(this));

    if (!config || !config.appId || !config.appClientSecret) {
      throw _errors.ERROR_MISSING_APP_CONFIG;
    }
    // Variable
    _this.config = config;
    _this.options = options;
    _this.requests = {};
    _this.postMessage = null;
    _this.user = {};

    // Events
    _this.onResponse = null;

    _this.initial(config, options);
    return _this;
  }

  _createClass(QuantaSDK, [{
    key: 'parseUserInformation',
    value: function parseUserInformation() {
      // eslint-disable-next-line
      var params = new URLSearchParams(this.bridge.location.search);
      // Iterate the search parameters.
      this.user.clientId = params.get('client_id');

      if (!this.user.clientId) {
        throw _errors.ERROR_MISSING_CLIENT_INFORMATION;
      }
      this.user.token = params.get('token');
      return this.user;
    }
    // Check if user login

  }, {
    key: 'checkAuthentication',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(clientId, token) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.fetch(_config.ENDPOINTS.checkAuthentication + '?access_token=' + token + '&client_id=' + clientId);

              case 3:
                result = _context.sent;

                if (!(result && result.status === 'success')) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', result);

              case 6:
                throw _errors.ERROR_INVALID_RETURN;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);
                return _context.abrupt('return', false);

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function checkAuthentication(_x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return checkAuthentication;
    }()
    // TODO: should exchange userId and appClientSecret to temporary key

  }, {
    key: 'initial',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config, options) {
        var user;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.parseUserInformation();
                // TODO: fetch with server to validate appId and appClientSecret
                // Check user authentication

                if (!(this.user && this.user.token && this.user.clientId)) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 4;
                return this.checkAuthentication(this.user.clientId, this.user.token);

              case 4:
                user = _context2.sent;

                if (user) {
                  this.user.isAuthentication = true;
                  this.user.authenticationData = user;
                }

              case 6:
                if (options.global) {
                  this.bridge.instanceQuantaSDK = this;
                }
                // Start watcher
                this.responseWatcher();
                // SDK loaded
                if (options.onLoaded && typeof options.onLoaded === 'function') {
                  options.onLoaded(this);
                }

              case 9:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initial(_x4, _x5) {
        return _ref2.apply(this, arguments);
      }

      return initial;
    }()
  }, {
    key: 'request',
    value: function request(type, data) {
      var uid = this.generateUid();
      var message = _extends({
        uid: uid
      }, data);
      this.requests[uid] = _extends({}, message, {
        onResponse: null
      });
      switch (type) {
        default:
          this.sendMessage(message);
      }
      return this.generateObserver(uid);
    }
  }, {
    key: 'on',
    value: function on(type, callback) {
      switch (type) {
        case _types.EVENTS_TYPES.RESPONSE:
          this.onResponse = callback;
      }
    }
    // First params isSuccess, sencond is data

  }, {
    key: 'responseWatcher',
    value: function responseWatcher() {
      var _this2 = this;

      this.onMessage(function (success, data) {
        _this2.onResponse && _this2.onResponse(success, data);
        if (_this2.requests[data.uid] && _this2.requests[data.uid].onResponse) {
          _this2.requests[data.uid].onResponse(success, data);
        }
        delete _this2.requests[data.uid];
      });
    }
    // Observer specific request

  }, {
    key: 'generateObserver',
    value: function generateObserver(uid) {
      var item = this.requests[uid];
      return function (callback) {
        item.onResponse = callback;
      };
    }
  }, {
    key: 'generateUid',
    value: function generateUid() {
      var time = new Date().getTime();
      return +time.toString(16);
    }
  }]);

  return QuantaSDK;
}(_core2.default);
// Export at global platform


(0, _core.exportToGlobal)('QuantaSDK', QuantaSDK);
(0, _core.exportToGlobal)('QuantaRequestTypes', _types.REQUEST_TYPES);

exports.QuantaSDK = QuantaSDK;
exports.REQUEST_TYPES = _types.REQUEST_TYPES;
exports.EVENTS_TYPES = _types.EVENTS_TYPES;