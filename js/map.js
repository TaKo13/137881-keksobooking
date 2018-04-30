'use strict';

(function() {
  var ESC_KEY_CODE = 27;
  var ENTER_KEY_CODE = 13;

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

  var mapCardElements;
  var mapPinElements;

  var removeMapCards = function() {
    if (!mapCardElements) {
      return;
    }

    for (var i = 0; i < mapCardElements.length; i++) {
      mapCardElements[i].remove();
    }
  };

  var hideAllMapCards = function() {
    if (!mapCardElements) {
      return;
    }

    for (var i = 0; i < mapCardElements.length; i++) {
      mapCardElements[i].classList.add('hidden');
    }
  };

  var showPins = function() {
    if (!mapPinElements) {
      return;
    }

    for (var i = 1; i < mapPinElements.length; i++) {
      mapPinElements[i].classList.remove('hidden');
    }
  };

  var removePins = function() {
    if (!mapPinElements) {
      return;
    }

    for (var i = 1; i < mapPinElements.length; i++) {
      mapPinElements[i].remove();
    }
  };

  var isActive = false;

  var activate = function() {
    isActive = true;
    document.querySelector('.map').classList.remove('map--faded');
    window.enableForm();

    window.getData(onGetDataSuccess, onGetDataError);
  };

  window.deactivate = function() {
    isActive = false;
    document.querySelector('.map').classList.add('map--faded');
    window.disableForm();

    moveMainPinToCenter();
    removePins();
    removeMapCards();
    window.fillInputCoordinates(getPinPosition(mapPinMainElement));
  };

  var start = function() {
    window.deactivate();

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

        window.fillInputCoordinates(pinTipCoordinates);
      };

      var onMainPinMouseup = function(upE) {
        upE.preventDefault();
        if (!isActive) {
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

  var onGetDataSuccess = function(reponse) {
    window.insertCardElements(reponse);
    window.insertMapPinElements(reponse);

    mapPinElements = document.querySelectorAll('.map__pin');
    showPins();

    var onMapCardClick = function(e) {
      if (e.target.classList.contains('popup__close')) {
        e.target.parentElement.classList.add('hidden');
      }
    };

    mapCardElements = document.querySelectorAll('.map__card');

    for (var k = 0; k < mapCardElements.length; k++) {
      mapCardElements[k].addEventListener('click', onMapCardClick);
    }

    var onEscKeyDown = function(e) {
      if (e.keyCode === ESC_KEY_CODE) {
        document.removeEventListener('keydown', onEscKeyDown);
        hideAllMapCards();
      }
    };

    var showCard = function(i) {
      mapCardElements[i].classList.remove('hidden');
      document.addEventListener('keydown', onEscKeyDown);
    };

    var onEnterKeyDown = function(e, index) {
      if (e.keyCode === ENTER_KEY_CODE) {
        showCard(index);
      }
    };

    // 0 - главная метка
    // Показываем нужную карточку по клику на пин
    for (var j = 1; j < mapPinElements.length; j++) {
      (function(index) {
        mapPinElements[j].addEventListener('keydown', function(e) {
          onEnterKeyDown(e, index);
        });
        mapPinElements[j].addEventListener('click', function() {
          hideAllMapCards();
          showCard(index);
        });
      })(j - 1);
    }
  };
  start();
})();
