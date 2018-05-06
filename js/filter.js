'use strict';

(function() {
  var MAX_VISIBLE_OFFERS = 5;
  var LOWER_BOUNDARY_OF_MID_PRICE = 10000;
  var HIGH_BOUNDARY_OF_MID_PRICE = 50000;

  var filterForm = document.querySelector('.map__filters');
  var housingTypeSelect = filterForm.elements.namedItem('housing-type');
  var housingRoomsSelect = filterForm.elements.namedItem('housing-rooms');
  var housingGuestsSelect = filterForm.elements.namedItem('housing-guests');
  var housingPriceSelect = filterForm.elements.namedItem('housing-price');
  var housingFeaturesInputs = filterForm.elements.namedItem('features');

  var isEqual = function(selectValue, itemValue) {
    return selectValue === itemValue + '' || selectValue === 'any';
  };

  var filterByRoomsNumber = function(item) {
    return isEqual(housingRoomsSelect.value, item.offer.rooms);
  };

  var filterByType = function(item) {
    return isEqual(housingTypeSelect.value, item.offer.type);
  };

  var filterByGuestsNumber = function(item) {
    return isEqual(housingGuestsSelect.value, item.offer.guests);
  };

  var filterByPrice = function(item) {
    return (
      housingPriceSelect.value === 'any' ||
      (housingPriceSelect.value === 'low' &&
        item.offer.price < LOWER_BOUNDARY_OF_MID_PRICE) ||
      (housingPriceSelect.value === 'middle' &&
        item.offer.price >= LOWER_BOUNDARY_OF_MID_PRICE &&
        item.offer.price < HIGH_BOUNDARY_OF_MID_PRICE) ||
      (housingPriceSelect.value === 'high' &&
        item.offer.price > HIGH_BOUNDARY_OF_MID_PRICE)
    );
  };

  var filterByFeatures = function(item) {
    var checkedFeatures = [].filter.call(housingFeaturesInputs, function(
      element
    ) {
      return element.checked;
    });

    for (var i = 0; i < checkedFeatures.length; i++) {
      if (item.offer.features.indexOf(checkedFeatures[i].value) === -1) {
        return false;
      }
    }

    return true;
  };

  var filterData = function(data, filterKey) {
    var result = data;

    return result
      .filter(filterByType)
      .filter(filterByRoomsNumber)
      .filter(filterByGuestsNumber)
      .filter(filterByPrice)
      .filter(filterByFeatures)
      .slice(0, MAX_VISIBLE_OFFERS);
  };

  var render = function() {
    var data = filterData(window.data);

    window.card.insertCardElements(data);
    window.pin.insertMapPinElements(data);
  };

  var onFilterChange = window.debounce(render, 500);

  filterForm.addEventListener('change', onFilterChange);

  window.filter = {
    render: render
  };
})();
