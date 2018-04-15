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
var TIMES = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_DICT = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
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
        checkin: getRandomItemFromArray(TIMES),
        checkout: getRandomItemFromArray(TIMES),
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

var fieldset = document.querySelectorAll('fieldset');

// Форма заблокирована от редактирования
var deactivateFormInputs = function () {
  document.querySelector('.ad-form').classList.add('ad-form--disabled');
  document.querySelector('.map').classList.add('map--faded');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].setAttribute('disabled', '');
  }
}

// Активировать форму
var activateFormInputs = function () {
  document.querySelector('.ad-form').classList.remove('ad-form--disabled');
  document.querySelector('.map').classList.remove('map--faded');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].removeAttribute('disabled');
  }
};

// Координаты положения метки
var getPinPosition = function (pin) {
  var x = Math.floor(parseInt(pin.style.left, 10) + pin.clientHeight);
  var y = Math.floor(parseInt(pin.style.top, 10) + pin.clientWidth / 2);

  return {
    x: x,
    y: y
  };
};

var fillInputCoordinates = function (input, coordinates) {
  input.value = coordinates.x + ', ' + coordinates.y;
};

var start = function () {
  var objects = generateData();
  insertCardElements(objects);
  insertMapPinElements(objects);
  deactivateFormInputs();

  var inputAddress = document.querySelector('#address');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var mapPinElements = document.querySelectorAll('.map__pin');
  var mapCardElements = document.querySelectorAll('.map__card');

  var onMainPinMouseup = function () {
    activateFormInputs();

    for (var i = 0; i < mapPinElements.length; i++) {
      mapPinElements[i].classList.remove('hidden');
    }

    mapPinMainElement.removeEventListener('mouseup', onMainPinMouseup);
  };

  fillInputCoordinates(inputAddress, getPinPosition(mapPinMainElement));

  mapPinMainElement.addEventListener('mouseup', onMainPinMouseup);

  var onMapCardClick = function (e) {
    if (e.target.classList.contains('popup__close')) {
      e.target.parentElement.classList.add('hidden');
    }
  }

  var showCard = function (i) {
    mapCardElements[i].classList.remove('hidden');
  }

  var hideAllMapCards = function () {
    for (var i = 0; i < mapCardElements.length; i++) {
      mapCardElements[i].classList.add('hidden');
    }
  }


  // 0 - главная метка
  for (var j = 1; j < mapPinElements.length; j++) {
    (function (index) {
      mapPinElements[j].addEventListener('click', function () {
        hideAllMapCards();
        showCard(index);
      })
    })(j - 1)
  }

  for (var k = 0; k < mapCardElements.length; k++) {
    mapCardElements[k].addEventListener('click', onMapCardClick);
  }

};

start();
