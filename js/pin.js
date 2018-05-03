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

    return mapPinElement;
  };

  var mapPinElements = document.querySelectorAll('.map__pin');

  var removePins = function() {
    if (!mapPinElements) {
      return;
    }

    for (var i = 1; i < mapPinElements.length; i++) {
      mapPinElements[i].remove();
    }
  };

  window.removePins = removePins;

  window.insertMapPinElements = function(objects) {
    removePins();

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

    mapPinElements = document.querySelectorAll('.map__pin');

    // 0 - главная метка
    // Показываем нужную карточку по клику на пин
    for (var j = 1; j < mapPinElements.length; j++) {
      (function(index) {
        mapPinElements[j].addEventListener('keydown', function(e) {
          window.card.showMapCardOnEnter(e, index);
        });
        mapPinElements[j].addEventListener('click', function() {
          window.card.hideAllMapCards();
          window.card.showCard(index);
        });
      })(j - 1);
    }
  };
})();
