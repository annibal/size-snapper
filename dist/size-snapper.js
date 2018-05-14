var SizeSnapper = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

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

  function SizeSnapper() {
      resizilla(function (e) {
          console.log(e);
      }, 15, false, false, true);
  }

  return SizeSnapper;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS1zbmFwcGVyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9Eb2N1bWVudHMvUmVwb3NpdG9yaWVzL3NpemUtc25hcHBlci9ub2RlX21vZHVsZXMvcmVzaXppbGxhL2Rpc3QvcmVzaXppbGxhLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qICAgICAgICAgICBfLi1+LS5cbiAgICAgICAgICAgNycnICBRLi5cXFxuICAgICAgICBfNyAgICAgICAgIChfXG4gICAgICBfNyAgXy8gICAgX3EuICAvXG4gICAgXzcgLiBfX18gIC9WVnZ2LSdfICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuXG4gICA3LyAvIC9+LSBcXF9cXFxcICAgICAgJy0uXyAgICAgLi0nICAgICAgICAgICAgICAgICAgICAgIC8gICAgICAgLy9cbiAgLi8gKCAvLX4tLyAgfHwnPS5fXyAgJzo6LiAnLX4nJyB7ICAgICAgICAgICAgIF9fXyAgIC8gIC8vICAgICAuL3tcbiBWICAgVi1+LX58ICAgfHwgICBfXycnXyAgICc6OjouICAgJyd+LX4uX19fLi0nJyBfLyAgLy8gLyB7XyAgIC8gIHsgIC9cbiAgVlYvLX4tfi18ICAvIFxcIC4nX18nLiAnLiAgJzo6ICBfX19fICAgICAgICAgICAgICAgXyBfIF8gICAgICAgICcnLlxuICAvIC9+fn5+fHwgIFZWVi8gLyAgXFwgKSAgXFwgICAgIHwgIF8gXFwgX19fICBfX18oXylfX18oXykgfCB8IF9fIF8gICAuOjonXG4gLyAofi1+LX5cXFxcLi0nIC8gICAgXFwnICAgXFw6Ojo6LiB8IHxfKSAvIF8gXFwvIF9ffCB8XyAgLyB8IHwgfC8gX2AgfCA6OjonXG4vLi5cXCAgICAvLi5cXF9fLyAgICAgICcgICAgICc6OjogfCAgXyA8ICBfXy9cXF9fIFxcIHwvIC98IHwgfCB8IChffCB8IDo6J1xudlZWdiAgICB2VlZ2ICAgICAgICAgICAgICAgICAnOiB8X3wgXFxfXFxfX198fF9fXy9fL19fX3xffF98X3xcXF9fLF98ICcnXG4qL1xuLypcbiBWZXJzaW9uOiAwLjkuMlxuIERlc2NyaXB0aW9uOiBBIEJldHRlciBXaW5kb3cgUmVzaXplXG4gQXV0aG9yOiBKdWxpZW4gRXRpZW5uZVxuIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9qdWxpZW5ldGllL3Jlc2l6aWxsYVxuKi9cblxuLyoqXG4gKiByZXF1ZXN0LWZyYW1lLW1vZGVybiAtIE9wdGltYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICYgY2FuY2VsQW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgZm9yIG1vZGVybiBkZXZlbG9wbWVudFxuICogQHZlcnNpb24gdjIuMC4zXG4gKiBAbGljZW5zZSBNSVRcbiAqIENvcHlyaWdodCBKdWxpZW4gRXRpZW5uZSAyMDE1IEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKi9cbi8vIEluaXRpYWwgdGltZSBvZiB0aGUgdGltaW5nIGxhcHNlLlxudmFyIHByZXZpb3VzVGltZSA9IDA7XG5cbi8qKlxuICogTmF0aXZlIGNsZWFyVGltZW91dCBmdW5jdGlvbiBmb3IgSUUtOSBjYW5jZWxBbmltYXRpb25GcmFtZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGNsZWFyVGltZW91dFdpdGhJZCA9IGlkID0+IHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGlkKTtcbiAgICBpZCA9IG51bGw7XG59O1xuXG4vKipcbiAqIElFLTkgUG9seWZpbGwgZm9yIHJlcXVlc3RBbmltYXRpb25GcmFtZVxuICogQGNhbGxiYWNrIHtOdW1iZXJ9IFRpbWVzdGFtcC5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBzZXRUaW1lb3V0IEZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0V2l0aFRpbWVzdGFtcChjYWxsYmFjaykge1xuICAgIGNvbnN0IGltbWVkaWF0ZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGxldCBsYXBzZWRUaW1lID0gTWF0aC5tYXgocHJldmlvdXNUaW1lICsgMTYsIGltbWVkaWF0ZVRpbWUpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FsbGJhY2socHJldmlvdXNUaW1lID0gbGFwc2VkVGltZSk7XG4gICAgfSwgbGFwc2VkVGltZSAtIGltbWVkaWF0ZVRpbWUpO1xufVxuXG4vLyBSZXF1ZXN0IGFuZCBjYW5jZWwgZnVuY3Rpb25zIGZvciBJRTkrICYgbW9kZXJuIG1vYmlsZSBicm93c2Vycy4gXG5jb25zdCByZXF1ZXN0RnJhbWVGbiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgc2V0VGltZW91dFdpdGhUaW1lc3RhbXA7XG5jb25zdCBjYW5jZWxGcmFtZUZuID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8IGNsZWFyVGltZW91dFdpdGhJZDtcblxuLyoqXG4gKiBTZXQgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSAmIGNhbmNlbEFuaW1hdGlvbkZyYW1lIHdpbmRvdyBmdW5jdGlvbnMuXG4gKi9cbmNvbnN0IHNldE5hdGl2ZUZuID0gKHJlcXVlc3RGbiwgY2FuY2VsRm4sIHdpbk9iaikgPT4ge1xuICAgIHdpbk9iai5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0Rm47XG4gICAgd2luT2JqLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsRm47XG59O1xuXG4vKipcbiAqICB2b2x2ZSAtIFRpbnksIFBlcmZvcm1hbnQgRGVib3VuY2UgYW5kIFRocm90dGxlIEZ1bmN0aW9ucyxcbiAqICAgICBMaWNlbnNlOiAgTUlUXG4gKiAgICAgIENvcHlyaWdodCBKdWxpZW4gRXRpZW5uZSAyMDE2IEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiAgICAgICAgZ2l0aHViOiAgaHR0cHM6Ly9naXRodWIuY29tL2p1bGllbmV0aWUvdm9sdmVcbiAq4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+4oC+XG4gKi9cblxuLyoqXG4gKiBEYXRlLm5vdyBwb2x5ZmlsbC5cbiAqIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlL25vd31cbiAqL1xuaWYgKCFEYXRlLm5vdykge1xuICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBEZWJvdW5jZSBhIGZ1bmN0aW9uIGNhbGwgZHVyaW5nIHJlcGV0aXRvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtOdW1iZXJ9ICAgIGRlbGF5ICAgIC0gRGVsYXkgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtCb29sZWFufSAgIGxlYWQgIC0gTGVhZGluZyBvciB0cmFpbGluZy5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIFRoZSBkZWJvdW5jZSBmdW5jdGlvbi4gXG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGNhbGxiYWNrLCBkZWxheSwgbGVhZCkge1xuICAgIHZhciBkZWJvdW5jZVJhbmdlID0gMDtcbiAgICB2YXIgY3VycmVudFRpbWU7XG4gICAgdmFyIGxhc3RDYWxsO1xuICAgIHZhciBzZXREZWxheTtcbiAgICB2YXIgdGltZW91dElkO1xuXG4gICAgY29uc3QgY2FsbCA9IHBhcmFtZXRlcnMgPT4ge1xuICAgICAgICBjYWxsYmFjayhwYXJhbWV0ZXJzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHBhcmFtZXRlcnMgPT4ge1xuICAgICAgICBpZiAobGVhZCkge1xuICAgICAgICAgICAgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lID4gZGVib3VuY2VSYW5nZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVib3VuY2VSYW5nZSA9IGN1cnJlbnRUaW1lICsgZGVsYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHNldFRpbWVvdXQgaXMgb25seSB1c2VkIHdpdGggdGhlIHRyYWlsIG9wdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjYWxsKHBhcmFtZXRlcnMpO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuY29uc3Qgb2JqZWN0QXNzaWduUG9seWZpbGwgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBPYmplY3QuYXNzaWduICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgICAgIC8vIFdlIG11c3QgY2hlY2sgYWdhaW5zdCB0aGVzZSBzcGVjaWZpYyBjYXNlcy5cblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkobmV4dEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcbiAgICB9XG59O1xuXG4vLyBBZGQgdGhlIE9iamVjdC5hc3NpZ24gcG9seWZpbGwuXG5vYmplY3RBc3NpZ25Qb2x5ZmlsbCgpO1xuXG4vLyBPYnRhaW5zIHRoZSB3aW5kb3cgb3IgZ2xvYmFsIGFjY29yZGluZyB0byB0aGUgZW52aXJvbm1lbnQuXG5jb25zdCB3aW5kb3dHbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fCB0eXBlb2YgZ2xvYmFsID09PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsO1xuXG4vLyBBIGxpc3Qgb2Ygb3B0aW9uIG5hbWVzIHRvIG1ha2UgbmFtaW5nIGFuZCByZW5hbWluZyBzaW1wbGUuXG5jb25zdCBvcHRpb25OYW1lcyA9ICdoYW5kbGVyLGRlbGF5LGluY2VwdCx1c2VDYXB0dXJlLG9yaWVudGF0aW9uY2hhbmdlJy5zcGxpdCgnLCcpO1xuXG4vLyBEZWZhdWx0IG9wdGlvbnMgdGhhdCBjb3JyZXNwb25kIHdpdGggdGhlIG9wdGlvbk5hbWVzLlxuY29uc3QgZGVmYXVsdHMgPSBbKCkgPT4ge30sIDE2LCBmYWxzZSwgZmFsc2UsIHRydWVdO1xuXG4vKiogXG4gKiBFYWNoIG9wdGlvbiBuYW1lIGlzIHBhaXJlZCB3aXRoIHRoZSBvcHRpb24gdmFsdWVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuY29uc3QgY29udmVydFBhaXJzVG9MaXRlcmFscyA9ICh2YWx1ZSwgaSkgPT4gKHtcbiAgICBbb3B0aW9uTmFtZXNbaV1dOiB2YWx1ZSB9KTtcblxuLyoqIFxuICogQWRkcyB0aGUgd2luZG93IGV2ZW50IHdpdGggdGhlIHByb3ZpZGVkIG9wdGlvbnMuXG4gKiBSZXR1cm5zIHRoZSBzYW1lIGhhbmRsZXIgZm9yIHJlbW92ZUV2ZW50TGlzdGVuZXJzLlxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmNvbnN0IGFkZFdpbmRvd0V2ZW50ID0gKGhhbmRsZXIsIGRlbGF5LCBpbmNlcHQsIHdpbmRvd09iamVjdCwgdXNlQ2FwdHVyZSkgPT4ge1xuICAgIGNvbnN0IGRlYm91bmNlZCA9IGRlYm91bmNlKGhhbmRsZXIsIGRlbGF5LCBpbmNlcHQpO1xuICAgIHdpbmRvd09iamVjdC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBkZWJvdW5jZWQsIHVzZUNhcHR1cmUpO1xuICAgIHJldHVybiBkZWJvdW5jZWQ7XG59O1xuXG5jb25zdCBkZXN0cm95UGFydGlhbCA9IChkaXJlY3RIYW5kbGVyLCB1c2VDYXB0dXJlLCB3aW5kb3dPYmplY3QpID0+IHtcbiAgICBjb25zdCBkZXN0cm95QVBJID0gdHlwZSA9PiB7XG4gICAgICAgIGlmICghdHlwZSB8fCB0eXBlID09PSAnYWxsJykge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGJvdGggZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICAgICAgd2luZG93T2JqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRpcmVjdEhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICAgICAgd2luZG93T2JqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgZGlyZWN0SGFuZGxlciwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgc3BlY2lmaWMgZXZlbnQgbGlzdGVuZXIuXG4gICAgICAgICAgICB3aW5kb3dPYmplY3QucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBkaXJlY3RIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGRlc3Ryb3lBUEk7XG59O1xuXG4vKiogXG4gKiBQYXJ0aWFsbHkgYXBwbHkgdmFyaWFibGVzIGFzIGRlZmF1bHRzXG4gKiBAcGFyYW0ge0FycmF5fSBkZWZhdWx0cyAtIEFycmF5IG9mIGNvbnNlY3V0aXZlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtvYmplY3R9IHdpbmRvd09iamVjdCAtICBUaGUgd2luZG93IHwgZ2xvYmFsIG9iamVjdC5cbiAqL1xuY29uc3QgcmVzaXppbGxhUGFydGlhbCA9IChkZWZhdWx0cywgd2luZG93T2JqZWN0KSA9PiB7XG5cbiAgICAvKiogXG4gICAgICogVGhlIEFQSVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbiByZXNpemVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgLSBEZWJvdW5jZSBkZWxheSBpbiBtaWxsaXNlY29uZHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluY2VwdCAtIERlYm91bmNlIHN0eWxlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlIC0gQnViYmxpbmcvIGNhcHR1cmUgb3B0aW9ucyBmb3IgZXZlbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcmllbnRhdGlvbkNoYW5nZSAtIHJlc3BvbmQgb24gb3JpZW50YXRpb24gY2hhbmdlXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlc2l6aWxsYUZpbmFsKC4uLkFQSVBhcmFtZXRlcnMpIHtcblxuICAgICAgICAvLyBUaGUgdW5jaG9zZW4gZXhjZXNzIGRlZmF1bHRzLlxuICAgICAgICBjb25zdCBleGNlc3NEZWZhdWx0cyA9IGRlZmF1bHRzLnNsaWNlKEFQSVBhcmFtZXRlcnMubGVuZ3RoLCBkZWZhdWx0cy5sZW5ndGgpO1xuXG4gICAgICAgIC8vIENvbmNhdGVuYXRlIHRoZSBBUEkgb3B0aW9ucyB3aXRoIHRoZSBleGNlc3MgZGVmYXVsdHMuXG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlcyA9IFsuLi5BUElQYXJhbWV0ZXJzLCAuLi5leGNlc3NEZWZhdWx0c107XG5cbiAgICAgICAgLy8gRmluYWwgb3B0aW9ucyBhcyBhbiBvYmplY3QuXG4gICAgICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKC4uLm9wdGlvblZhbHVlcy5tYXAoY29udmVydFBhaXJzVG9MaXRlcmFscykpO1xuXG4gICAgICAgIC8vIERlc3RydWN0dXJlZCBvcHRpb25zLlxuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgICAgZGVsYXksXG4gICAgICAgICAgICBpbmNlcHQsXG4gICAgICAgICAgICB1c2VDYXB0dXJlLFxuICAgICAgICAgICAgb3JpZW50YXRpb25DaGFuZ2VcbiAgICAgICAgfSA9IG1lcmdlZE9wdGlvbnM7XG5cbiAgICAgICAgLy8gQSBkaXJlY3QgcmVmZXJlbmNlIHRvIHRoZSBhZGRlZCBoYW5kbGVyLlxuICAgICAgICBjb25zdCBkaXJlY3RIYW5kbGVyID0gYWRkV2luZG93RXZlbnQoaGFuZGxlciwgZGVsYXksIGluY2VwdCwgd2luZG93T2JqZWN0LCB1c2VDYXB0dXJlKTtcblxuICAgICAgICAvLyBBZGRzIG9yaWVudGF0aW9uY2hhbmdlIGV2ZW50IGlmIHJlcXVpcmVkLlxuICAgICAgICBpZiAob3JpZW50YXRpb25DaGFuZ2UpIHtcbiAgICAgICAgICAgIHdpbmRvd09iamVjdC5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIGRpcmVjdEhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJucyBhbiBkZXN0cm95QVBJIG1ldGhvZCB0byByZW1vdmUgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZGVzdHJveTogZGVzdHJveVBhcnRpYWwoZGlyZWN0SGFuZGxlciwgdXNlQ2FwdHVyZSwgd2luZG93T2JqZWN0KVxuICAgICAgICB9O1xuICAgIH07XG59O1xuXG4vLyBDcmVhdGVzIHRoZSBSZXNpemlsbGEgZnVuY3Rpb24uXG5jb25zdCByZXNpemlsbGEgPSByZXNpemlsbGFQYXJ0aWFsKGRlZmF1bHRzLCB3aW5kb3dHbG9iYWwpO1xuXG5leHBvcnQgZGVmYXVsdCByZXNpemlsbGE7XG4iLCJpbXBvcnQgcmVzaXppbGxhIGZyb20gJ3Jlc2l6aWxsYSc7XHJcbi8vIHJlcXVpcmUoJ3Jlc2l6aWxsYScpXHJcblxyXG5mdW5jdGlvbiBTaXplU25hcHBlcigpIHtcclxuICAgIHJlc2l6aWxsYShcclxuICAgICAgICAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgMTUsXHJcbiAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgdHJ1ZVxyXG4gICAgKVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2l6ZVNuYXBwZXIiXSwibmFtZXMiOlsicHJldmlvdXNUaW1lIiwiY2xlYXJUaW1lb3V0V2l0aElkIiwid2luZG93IiwiY2xlYXJUaW1lb3V0IiwiaWQiLCJzZXRUaW1lb3V0V2l0aFRpbWVzdGFtcCIsImNhbGxiYWNrIiwiaW1tZWRpYXRlVGltZSIsIkRhdGUiLCJub3ciLCJsYXBzZWRUaW1lIiwiTWF0aCIsIm1heCIsInNldFRpbWVvdXQiLCJyZXF1ZXN0RnJhbWVGbiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEZyYW1lRm4iLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImdldFRpbWUiLCJkZWJvdW5jZSIsImRlbGF5IiwibGVhZCIsImRlYm91bmNlUmFuZ2UiLCJjdXJyZW50VGltZSIsInRpbWVvdXRJZCIsImNhbGwiLCJwYXJhbWV0ZXJzIiwib2JqZWN0QXNzaWduUG9seWZpbGwiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YXJnZXQiLCJ1bmRlZmluZWQiLCJUeXBlRXJyb3IiLCJvdXRwdXQiLCJpbmRleCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsIm5leHRLZXkiLCJoYXNPd25Qcm9wZXJ0eSIsIndpbmRvd0dsb2JhbCIsInNlbGYiLCJnbG9iYWwiLCJvcHRpb25OYW1lcyIsInNwbGl0IiwiZGVmYXVsdHMiLCJjb252ZXJ0UGFpcnNUb0xpdGVyYWxzIiwidmFsdWUiLCJpIiwiYWRkV2luZG93RXZlbnQiLCJoYW5kbGVyIiwiaW5jZXB0Iiwid2luZG93T2JqZWN0IiwidXNlQ2FwdHVyZSIsImRlYm91bmNlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXN0cm95UGFydGlhbCIsImRpcmVjdEhhbmRsZXIiLCJkZXN0cm95QVBJIiwidHlwZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZXNpemlsbGFQYXJ0aWFsIiwicmVzaXppbGxhRmluYWwiLCJBUElQYXJhbWV0ZXJzIiwiZXhjZXNzRGVmYXVsdHMiLCJzbGljZSIsIm9wdGlvblZhbHVlcyIsIm1lcmdlZE9wdGlvbnMiLCJtYXAiLCJvcmllbnRhdGlvbkNoYW5nZSIsImRlc3Ryb3kiLCJyZXNpemlsbGEiLCJTaXplU25hcHBlciIsImUiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7Ozs7Ozs7Ozs7Ozs7O0VBY0E7Ozs7Ozs7RUFPQTs7Ozs7O0VBTUE7RUFDQSxJQUFJQSxlQUFlLENBQW5COztFQUVBOzs7O0VBSUEsSUFBTUMscUJBQXFCLFNBQXJCQSxrQkFBcUIsS0FBTTtFQUM3QkMsV0FBT0MsWUFBUCxDQUFvQkMsRUFBcEI7RUFDQUEsU0FBSyxJQUFMO0VBQ0gsQ0FIRDs7RUFLQTs7Ozs7RUFLQSxTQUFTQyx1QkFBVCxDQUFpQ0MsUUFBakMsRUFBMkM7RUFDdkMsUUFBTUMsZ0JBQWdCQyxLQUFLQyxHQUFMLEVBQXRCO0VBQ0EsUUFBSUMsYUFBYUMsS0FBS0MsR0FBTCxDQUFTWixlQUFlLEVBQXhCLEVBQTRCTyxhQUE1QixDQUFqQjtFQUNBLFdBQU9NLFdBQVcsWUFBWTtFQUMxQlAsaUJBQVNOLGVBQWVVLFVBQXhCO0VBQ0gsS0FGTSxFQUVKQSxhQUFhSCxhQUZULENBQVA7RUFHSDs7RUFFRDtFQUNBLElBQU1PLGlCQUFpQlosT0FBT2EscUJBQVAsSUFBZ0NWLHVCQUF2RDtFQUNBLElBQU1XLGdCQUFnQmQsT0FBT2Usb0JBQVAsSUFBK0JoQixrQkFBckQ7O0VBVUE7Ozs7Ozs7O0VBUUE7Ozs7RUFJQSxJQUFJLENBQUNPLEtBQUtDLEdBQVYsRUFBZTtFQUNYRCxTQUFLQyxHQUFMLEdBQVcsU0FBU0EsR0FBVCxHQUFlO0VBQ3RCLGVBQU8sSUFBSUQsSUFBSixHQUFXVSxPQUFYLEVBQVA7RUFDSCxLQUZEO0VBR0g7O0VBRUQ7Ozs7Ozs7RUFPQSxTQUFTQyxRQUFULENBQWtCYixRQUFsQixFQUE0QmMsS0FBNUIsRUFBbUNDLElBQW5DLEVBQXlDO0VBQ3JDLFFBQUlDLGdCQUFnQixDQUFwQjtFQUNBLFFBQUlDLFdBQUo7QUFDQSxF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
