'use strist';

(function() {
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

  // Заполняются карточки, вставка на страницу в блок map
  window.insertCardElements = function(objects) {
    for (var k = 0; k < objects.length; k++) {
      var fragment = document.createDocumentFragment();
      var map = document.querySelector('.map');
      var child = map.querySelector('.map__filters-container');

      fragment.appendChild(createMapCard(objects[k]));
      map.insertBefore(fragment, child);
    }
  };
})();
