'use strict';
(function () {
  var template = document.querySelector('template');

  var createMapPin = function (locationX, locationY, avatar, title) {
    var mapPinElement = template.content
        .querySelector('.map__pin')
        .cloneNode(true);

    mapPinElement.style =
      'left:' + locationX + 'px;' + 'top:' + locationY + 'px';
    mapPinElement.querySelector('img').src = avatar;
    mapPinElement.querySelector('img').alt = title;

    return mapPinElement;
  };

  var mapPinElements;

  var removePins = function () {
    if (!mapPinElements) {
      return;
    }

    for (var i = 0; i < mapPinElements.length; i++) {
      mapPinElements[i].remove();
    }
  };

  var insertMapPinElements = function (objects) {
    var fragment = document.createDocumentFragment();

    removePins();

    for (var j = 0; j < objects.length; j++) {
      fragment.appendChild(
          createMapPin(
              objects[j].location.x,
              objects[j].location.y,
              objects[j].author.avatar,
              objects[j].title
          )
      );
    }

    document.querySelector('.map__pins').appendChild(fragment);

    mapPinElements = document.querySelectorAll('.map__pin:not(:first-of-type)');

    [].forEach.call(mapPinElements, function (pinElement, index) {
      pinElement.addEventListener('click', function () {
        window.card.showCard(index);
      });
    });
  };

  window.pin = {
    removePins: removePins,
    insertMapPinElements: insertMapPinElements
  };
})();
