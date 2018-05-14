var SizeSnapper = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /*           _.-~-.
             7''  Q..\
          _7         (_
        _7  _/    _q.  /
      _7 . ___  /VVvv-'_                                            .
     7/ / /~- \_\\      '-._     .-'                      /       //
    ./ ( /-~-/  ||'=.__  '::. '-~'' {             ___   /  //     ./{
   V   V-~-~|   ||   __''_   ':::.   ''~-~.___.-'' _/  // / {_   /  {  /
    VV/-~-~-|  / \ .'__'. '.  '::  ____               _ _ _        ''.
    / /~~~~||  VVV/ /  \ )  \     |  _ \ ___  ___(_)___(_) | | __ _   .::'
   / (~-~-~\\.-' /    \'   \::::. | |_) / _ \/ __| |_  / | | |/ _` | :::'
  /..\    /..\__/      '     '::: |  _ <  __/\__ \ |/ /| | | | (_| | ::'
  vVVv    vVVv                 ': |_| \_\___||___/_/___|_|_|_|\__,_| ''
  */
  /*
   Version: 0.9.2
   Description: A Better Window Resize
   Author: Julien Etienne
   Repository: https://github.com/julienetie/resizilla
  */

  /**
   * request-frame-modern - Optimal requestAnimationFrame & cancelAnimationFrame polyfill for modern development
   * @version v2.0.3
   * @license MIT
   * Copyright Julien Etienne 2015 All Rights Reserved.
   */
  // Initial time of the timing lapse.
  var previousTime = 0;

  /**
   * Native clearTimeout function for IE-9 cancelAnimationFrame
   * @return {Function}
   */
  var clearTimeoutWithId = function clearTimeoutWithId(id) {
      window.clearTimeout(id);
      id = null;
  };

  /**
   * IE-9 Polyfill for requestAnimationFrame
   * @callback {Number} Timestamp.
   * @return {Function} setTimeout Function.
   */
  function setTimeoutWithTimestamp(callback) {
      var immediateTime = Date.now();
      var lapsedTime = Math.max(previousTime + 16, immediateTime);
      return setTimeout(function () {
          callback(previousTime = lapsedTime);
      }, lapsedTime - immediateTime);
  }

  // Request and cancel functions for IE9+ & modern mobile browsers. 
  var requestFrameFn = window.requestAnimationFrame || setTimeoutWithTimestamp;
  var cancelFrameFn = window.cancelAnimationFrame || clearTimeoutWithId;

  /**
   *  volve - Tiny, Performant Debounce and Throttle Functions,
   *     License:  MIT
   *      Copyright Julien Etienne 2016 All Rights Reserved.
   *        github:  https://github.com/julienetie/volve
   *‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
   */

  /**
   * Date.now polyfill.
   * {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/now}
   */
  if (!Date.now) {
      Date.now = function now() {
          return new Date().getTime();
      };
  }

  /**
   * Debounce a function call during repetiton.
   * @param {Function}  callback - Callback function.
   * @param {Number}    delay    - Delay in milliseconds.
   * @param {Boolean}   lead  - Leading or trailing.
   * @return {Function} - The debounce function. 
   */
  function debounce(callback, delay, lead) {
      var debounceRange = 0;
      var currentTime;
      var timeoutId;

      var call = function call(parameters) {
          callback(parameters);
      };

      return function (parameters) {
          if (lead) {
              currentTime = Date.now();
              if (currentTime > debounceRange) {
                  callback(parameters);
              }
              debounceRange = currentTime + delay;
          } else {
              /**
               * setTimeout is only used with the trail option.
               */
              clearTimeout(timeoutId);
              timeoutId = setTimeout(function () {
                  call(parameters);
              }, delay);
          }
      };
  }

  var objectAssignPolyfill = function objectAssignPolyfill() {
      if (typeof Object.assign != 'function') {
          (function () {
              Object.assign = function (target) {
                  // We must check against these specific cases.

                  if (target === undefined || target === null) {
                      throw new TypeError('Cannot convert undefined or null to object');
                  }

                  var output = Object(target);
                  for (var index = 1; index < arguments.length; index++) {
                      var source = arguments[index];
                      if (source !== undefined && source !== null) {
                          for (var nextKey in source) {
                              if (source.hasOwnProperty(nextKey)) {
                                  output[nextKey] = source[nextKey];
                              }
                          }
                      }
                  }
                  return output;
              };
          })();
      }
  };

  // Add the Object.assign polyfill.
  objectAssignPolyfill();

  // Obtains the window or global according to the environment.
  var windowGlobal = typeof window !== 'undefined' ? window : (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.self === self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global.global === global && global;

  // A list of option names to make naming and renaming simple.
  var optionNames = 'handler,delay,incept,useCapture,orientationchange'.split(',');

  // Default options that correspond with the optionNames.
  var defaults$1 = [function () {}, 16, false, false, true];

  /** 
   * Each option name is paired with the option value
   * @return {Object}
   */
  var convertPairsToLiterals = function convertPairsToLiterals(value, i) {
      return defineProperty({}, optionNames[i], value);
  };

  /** 
   * Adds the window event with the provided options.
   * Returns the same handler for removeEventListeners.
   * @return {Function}
   */
  var addWindowEvent = function addWindowEvent(handler, delay, incept, windowObject, useCapture) {
      var debounced = debounce(handler, delay, incept);
      windowObject.addEventListener('resize', debounced, useCapture);
      return debounced;
  };

  var destroyPartial = function destroyPartial(directHandler, useCapture, windowObject) {
      var destroyAPI = function destroyAPI(type) {
          if (!type || type === 'all') {
              // Remove both event listeners.
              windowObject.removeEventListener('resize', directHandler, useCapture);
              windowObject.removeEventListener('orientationchange', directHandler, useCapture);
          } else {
              // Remove specific event listener.
              windowObject.removeEventListener(type, directHandler, useCapture);
          }
      };
      return destroyAPI;
  };

  /** 
   * Partially apply variables as defaults
   * @param {Array} defaults - Array of consecutive defaults.
   * @param {object} windowObject -  The window | global object.
   */
  var resizillaPartial = function resizillaPartial(defaults$$1, windowObject) {

      /** 
       * The API
       * @param {Function} handler - The callback to execute on resize
       * @param {Number} delay - Debounce delay in milliseconds
       * @param {Boolean} incept - Debounce style
       * @param {Boolean} useCapture - Bubbling/ capture options for events
       * @param {Boolean} orientationChange - respond on orientation change
       */
      return function resizillaFinal() {
          for (var _len = arguments.length, APIParameters = Array(_len), _key = 0; _key < _len; _key++) {
              APIParameters[_key] = arguments[_key];
          }

          // The unchosen excess defaults.
          var excessDefaults = defaults$$1.slice(APIParameters.length, defaults$$1.length);

          // Concatenate the API options with the excess defaults.
          var optionValues = [].concat(APIParameters, toConsumableArray(excessDefaults));

          // Final options as an object.
          var mergedOptions = Object.assign.apply(Object, toConsumableArray(optionValues.map(convertPairsToLiterals)));

          // Destructured options.
          var handler = mergedOptions.handler,
              delay = mergedOptions.delay,
              incept = mergedOptions.incept,
              useCapture = mergedOptions.useCapture,
              orientationChange = mergedOptions.orientationChange;

          // A direct reference to the added handler.

          var directHandler = addWindowEvent(handler, delay, incept, windowObject, useCapture);

          // Adds orientationchange event if required.
          if (orientationChange) {
              windowObject.addEventListener('orientationchange', directHandler, useCapture);
          }

          // Returns an destroyAPI method to remove event listeners.
          return {
              destroy: destroyPartial(directHandler, useCapture, windowObject)
          };
      };
  };

  // Creates the Resizilla function.
  var resizilla = resizillaPartial(defaults$1, windowGlobal);

  // require('resizilla')

  var SizeSnapper = function () {
      function SizeSnapper(config) {
          classCallCheck(this, SizeSnapper);


          this.portionWidth = 342;
          this.initialSize = -2;
          this.timeout = 15;

          // state
          this.currentScale = 0;
          this.currentWidth = 0;

          // override
          if (config != null) {
              if (config.portionWidth != null && typeof config.portionWidth == "number") {
                  this.portionWidth = config.portionWidth;
              }
              if (config.initialSize != null && typeof config.initialSize == "number") {
                  this.initialSize = config.initialSize;
              }
              if (config.timeout != null && typeof config.timeout == "number") {
                  this.timeout = config.timeout;
              }
          }

          this.halfPortionWidth = Math.floor(this.portionWidth / 2);
          this.checkViewport();

          resizilla(this.snapSize.bind(this), this.timeout, false, false, true);

          setTimeout(this.snapSize.bind(this), this.timeout);

          this.onSnapSize = function () {};
      }

      createClass(SizeSnapper, [{
          key: "checkViewport",
          value: function checkViewport() {
              this.viewportElm = document.head.querySelector("meta[name=viewport]");
              if (this.viewportElm == null) {
                  this.viewportElm = this.createViewportMeta();
              }
          }
      }, {
          key: "createViewportMeta",
          value: function createViewportMeta() {
              var meta = document.createElement("meta");
              meta.setAttribute("name", "viewport");
              meta.setAttribute("content", "width=device-width");
              document.head.appendChild(meta);
              return meta;
          }
      }, {
          key: "applyScaleToMetaViewport",
          value: function applyScaleToMetaViewport() {
              this.checkViewport();
              var contentStr = "width=device-width";
              contentStr += ", minimum-scale=" + this.currentScale;
              contentStr += ", maximum-scale=" + this.currentScale;
              contentStr += ", user-scalable=no";
              this.viewportElm.setAttribute("content", contentStr);
          }
      }, {
          key: "updateScale",
          value: function updateScale(windowWidth) {
              if (windowWidth < this.halfPortionWidth) {
                  windowWidth = this.halfPortionWidth;
              }
              // let offset = (windowWidth - this.initialSize - this.halfPortionWidth) % this.portionWidth - this.halfPortionWidth;
              this.currentWidth = Math.ceil(windowWidth / this.portionWidth) * this.portionWidth + this.initialSize;
              this.currentScale = windowWidth / this.currentWidth;
              console.log(windowWidth, this.currentWidth, this.currentScale);
          }
      }, {
          key: "snapSize",
          value: function snapSize() {
              this.updateScale(window.outerWidth);
              this.applyScaleToMetaViewport();
              this.onSnapSize();
          }
      }]);
      return SizeSnapper;
  }();

  return SizeSnapper;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS1zbmFwcGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Eb2N1bWVudHMvUmVwb3NpdG9yaWVzL3NpemUtc25hcHBlci9ub2RlX21vZHVsZXMvcmVzaXppbGxhL2Rpc3QvcmVzaXppbGxhLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qICAgICAgICAgICBfLi1+LS5cbiAgICAgICAgICAgNycnICBRLi5cXFxuICAgICAgICBfNyAgICAgICAgIChfXG4gICAgICBfNyAgXy8gICAgX3EuICAvXG4gICAgXzcgLiBfX18gIC9WVnZ2LSdfICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuXG4gICA3LyAvIC9+LSBcXF9cXFxcICAgICAgJy0uXyAgICAgLi0nICAgICAgICAgICAgICAgICAgICAgIC8gICAgICAgLy9cbiAgLi8gKCAvLX4tLyAgfHwnPS5fXyAgJzo6LiAnLX4nJyB7ICAgICAgICAgICAgIF9fXyAgIC8gIC8vICAgICAuL3tcbiBWICAgVi1+LX58ICAgfHwgICBfXycnXyAgICc6OjouICAgJyd+LX4uX19fLi0nJyBfLyAgLy8gLyB7XyAgIC8gIHsgIC9cbiAgVlYvLX4tfi18ICAvIFxcIC4nX18nLiAnLiAgJzo6ICBfX19fICAgICAgICAgICAgICAgXyBfIF8gICAgICAgICcnLlxuICAvIC9+fn5+fHwgIFZWVi8gLyAgXFwgKSAgXFwgICAgIHwgIF8gXFwgX19fICBfX18oXylfX18oXykgfCB8IF9fIF8gICAuOjonXG4gLyAofi1+LX5cXFxcLi0nIC8gICAgXFwnICAgXFw6Ojo6LiB8IHxfKSAvIF8gXFwvIF9ffCB8XyAgLyB8IHwgfC8gX2AgfCA6OjonXG4vLi5cXCAgICAvLi5cXF9fLyAgICAgICcgICAgICc6OjogfCAgXyA8ICBfXy9cXF9fIFxcIHwvIC98IHwgfCB8IChffCB8IDo6J1xudlZWdiAgICB2VlZ2ICAgICAgICAgICAgICAgICAnOiB8X3wgXFxfXFxfX198fF9fXy9fL19fX3xffF98X3xcXF9fLF98ICcnXG4qL1xuLypcbiBWZXJzaW9uOiAwLjkuMlxuIERlc2NyaXB0aW9uOiBBIEJldHRlciBXaW5kb3cgUmVzaXplXG4gQXV0aG9yOiBKdWxpZW4gRXRpZW5uZVxuIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9qdWxpZW5ldGllL3Jlc2l6aWxsYVxuKi9cblxuLyoqXG4gKiByZXF1ZXN0LWZyYW1lLW1vZGVybiAtIE9wdGltYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICYgY2FuY2VsQW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgZm9yIG1vZGVybiBkZXZlbG9wbWVudFxuICogQHZlcnNpb24gdjIuMC4zXG4gKiBAbGljZW5zZSBNSVRcbiAqIENvcHlyaWdodCBKdWxpZW4gRXRpZW5uZSAyMDE1IEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cbi8vIEluaXRpYWwgdGltZSBvZiB0aGUgdGltaW5nIGxhcHNlLlxudmFyIHByZXZpb3VzVGltZSA9IDA7XG5cbi8qKlxuICogTmF0aXZlIGNsZWFyVGltZW91dCBmdW5jdGlvbiBmb3IgSUUtOSBjYW5jZWxBbmltYXRpb25GcmFtZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGNsZWFyVGltZW91dFdpdGhJZCA9IGlkID0+IHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTtcbiAgICBpZCA9IG51bGw7XG59O1xuXG4vKipcbiAqIElFLTkgUG9seWZpbGwgZm9yIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICogQGNhbGxiYWNrIHtOdW1iZXJ9IFRpbWVzdGFtcC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBzZXRUaW1lb3V0IEZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0V2l0aFRpbWVzdGFtcChjYWxsYmFjaykge1xuICAgIGNvbnN0IGltbWVkaWF0ZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGxldCBsYXBzZWRUaW1lID0gTWF0aC5tYXgocHJldmlvdXNUaW1lICsgMTYsIGltbWVkaWF0ZVRpbWUpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2socHJldmlvdXNUaW1lID0gbGFwc2VkVGltZSk7XG4gICAgfSwgbGFwc2VkVGltZSAtIGltbWVkaWF0ZVRpbWUpO1xufVxuXG4vLyBSZXF1ZXN0IGFuZCBjYW5jZWwgZnVuY3Rpb25zIGZvciBJRTkrICYgbW9kZXJuIG1vYmlsZSBicm93c2Vycy4gXG5jb25zdCByZXF1ZXN0RnJhbWVGbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgc2V0VGltZW91dFdpdGhUaW1lc3RhbXA7XG5jb25zdCBjYW5jZWxGcmFtZUZuID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IGNsZWFyVGltZW91dFdpdGhJZDtcblxuLyoqXG4gKiBTZXQgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSAmIGNhbmNlbEFuaW1hdGlvbkZyYW1lIHdpbmRvdyBmdW5jdGlvbnMuXG4gKi9cbmNvbnN0IHNldE5hdGl2ZUZuID0gKHJlcXVlc3RGbiwgY2FuY2VsRm4sIHdpbk9iaikgPT4ge1xuICAgIHdpbk9iai5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0Rm47XG4gICAgd2luT2JqLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsRm47XG59O1xuXG4vKipcbiAqICB2b2x2ZSAtIFRpbnksIFBlcmZvcm1hbnQgRGVib3VuY2UgYW5kIFRocm90dGxlIEZ1bmN0aW9ucyxcbiAqICAgICBMaWNlbnNlOiAgTUlUXG4gKiAgICAgIENvcHlyaWdodCBKdWxpZW4gRXRpZW5uZSAyMDE2IEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiAgICAgICAgZ2l0aHViOiAgaHR0cHM6Ly9naXRodWIuY29tL2p1bGllbmV0aWUvdm9sdmVcbiAq4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+XG4gKi9cblxuLyoqXG4gKiBEYXRlLm5vdyBwb2x5ZmlsbC5cbiAqIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlL25vd31cbiAqL1xuaWYgKCFEYXRlLm5vdykge1xuICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBEZWJvdW5jZSBhIGZ1bmN0aW9uIGNhbGwgZHVyaW5nIHJlcGV0aXRvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtOdW1iZXJ9ICAgIGRlbGF5ICAgIC0gRGVsYXkgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtCb29sZWFufSAgIGxlYWQgIC0gTGVhZGluZyBvciB0cmFpbGluZy5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIFRoZSBkZWJvdW5jZSBmdW5jdGlvbi4gXG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGNhbGxiYWNrLCBkZWxheSwgbGVhZCkge1xuICAgIHZhciBkZWJvdW5jZVJhbmdlID0gMDtcbiAgICB2YXIgY3VycmVudFRpbWU7XG4gICAgdmFyIGxhc3RDYWxsO1xuICAgIHZhciBzZXREZWxheTtcbiAgICB2YXIgdGltZW91dElkO1xuXG4gICAgY29uc3QgY2FsbCA9IHBhcmFtZXRlcnMgPT4ge1xuICAgICAgICBjYWxsYmFjayhwYXJhbWV0ZXJzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBhcmFtZXRlcnMgPT4ge1xuICAgICAgICBpZiAobGVhZCkge1xuICAgICAgICAgICAgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lID4gZGVib3VuY2VSYW5nZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVib3VuY2VSYW5nZSA9IGN1cnJlbnRUaW1lICsgZGVsYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHNldFRpbWVvdXQgaXMgb25seSB1c2VkIHdpdGggdGhlIHRyYWlsIG9wdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuY29uc3Qgb2JqZWN0QXNzaWduUG9seWZpbGwgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBPYmplY3QuYXNzaWduICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgICAgIC8vIFdlIG11c3QgY2hlY2sgYWdhaW5zdCB0aGVzZSBzcGVjaWZpYyBjYXNlcy5cblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkobmV4dEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG59O1xuXG4vLyBBZGQgdGhlIE9iamVjdC5hc3NpZ24gcG9seWZpbGwuXG5vYmplY3RBc3NpZ25Qb2x5ZmlsbCgpO1xuXG4vLyBPYnRhaW5zIHRoZSB3aW5kb3cgb3IgZ2xvYmFsIGFjY29yZGluZyB0byB0aGUgZW52aXJvbm1lbnQuXG5jb25zdCB3aW5kb3dHbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fCB0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsO1xuXG4vLyBBIGxpc3Qgb2Ygb3B0aW9uIG5hbWVzIHRvIG1ha2UgbmFtaW5nIGFuZCByZW5hbWluZyBzaW1wbGUuXG5jb25zdCBvcHRpb25OYW1lcyA9ICdoYW5kbGVyLGRlbGF5LGluY2VwdCx1c2VDYXB0dXJlLG9yaWVudGF0aW9uY2hhbmdlJy5zcGxpdCgnLCcpO1xuXG4vLyBEZWZhdWx0IG9wdGlvbnMgdGhhdCBjb3JyZXNwb25kIHdpdGggdGhlIG9wdGlvbk5hbWVzLlxuY29uc3QgZGVmYXVsdHMgPSBbKCkgPT4ge30sIDE2LCBmYWxzZSwgZmFsc2UsIHRydWVdO1xuXG4vKiogXG4gKiBFYWNoIG9wdGlvbiBuYW1lIGlzIHBhaXJlZCB3aXRoIHRoZSBvcHRpb24gdmFsdWVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuY29uc3QgY29udmVydFBhaXJzVG9MaXRlcmFscyA9ICh2YWx1ZSwgaSkgPT4gKHtcbiAgICBbb3B0aW9uTmFtZXNbaV1dOiB2YWx1ZSB9KTtcblxuLyoqIFxuICogQWRkcyB0aGUgd2luZG93IGV2ZW50IHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMuXG4gKiBSZXR1cm5zIHRoZSBzYW1lIGhhbmRsZXIgZm9yIHJlbW92ZUV2ZW50TGlzdGVuZXJzLlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGFkZFdpbmRvd0V2ZW50ID0gKGhhbmRsZXIsIGRlbGF5LCBpbmNlcHQsIHdpbmRvd09iamVjdCwgdXNlQ2FwdHVyZSkgPT4ge1xuICAgIGNvbnN0IGRlYm91bmNlZCA9IGRlYm91bmNlKGhhbmRsZXIsIGRlbGF5LCBpbmNlcHQpO1xuICAgIHdpbmRvd09iamVjdC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZWQsIHVzZUNhcHR1cmUpO1xuICAgIHJldHVybiBkZWJvdW5jZWQ7XG59O1xuXG5jb25zdCBkZXN0cm95UGFydGlhbCA9IChkaXJlY3RIYW5kbGVyLCB1c2VDYXB0dXJlLCB3aW5kb3dPYmplY3QpID0+IHtcbiAgICBjb25zdCBkZXN0cm95QVBJID0gdHlwZSA9PiB7XG4gICAgICAgIGlmICghdHlwZSB8fCB0eXBlID09PSAnYWxsJykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGJvdGggZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICAgICAgd2luZG93T2JqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRpcmVjdEhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgd2luZG93T2JqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgZGlyZWN0SGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgc3BlY2lmaWMgZXZlbnQgbGlzdGVuZXIuXG4gICAgICAgICAgICB3aW5kb3dPYmplY3QucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBkaXJlY3RIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGRlc3Ryb3lBUEk7XG59O1xuXG4vKiogXG4gKiBQYXJ0aWFsbHkgYXBwbHkgdmFyaWFibGVzIGFzIGRlZmF1bHRzXG4gKiBAcGFyYW0ge0FycmF5fSBkZWZhdWx0cyAtIEFycmF5IG9mIGNvbnNlY3V0aXZlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtvYmplY3R9IHdpbmRvd09iamVjdCAtICBUaGUgd2luZG93IHwgZ2xvYmFsIG9iamVjdC5cbiAqL1xuY29uc3QgcmVzaXppbGxhUGFydGlhbCA9IChkZWZhdWx0cywgd2luZG93T2JqZWN0KSA9PiB7XG5cbiAgICAvKiogXG4gICAgICogVGhlIEFQSVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbiByZXNpemVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgLSBEZWJvdW5jZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluY2VwdCAtIERlYm91bmNlIHN0eWxlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlIC0gQnViYmxpbmcvIGNhcHR1cmUgb3B0aW9ucyBmb3IgZXZlbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcmllbnRhdGlvbkNoYW5nZSAtIHJlc3BvbmQgb24gb3JpZW50YXRpb24gY2hhbmdlXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlc2l6aWxsYUZpbmFsKC4uLkFQSVBhcmFtZXRlcnMpIHtcblxuICAgICAgICAvLyBUaGUgdW5jaG9zZW4gZXhjZXNzIGRlZmF1bHRzLlxuICAgICAgICBjb25zdCBleGNlc3NEZWZhdWx0cyA9IGRlZmF1bHRzLnNsaWNlKEFQSVBhcmFtZXRlcnMubGVuZ3RoLCBkZWZhdWx0cy5sZW5ndGgpO1xuXG4gICAgICAgIC8vIENvbmNhdGVuYXRlIHRoZSBBUEkgb3B0aW9ucyB3aXRoIHRoZSBleGNlc3MgZGVmYXVsdHMuXG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IFsuLi5BUElQYXJhbWV0ZXJzLCAuLi5leGNlc3NEZWZhdWx0c107XG5cbiAgICAgICAgLy8gRmluYWwgb3B0aW9ucyBhcyBhbiBvYmplY3QuXG4gICAgICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKC4uLm9wdGlvblZhbHVlcy5tYXAoY29udmVydFBhaXJzVG9MaXRlcmFscykpO1xuXG4gICAgICAgIC8vIERlc3RydWN0dXJlZCBvcHRpb25zLlxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgICAgZGVsYXksXG4gICAgICAgICAgICBpbmNlcHQsXG4gICAgICAgICAgICB1c2VDYXB0dXJlLFxuICAgICAgICAgICAgb3JpZW50YXRpb25DaGFuZ2VcbiAgICAgICAgfSA9IG1lcmdlZE9wdGlvbnM7XG5cbiAgICAgICAgLy8gQSBkaXJlY3QgcmVmZXJlbmNlIHRvIHRoZSBhZGRlZCBoYW5kbGVyLlxuICAgICAgICBjb25zdCBkaXJlY3RIYW5kbGVyID0gYWRkV2luZG93RXZlbnQoaGFuZGxlciwgZGVsYXksIGluY2VwdCwgd2luZG93T2JqZWN0LCB1c2VDYXB0dXJlKTtcblxuICAgICAgICAvLyBBZGRzIG9yaWVudGF0aW9uY2hhbmdlIGV2ZW50IGlmIHJlcXVpcmVkLlxuICAgICAgICBpZiAob3JpZW50YXRpb25DaGFuZ2UpIHtcbiAgICAgICAgICAgIHdpbmRvd09iamVjdC5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGRpcmVjdEhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJucyBhbiBkZXN0cm95QVBJIG1ldGhvZCB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVBhcnRpYWwoZGlyZWN0SGFuZGxlciwgdXNlQ2FwdHVyZSwgd2luZG93T2JqZWN0KVxuICAgICAgICB9O1xuICAgIH07XG59O1xuXG4vLyBDcmVhdGVzIHRoZSBSZXNpemlsbGEgZnVuY3Rpb24uXG5jb25zdCByZXNpemlsbGEgPSByZXNpemlsbGFQYXJ0aWFsKGRlZmF1bHRzLCB3aW5kb3dHbG9iYWwpO1xuXG5leHBvcnQgZGVmYXVsdCByZXNpemlsbGE7XG4iLCJpbXBvcnQgcmVzaXppbGxhIGZyb20gJ3Jlc2l6aWxsYSc7XHJcbi8vIHJlcXVpcmUoJ3Jlc2l6aWxsYScpXHJcblxyXG5jbGFzcyBTaXplU25hcHBlciB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XHJcblxyXG4gICAgICAgIHRoaXMucG9ydGlvbldpZHRoID0gMzQyO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFNpemUgPSAtMjtcclxuICAgICAgICB0aGlzLnRpbWVvdXQgPSAxNVxyXG5cclxuICAgICAgICAvLyBzdGF0ZVxyXG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gMDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IDA7XHJcblxyXG5cclxuICAgICAgICAvLyBvdmVycmlkZVxyXG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoY29uZmlnLnBvcnRpb25XaWR0aCAhPSBudWxsICYmIHR5cGVvZiBjb25maWcucG9ydGlvbldpZHRoID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucG9ydGlvbldpZHRoID0gY29uZmlnLnBvcnRpb25XaWR0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb25maWcuaW5pdGlhbFNpemUgIT0gbnVsbCAmJiB0eXBlb2YgY29uZmlnLmluaXRpYWxTaXplID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbFNpemUgPSBjb25maWcuaW5pdGlhbFNpemVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLnRpbWVvdXQgIT0gbnVsbCAmJiB0eXBlb2YgY29uZmlnLnRpbWVvdXQgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYWxmUG9ydGlvbldpZHRoID0gTWF0aC5mbG9vcih0aGlzLnBvcnRpb25XaWR0aC8yKTtcclxuICAgICAgICB0aGlzLmNoZWNrVmlld3BvcnQoKTtcclxuXHJcbiAgICAgICAgcmVzaXppbGxhKFxyXG4gICAgICAgICAgICB0aGlzLnNuYXBTaXplLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIHRoaXMudGltZW91dCxcclxuICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICB0cnVlXHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc25hcFNpemUuYmluZCh0aGlzKSx0aGlzLnRpbWVvdXQpXHJcblxyXG4gICAgICAgIHRoaXMub25TbmFwU2l6ZSA9ICgpID0+IHt9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tWaWV3cG9ydCgpIHtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0RWxtID0gZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yKFwibWV0YVtuYW1lPXZpZXdwb3J0XVwiKVxyXG4gICAgICAgIGlmICh0aGlzLnZpZXdwb3J0RWxtID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy52aWV3cG9ydEVsbSA9IHRoaXMuY3JlYXRlVmlld3BvcnRNZXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVZpZXdwb3J0TWV0YSgpIHtcclxuICAgICAgICB2YXIgbWV0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpXHJcbiAgICAgICAgbWV0YS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwidmlld3BvcnRcIilcclxuICAgICAgICBtZXRhLnNldEF0dHJpYnV0ZShcImNvbnRlbnRcIiwgXCJ3aWR0aD1kZXZpY2Utd2lkdGhcIilcclxuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKG1ldGEpXHJcbiAgICAgICAgcmV0dXJuIG1ldGFcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVNjYWxlVG9NZXRhVmlld3BvcnQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja1ZpZXdwb3J0KCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnRTdHIgPSBcIndpZHRoPWRldmljZS13aWR0aFwiO1xyXG4gICAgICAgIGNvbnRlbnRTdHIgKz0gXCIsIG1pbmltdW0tc2NhbGU9XCIrdGhpcy5jdXJyZW50U2NhbGU7XHJcbiAgICAgICAgY29udGVudFN0ciArPSBcIiwgbWF4aW11bS1zY2FsZT1cIit0aGlzLmN1cnJlbnRTY2FsZTtcclxuICAgICAgICBjb250ZW50U3RyICs9IFwiLCB1c2VyLXNjYWxhYmxlPW5vXCI7XHJcbiAgICAgICAgdGhpcy52aWV3cG9ydEVsbS5zZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIsIGNvbnRlbnRTdHIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNjYWxlKHdpbmRvd1dpZHRoKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvd1dpZHRoIDwgdGhpcy5oYWxmUG9ydGlvbldpZHRoKSB7XHJcbiAgICAgICAgICAgIHdpbmRvd1dpZHRoID0gdGhpcy5oYWxmUG9ydGlvbldpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBsZXQgb2Zmc2V0ID0gKHdpbmRvd1dpZHRoIC0gdGhpcy5pbml0aWFsU2l6ZSAtIHRoaXMuaGFsZlBvcnRpb25XaWR0aCkgJSB0aGlzLnBvcnRpb25XaWR0aCAtIHRoaXMuaGFsZlBvcnRpb25XaWR0aDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRXaWR0aCA9IE1hdGguY2VpbCh3aW5kb3dXaWR0aCAvIHRoaXMucG9ydGlvbldpZHRoKSAqIHRoaXMucG9ydGlvbldpZHRoICsgdGhpcy5pbml0aWFsU2l6ZVxyXG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gd2luZG93V2lkdGggLyB0aGlzLmN1cnJlbnRXaWR0aDtcclxuICAgICAgICBjb25zb2xlLmxvZyh3aW5kb3dXaWR0aCwgdGhpcy5jdXJyZW50V2lkdGgsIHRoaXMuY3VycmVudFNjYWxlKVxyXG4gICAgfVxyXG5cclxuICAgIHNuYXBTaXplKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2NhbGUod2luZG93Lm91dGVyV2lkdGgpO1xyXG4gICAgICAgIHRoaXMuYXBwbHlTY2FsZVRvTWV0YVZpZXdwb3J0KCk7XHJcbiAgICAgICAgdGhpcy5vblNuYXBTaXplKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTaXplU25hcHBlciJdLCJuYW1lcyI6WyJwcmV2aW91c1RpbWUiLCJjbGVhclRpbWVvdXRXaXRoSWQiLCJ3aW5kb3ciLCJjbGVhclRpbWVvdXQiLCJpZCIsInNldFRpbWVvdXRXaXRoVGltZXN0YW1wIiwiY2FsbGJhY2siLCJpbW1lZGlhdGVUaW1lIiwiRGF0ZSIsIm5vdyIsImxhcHNlZFRpbWUiLCJNYXRoIiwibWF4Iiwic2V0VGltZW91dCIsInJlcXVlc3RGcmFtZUZuIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsRnJhbWVGbiIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiZ2V0VGltZSIsImRlYm91bmNlIiwiZGVsYXkiLCJsZWFkIiwiZGVib3VuY2VSYW5nZSIsImN1cnJlbnRUaW1lIiwidGltZW91dElkIiwiY2FsbCIsInBhcmFtZXRlcnMiLCJvYmplY3RBc3NpZ25Qb2x5ZmlsbCIsIk9iamVjdCIsImFzc2lnbiIsInRhcmdldCIsInVuZGVmaW5lZCIsIlR5cGVFcnJvciIsIm91dHB1dCIsImluZGV4IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwibmV4dEtleSIsImhhc093blByb3BlcnR5Iiwid2luZG93R2xvYmFsIiwic2VsZiIsImdsb2JhbCIsIm9wdGlvbk5hbWVzIiwic3BsaXQiLCJkZWZhdWx0cyIsImNvbnZlcnRQYWlyc1RvTGl0ZXJhbHMiLCJ2YWx1ZSIsImkiLCJhZGRXaW5kb3dFdmVudCIsImhhbmRsZXIiLCJpbmNlcHQiLCJ3aW5kb3dPYmplY3QiLCJ1c2VDYXB0dXJlIiwiZGVib3VuY2VkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRlc3Ryb3lQYXJ0aWFsIiwiZGlyZWN0SGFuZGxlciIsImRlc3Ryb3lBUEkiLCJ0eXBlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInJlc2l6aWxsYVBhcnRpYWwiLCJyZXNpemlsbGFGaW5hbCIsIkFQSVBhcmFtZXRlcnMiLCJleGNlc3NEZWZhdWx0cyIsInNsaWNlIiwib3B0aW9uVmFsdWVzIiwibWVyZ2VkT3B0aW9ucyIsIm1hcCIsIm9yaWVudGF0aW9uQ2hhbmdlIiwiZGVzdHJveSIsInJlc2l6aWxsYSIsIlNpemVTbmFwcGVyIiwiY29uZmlnIiwicG9ydGlvbldpZHRoIiwiaW5pdGlhbFNpemUiLCJ0aW1lb3V0IiwiY3VycmVudFNjYWxlIiwiY3VycmVudFdpZHRoIiwiaGFsZlBvcnRpb25XaWR0aCIsImZsb29yIiwiY2hlY2tWaWV3cG9ydCIsInNuYXBTaXplIiwiYmluZCIsIm9uU25hcFNpemUiLCJ2aWV3cG9ydEVsbSIsImRvY3VtZW50IiwiaGVhZCIsInF1ZXJ5U2VsZWN0b3IiLCJjcmVhdGVWaWV3cG9ydE1ldGEiLCJtZXRhIiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiY29udGVudFN0ciIsIndpbmRvd1dpZHRoIiwiY2VpbCIsImNvbnNvbGUiLCJsb2ciLCJ1cGRhdGVTY2FsZSIsIm91dGVyV2lkdGgiLCJhcHBseVNjYWxlVG9NZXRhVmlld3BvcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFBQTs7Ozs7Ozs7Ozs7Ozs7RUFjQTs7Ozs7OztFQU9BOzs7Ozs7RUFNQTtFQUNBLElBQUlBLGVBQWUsQ0FBbkI7O0VBRUE7Ozs7RUFJQSxJQUFNQyxxQkFBcUIsU0FBckJBLGtCQUFxQixLQUFNO0VBQzdCQyxXQUFPQyxZQUFQLENBQW9CQyxFQUFwQjtFQUNBQSxTQUFLLElBQUw7RUFDSCxDQUhEOztFQUtBOzs7OztFQUtBLFNBQVNDLHVCQUFULENBQWlDQyxRQUFqQyxFQUEyQztFQUN2QyxRQUFNQyxnQkFBZ0JDLEtBQUtDLEdBQUwsRUFBdEI7RUFDQSxRQUFJQyxhQUFhQyxLQUFLQyxHQUFMLENBQVNaLGVBQWUsRUFBeEIsRUFBNEJPLGFBQTVCLENBQWpCO0VBQ0EsV0FBT00sV0FBVyxZQUFZO0VBQzFCUCxpQkFBU04sZUFBZVUsVUFBeEI7RUFDSCxLQUZNLEVBRUpBLGFBQWFILGFBRlQsQ0FBUDtFQUdIOztFQUVEO0VBQ0EsSUFBTU8saUJBQWlCWixPQUFPYSxxQkFBUCxJQUFnQ1YsdUJBQXZEO0VBQ0Es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
