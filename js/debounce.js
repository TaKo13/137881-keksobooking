'use strict';

(function() {
  var DEBOUNCE_INTERVAL_IN_MS = 300;

  window.debounce = function(fun, delay) {
    var lastTimeout = null;

    return function() {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function() {
        fun.apply(null, args);
      }, delay || DEBOUNCE_INTERVAL_IN_MS);
    };
  };
})();
