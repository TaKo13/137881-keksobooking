'use strict';
(function() {
  var template = document.querySelector('template');
  // Создается элемент метки
  var createMapPin = function(locationX, locationY, avatar, title) {
    var mapPinElement = template.content
      .querySelector('.map__pin')
      .cloneNode(true);

    mapPinElement.style =
      'left:' + locationX + 'px;' + 'top:' + locationY + 'px';
    mapPinElement.querySelector('img').src = avatar;
    mapPinElement.querySelector('img').alt = title;
    mapPinElement.classList.add('hidden');

    return mapPinElement;
  };

  // Здесь заполняются метки 📍
  window.insertMapPinElements = function(objects) {
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
})();
