'use strist';

(function() {
  var ESC_KEY_CODE = 27;
  var ENTER_KEY_CODE = 13;

  var TYPES_DICT = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var template = document.querySelector('template');

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

  var createPhotos = function(photos, photosContainer) {
    var img = photosContainer.querySelector('.popup__photo');

    for (var i = 0; i < photos.length; i++) {
      var clonedImg = img.cloneNode();
      clonedImg.src = photos[i];
      photosContainer.appendChild(clonedImg);
    }

    photosContainer.removeChild(img);
  };

  // Создаются карточки , далее циклом заполнить
  var createMapCard = function(object) {
    var mapCardElement = template.content
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
  var mapCardElements = document.querySelectorAll('.map__card');

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

  var onMapCardClick = function(e) {
    if (e.target.classList.contains('popup__close')) {
      e.target.parentElement.classList.add('hidden');
    }
  };

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

  // Заполняются карточки, вставка на страницу в блок map
  var insertCardElements = function(objects) {
    removeMapCards();

    for (var k = 0; k < objects.length; k++) {
      var fragment = document.createDocumentFragment();
      var map = document.querySelector('.map');
      var child = map.querySelector('.map__filters-container');

      fragment.appendChild(createMapCard(objects[k]));
      map.insertBefore(fragment, child);
    }

    mapCardElements = document.querySelectorAll('.map__card');

    for (var k = 0; k < mapCardElements.length; k++) {
      mapCardElements[k].addEventListener('click', onMapCardClick);
    }
  };

  window.card = {
    showCard: showCard,
    showMapCardOnEnter: onEnterKeyDown,
    hideAllMapCards: hideAllMapCards,
    removeMapCards: removeMapCards,
    insertCardElements: insertCardElements
  };
})();
