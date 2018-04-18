'use strict';

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TIMES_IN = ['12:00', '13:00', '14:00'];
var TIMES_OUT = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_DICT = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var TYPES_MIN_PRICES = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
};
var ROOMS_TO_CAPACITY = {
  '1': [0, 1, 3],
  '2': [0, 3],
  '3': [3],
  '100': [0, 1, 2]
};
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var PIN_MIN_Y_VALUE = 150;
var PIN_MAX_Y_VALUE = 500;

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomItemFromArray = function (array) {
  var index = Math.floor(Math.random() * array.length);
  return array[index];
};

var getShuffledCopyWithRandomLength = function (array) {
  return getShuffledArrayCopy(array).slice(0, getRandomNumber(1, array.length));
};

var getShuffledArrayCopy = function (array) {
  var compareRandom = function (a, b) {
    return Math.random() - 0.5;
  };
  return array.slice().sort(compareRandom);
};

var generateData = function () {
  var objects = [];

  for (var i = 1; i <= 8; i++) {
    var locationByX = getRandomNumber(300, 900);
    var locationByY = getRandomNumber(150, 500);
    objects.push({
      author: {
        avatar: 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: TITLES[i - 1],
        address: locationByX + ', ' + locationByY,
        price: getRandomNumber(1000, 1000000),
        type: getRandomItemFromArray(TYPES),
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 5),
        checkin: getRandomItemFromArray(TIMES_IN),
        checkout: getRandomItemFromArray(TIMES_OUT),
        features: getShuffledCopyWithRandomLength(FEATURES),
        description: '',
        photos: getShuffledArrayCopy(PHOTOS)
      },
      location: {
        x: locationByX,
        y: locationByY
      }
    });
  }

  return objects;
};

var mapCardTemplate = document.querySelector('template');

// Создается элемент метки
var createMapPin = function (locationX, locationY, avatar, title) {
  var mapPinElement = mapCardTemplate.content
    .querySelector('.map__pin')
    .cloneNode(true);

  mapPinElement.style = 'left:' + locationX + 'px;' + 'top:' + locationY + 'px';
  mapPinElement.querySelector('img').src = avatar;
  mapPinElement.querySelector('img').alt = title;
  mapPinElement.classList.add('hidden');

  return mapPinElement;
};

// Здесь заполняются метки 📍
var insertMapPinElements = function (objects) {
  for (var j = 0; j < objects.length; j++) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(
      createMapPin(
        objects[j].location.x,
        objects[j].location.y,
        objects[j].author.avatar,
        objects[j].title
      )
    );

    document.querySelector('.map__pins').appendChild(fragment);
  }
};

var createPhotos = function (photos, photosContainer) {
  var img = photosContainer.querySelector('.popup__photo');

  for (var i = 0; i < photos.length; i++) {
    var clonedImg = img.cloneNode();
    clonedImg.src = photos[i];
    photosContainer.appendChild(clonedImg);
  }

  photosContainer.removeChild(img);
};

var createFeatures = function (features, featuresContainer) {
  var feature = featuresContainer.querySelector('.popup__feature');

  feature.classList.remove('popup__feature--wifi');
  featuresContainer.textContent = '';

  for (var j = 0; j < features.length; j++) {
    var clonedFeature = feature.cloneNode(true);

    clonedFeature.classList.add('popup__feature--' + features[j]);

    featuresContainer.appendChild(clonedFeature);
  }
};

// Создаются карточки , далее циклом заполнить
var createMapCard = function (object) {
  var mapCardElement = mapCardTemplate.content
    .querySelector('.map__card')
    .cloneNode(true);

  mapCardElement.querySelector('.popup__title').textContent =
    object.offer.title;

  mapCardElement.querySelector('.popup__text--address').textContent =
    object.offer.address;

  mapCardElement.querySelector('.popup__text--price').textContent =
    object.offer.price + ' ₽/ночь';

  mapCardElement.querySelector('.popup__type').textContent =
    TYPES_DICT[object.offer.type];

  mapCardElement.querySelector('.popup__text--time').textContent =
    'Заезд после: ' +
    object.offer.checkin +
    ', выезд до' +
    object.offer.checkout;

  var features = mapCardElement.querySelector('.popup__features');
  createFeatures(object.offer.features, features);

  mapCardElement.querySelector('.popup__description').textContent =
    object.offer.description;

  var photosContainer = mapCardElement.querySelector('.popup__photos');
  createPhotos(object.offer.photos, photosContainer);

  mapCardElement.querySelector('.popup__avatar').src = object.author.avatar;
  mapCardElement.classList.add('hidden');

  return mapCardElement;
};

// Заполняются карточки, вставка на страницу в блок map
var insertCardElements = function (objects) {
  for (var k = 0; k < objects.length; k++) {
    var fragment = document.createDocumentFragment();
    var map = document.querySelector('.map');
    var child = map.querySelector('.map__filters-container');

    fragment.appendChild(createMapCard(objects[k]));
    map.insertBefore(fragment, child);
  }
};

var objects = generateData();
insertCardElements(objects);
insertMapPinElements(objects);

var fieldset = document.querySelectorAll('fieldset');
var inputAddress = document.querySelector('#address');
var mapPinMainElement = document.querySelector('.map__pin--main');
var mapPinElements = document.querySelectorAll('.map__pin');
var mapCardElements = document.querySelectorAll('.map__card');
var mapPinsContainer = document.querySelector('.map__pins');

var hideAllMapCards = function () {
  for (var i = 0; i < mapCardElements.length; i++) {
    mapCardElements[i].classList.add('hidden');
  }
};

// расположить элемент по центру
var moveMainPinToCenter = function () {
  mapPinMainElement.style.left =
    mapPinsContainer.clientWidth / 2 - mapPinMainElement.clientWidth / 2 + 'px';
  mapPinMainElement.style.top =
    mapPinsContainer.clientHeight / 2 - mapPinMainElement.clientHeight + 'px';
};

// Форма заблокирована от редактирования
var deactivateForm = function () {
  document.querySelector('.ad-form').classList.add('ad-form--disabled');
  document.querySelector('.map').classList.add('map--faded');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].setAttribute('disabled', '');
  }
  for (var i = 1; i < mapPinElements.length; i++) {
    mapPinElements[i].classList.add('hidden');
  }
  hideAllMapCards();
  moveMainPinToCenter();
  fillInputCoordinates(inputAddress, getPinPosition(mapPinMainElement));
};

// Активировать форму
var activateForm = function () {
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  document.querySelector('.map').classList.remove('map--faded');

  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].removeAttribute('disabled');
  }

  for (var i = 1; i < mapPinElements.length; i++) {
    mapPinElements[i].classList.remove('hidden');
  }
};

// Координаты положения метки
var getPinPosition = function (pin) {
  var x = Math.floor(parseInt(pin.style.left, 10) + pin.clientWidth / 2);
  var y = Math.floor(parseInt(pin.style.top, 10) + pin.clientHeight);

  return {
    x: x,
    y: y
  };
};

var fillInputCoordinates = function (input, coordinates) {
  input.value = coordinates.x + ', ' + coordinates.y;
};

var adForm = document.querySelector('.ad-form');
var housingTypeSelect = adForm.elements.namedItem('type');
var housingPriceInput = adForm.elements.namedItem('price');
var timeInInpun = adForm.elements.namedItem('timein');
var timeOutInpun = adForm.elements.namedItem('timeout');
var roomsSelect = adForm.elements.namedItem('rooms');
var capacitySelect = adForm.elements.namedItem('capacity');

var onAdFormReset = function (e) {
  e.preventDefault();
  deactivateForm();
};

adForm.addEventListener('reset', onAdFormReset);

// Поле «Кол-во комнат» синхронизировано с полем «Кол-во мест»
var onRoomSelectChange = function (e) {
  var roomsNumber = e.target.value;
  var indexesToDisable = ROOMS_TO_CAPACITY[roomsNumber];

  for (var i = 0; i < capacitySelect.length; i++) {
    capacitySelect.options[i].disabled = false;

    if (indexesToDisable.includes(i)) {
      capacitySelect.options[i].disabled = true;
    }
  }
};

roomsSelect.addEventListener('change', onRoomSelectChange);

// Меняем значение плейсхолдера и мин.цены
var changePriceInput = function (price) {
  housingPriceInput.setAttribute('placeholder', price);
  housingPriceInput.setAttribute('min', price);
};

var onHousingTypeChange = function (e) {
  changePriceInput(TYPES_MIN_PRICES[e.target.value]);
};

housingTypeSelect.addEventListener('change', onHousingTypeChange);

// Синхронизируем время заезда/выезда
var onTimeInChange = function (e) {
  timeOutInpun.value = e.target.value;
};
var onTimeOutChange = function (e) {
  timeInInpun.value = e.target.value;
};

timeInInpun.addEventListener('change', onTimeInChange);
timeOutInpun.addEventListener('change', onTimeOutChange);

var start = function () {
  deactivateForm();

  var onMainPinMousedown = function (e) {
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
    }

    var onMainPinMousemove = function (mvE) {
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

    var onMainPinMouseup = function (upE) {
      upE.preventDefault();
      activateForm();

      document.removeEventListener('mouseup', onMainPinMouseup);
      document.removeEventListener('mousemove', onMainPinMousemove);
    };

    document.addEventListener('mouseup', onMainPinMouseup);
    document.addEventListener('mousemove', onMainPinMousemove);
  };

  mapPinMainElement.addEventListener('mousedown', onMainPinMousedown);

  var onMapCardClick = function (e) {
    if (e.target.classList.contains('popup__close')) {
      e.target.parentElement.classList.add('hidden');
    }
  };

  var showCard = function (i) {
    mapCardElements[i].classList.remove('hidden');
  };

  // 0 - главная метка
  for (var j = 1; j < mapPinElements.length; j++) {
    (function (index) {
      mapPinElements[j].addEventListener('click', function () {
        hideAllMapCards();
        showCard(index);
      });
    })(j - 1);
  }

  for (var k = 0; k < mapCardElements.length; k++) {
    mapCardElements[k].addEventListener('click', onMapCardClick);
  }
};

start();
