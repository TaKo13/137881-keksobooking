'use strict';
var TYPES_DICT = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var PIN_MIN_Y_VALUE = 150;
var PIN_MAX_Y_VALUE = 500;

var objects = window.generateData();
window.insertCardElements(objects);
window.insertMapPinElements(objects);

var mapPinMainElement = document.querySelector('.map__pin--main');
var mapPinElements = document.querySelectorAll('.map__pin');
var mapPinsContainer = document.querySelector('.map__pins');

var onMapCardClick = function(e) {
  if (e.target.classList.contains('popup__close')) {
    e.target.parentElement.classList.add('hidden');
  }
};

var mapCardElements = document.querySelectorAll('.map__card');

for (var k = 0; k < mapCardElements.length; k++) {
  mapCardElements[k].addEventListener('click', onMapCardClick);
}

var showCard = function(i) {
  mapCardElements[i].classList.remove('hidden');
};

var hideAllMapCards = function() {
  for (var i = 0; i < mapCardElements.length; i++) {
    mapCardElements[i].classList.add('hidden');
  }
};

// 0 - главная метка
// Показываем нужную карточку по клику на пин
for (var j = 1; j < mapPinElements.length; j++) {
  (function(index) {
    mapPinElements[j].addEventListener('click', function() {
      hideAllMapCards();
      showCard(index);
    });
  })(j - 1);
}

// расположить пин по центру
var moveMainPinToCenter = function() {
  mapPinMainElement.style.left =
    mapPinsContainer.clientWidth / 2 - mapPinMainElement.clientWidth / 2 + 'px';
  mapPinMainElement.style.top =
    mapPinsContainer.clientHeight / 2 - mapPinMainElement.clientHeight + 'px';
};

// Координаты положения метки
var getPinPosition = function(pin) {
  var x = Math.floor(parseInt(pin.style.left, 10) + pin.clientWidth / 2);
  var y = Math.floor(parseInt(pin.style.top, 10) + pin.clientHeight);

  return {
    x: x,
    y: y
  };
};

var fieldset = document.querySelectorAll('fieldset');
var inputAddress = document.querySelector('#address');

var fillInputCoordinates = function(input, coordinates) {
  input.value = coordinates.x + ', ' + coordinates.y;
};

// Активировать форму
var activateForm = function() {
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  document.querySelector('.map').classList.remove('map--faded');

  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].removeAttribute('disabled');
  }

  for (var i = 1; i < mapPinElements.length; i++) {
    mapPinElements[i].classList.remove('hidden');
  }
};

// Форма заблокирована от редактирования
var deactivateForm = function() {
  document.querySelector('.ad-form').classList.add('ad-form--disabled');
  document.querySelector('.map').classList.add('map--faded');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].setAttribute('disabled', '');
  }
  for (var i = 1; i < mapPinElements.length; i++) {
    mapPinElements[i].classList.add('hidden');
  }
  window.hideAllMapCards();
  window.moveMainPinToCenter();

  fillInputCoordinates(inputAddress, getPinPosition(mapPinMainElement));
};

var start = function() {
  window.deactivateForm();

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

      fillInputCoordinates(inputAddress, pinTipCoordinates);
    };

    var onMainPinMouseup = function(upE) {
      upE.preventDefault();
      window.activateForm();

      document.removeEventListener('mouseup', onMainPinMouseup);
      document.removeEventListener('mousemove', onMainPinMousemove);
    };

    document.addEventListener('mouseup', onMainPinMouseup);
    document.addEventListener('mousemove', onMainPinMousemove);
  };

  mapPinMainElement.addEventListener('mousedown', onMainPinMousedown);
};

start();
