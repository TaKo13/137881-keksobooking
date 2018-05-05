'use strict';

(function() {
  var PIN_MIN_Y_VALUE = 150;
  var PIN_MAX_Y_VALUE = 500;

  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapPinsContainer = document.querySelector('.map__pins');

  var moveMainPinToCenter = function() {
    mapPinMainElement.style.left =
      mapPinsContainer.clientWidth / 2 -
      mapPinMainElement.clientWidth / 2 +
      'px';
    mapPinMainElement.style.top =
      mapPinsContainer.clientHeight / 2 - mapPinMainElement.clientHeight + 'px';
  };

  var getPinPosition = function(pin) {
    var x = Math.floor(parseInt(pin.style.left, 10) + pin.clientWidth / 2);
    var y = Math.floor(parseInt(pin.style.top, 10) + pin.clientHeight);

    return {
      x: x,
      y: y
    };
  };

  var isMapActive = false;

  var activate = function() {
    isMapActive = true;
    document.querySelector('.map').classList.remove('map--faded');
    window.form.enableForm();

    window.getData(onGetDataSuccess, onGetDataError);
  };

  var deactivate = function() {
    isMapActive = false;
    document.querySelector('.map').classList.add('map--faded');
    window.form.disableForm();

    moveMainPinToCenter();
    window.pin.removePins();
    window.card.removeMapCards();
    window.form.fillInputCoordinates(getPinPosition(mapPinMainElement));
  };

  var start = function() {
    deactivate();

    var onMainPinMousedown = function(e) {
      e.preventDefault();

      var startCoords = {
        x: e.clientX,
        y: e.clientY
      };

      // так как метка указывает координаты острием,
      // необходимо позволить сдвигать острие до предельных значений;
      // по оси Х метку можно увести на половину, по оси У на всю высоту.

      var pinSize = {
        width: mapPinMainElement.clientWidth / 2,
        height: mapPinMainElement.clientHeight
      };

      var onMainPinMousemove = function(mvE) {
        mvE.preventDefault();

        var shift = {
          x: startCoords.x - mvE.clientX,
          y: startCoords.y - mvE.clientY
        };

        startCoords = {
          x: mvE.clientX,
          y: mvE.clientY
        };

        var pinFinalCoords = {
          x: mapPinMainElement.offsetLeft - shift.x,
          y: mapPinMainElement.offsetTop - shift.y
        };

        if (pinFinalCoords.x < 0 - pinSize.width) {
          pinFinalCoords.x = 0 - pinSize.width;
          startCoords.x = shift.x + mvE.clientX;
        }

        if (pinFinalCoords.x > mapPinsContainer.clientWidth - pinSize.width) {
          pinFinalCoords.x = mapPinsContainer.clientWidth - pinSize.width;
          startCoords.x = shift.x + mvE.clientX;
        }

        if (pinFinalCoords.y < PIN_MIN_Y_VALUE - pinSize.height) {
          pinFinalCoords.y = PIN_MIN_Y_VALUE - pinSize.height;
          startCoords.y = shift.y + mvE.clientY;
        }

        if (pinFinalCoords.y > PIN_MAX_Y_VALUE) {
          pinFinalCoords.y = PIN_MAX_Y_VALUE;
          startCoords.y = shift.y + mvE.clientY;
        }

        mapPinMainElement.style.left = pinFinalCoords.x + 'px';
        mapPinMainElement.style.top = pinFinalCoords.y + 'px';

        var pinTipCoordinates = {
          x: getPinPosition(mapPinMainElement).x,
          y: getPinPosition(mapPinMainElement).y
        };

        window.form.fillInputCoordinates(pinTipCoordinates);
      };

      var onMainPinMouseup = function(upE) {
        upE.preventDefault();
        if (!isMapActive) {
          activate();
        }

        document.removeEventListener('mouseup', onMainPinMouseup);
        document.removeEventListener('mousemove', onMainPinMousemove);
      };

      document.addEventListener('mouseup', onMainPinMouseup);
      document.addEventListener('mousemove', onMainPinMousemove);
    };

    mapPinMainElement.addEventListener('mousedown', onMainPinMousedown);
  };

  var onGetDataError = function(errorMessage) {
    window.showErrorMessage(errorMessage);
  };

  var onGetDataSuccess = function(response) {
    window.data = response;
    window.filter.render();
  };
  start();

  window.map = {
    deactivate: deactivate
  };
})();
