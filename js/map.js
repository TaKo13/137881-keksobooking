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

var getRandomNumber = function(min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomItemFromArray = function(array) {
  var index = Math.floor(Math.random() * array.length);
  return array[index];
};

var getRandomCopy = function(array) {
  return shuffleArray(array).slice(0, getRandomNumber(1, array.length));
};

// Перемешиваем массив
var shuffleArray = function(array) {
  var compareRandom = function(a, b) {
    return Math.random() - 0.5;
  };
  return array.sort(compareRandom);
};

// Переключаем карту в активное состояние
document.querySelector('.map').classList.remove('map--faded');

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
      features: getRandomCopy(FEATURES),
      description: '',
      photos: shuffleArray(PHOTOS)
    },
    location: {
      x: locationByX,
      y: locationByY
    }
  });
}

var mapCardTemplate = document.querySelector('template');

// Создается элемент
var createMapPin = function(locationX, locationY, avatar, title) {
  var mapPinElement = mapCardTemplate.content
    .querySelector('.map__pin')
    .cloneNode(true);

  mapPinElement.style = 'left:' + locationX + 'px;' + 'top:' + locationY + 'px';
  mapPinElement.querySelector('img').src = avatar;
  mapPinElement.querySelector('img').alt = title;

  return mapPinElement;
};

// Здесь заполняются пины 📍
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
  // Здесь пины вставляются appendChild'ом
  document.querySelector('.map__pins').appendChild(fragment);
}

var createPhotos = function(photos, photosContainer) {
  var img = photosContainer.querySelector('.popup__photo');

  for (var i = 0; i < photos.length; i++) {
    var clonedImg = img.cloneNode();
    clonedImg.src = photos[i];
    photosContainer.appendChild(clonedImg);
  }
  // Удаляем img
  photosContainer.removeChild(img);
};

var createFeatures = function(features, featuresContainer) {
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
var createMapCard = function(object) {
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

  return mapCardElement;
};

// Заполняются карточки
for (var k = 0; k < objects.length; k++) {
  var fragment = document.createDocumentFragment();
  var map = document.querySelector('.map');
  var child = map.querySelector('.map__filters-container');

  fragment.appendChild(createMapCard(objects[k]));
  map.insertBefore(fragment, child);
}
