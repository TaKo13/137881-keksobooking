'use strict';

(function() {
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

  var TYPES_MIN_PRICES = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
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

  var getShuffledCopyWithRandomLength = function(array) {
    return getShuffledArrayCopy(array).slice(
      0,
      getRandomNumber(1, array.length)
    );
  };

  var getShuffledArrayCopy = function(array) {
    var compareRandom = function(a, b) {
      return Math.random() - 0.5;
    };
    return array.slice().sort(compareRandom);
  };

  window.generateData = function() {
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
})();
