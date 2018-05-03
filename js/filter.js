'use strict';

(function() {
  var filterForm = document.querySelector('.map__filters');
  var housingTypeSelect = filterForm.elements.namedItem('housing-type');

  var filterData = function(data, filterKey) {
    var result = data;

    return result
      .filter(function(item) {
        return (
          housingTypeSelect.value === item.offer.type ||
          housingTypeSelect.value === 'any'
        );
        // .filter();
      })
      .slice(0, 5);
  };

  var render = function(data) {
    window.card.insertCardElements(data);
    window.insertMapPinElements(data);
  };

  var onFilterChange = function() {
    render(filterData(window.data));
  };

  filterForm.addEventListener('change', onFilterChange);

  window.render = render;
  window.filterData = filterData;
})();
