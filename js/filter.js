'use strict';

(function() {
  var filterForm = document.querySelector('.map__filters');
  var housingTypeSelect = filterForm.elements.namedItem('housing-type');
  var housingRoomsSelect = filterForm.elements.namedItem('housing-rooms');
  var housingGuestsSelect = filterForm.elements.namedItem('housing-guests');
  var housingPriceSelect = filterForm.elements.namedItem('housing-price');
  var housingFeaturesInputs = filterForm.elements.namedItem('features');

  var filterData = function(data, filterKey) {
    var result = data;

    return result
      .filter(function(item) {
        return (
          housingTypeSelect.value === item.offer.type ||
          housingTypeSelect.value === 'any'
        );
      })
      .filter(function(item) {
        return (
          Number(housingRoomsSelect.value) === item.offer.rooms ||
          housingRoomsSelect.value === 'any'
        );
      })
      .filter(function(item) {
        return (
          Number(housingGuestsSelect.value) === item.offer.guests ||
          housingGuestsSelect.value === 'any'
        );
      })
      .filter(function(item) {
        return (
          housingPriceSelect.value === 'any' ||
          (housingPriceSelect.value === 'low' && item.offer.price < 10000) ||
          (housingPriceSelect.value === 'middle' &&
            item.offer.price >= 10000 &&
            item.offer.price < 50000) ||
          (housingPriceSelect.value === 'high' && item.offer.price < 50000)
        );
      })
      .filter(function(item) {
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
      })
      .slice(0, 5);
  };

  var render = function(data) {
    window.card.insertCardElements(data);
    window.pin.insertMapPinElements(data);
  };

  var onFilterChange = window.debounce(function() {
    render(filterData(window.data));
  }, 500);

  filterForm.addEventListener('change', onFilterChange);

  window.filter = {
    render: render,
    filterData: filterData
  };
})();
