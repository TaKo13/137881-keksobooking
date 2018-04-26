'use strict';

(function() {
  var ROOMS_TO_CAPACITY = {
    '1': [0, 1, 3],
    '2': [0, 3],
    '3': [3],
    '100': [0, 1, 2]
  };

  var adForm = document.querySelector('.ad-form');
  var housingTypeSelect = adForm.elements.namedItem('type');
  var housingPriceInput = adForm.elements.namedItem('price');
  var timeInInpun = adForm.elements.namedItem('timein');
  var timeOutInpun = adForm.elements.namedItem('timeout');
  var roomsSelect = adForm.elements.namedItem('rooms');
  var capacitySelect = adForm.elements.namedItem('capacity');

  var onAdFormReset = function(e) {
    e.preventDefault();
    deactivateForm();
  };

  adForm.addEventListener('reset', onAdFormReset);

  // Поле «Кол-во комнат» синхронизировано с полем «Кол-во мест»
  var onRoomSelectChange = function(e) {
    var roomsNumber = e.target.value;
    var indexesToDisable = ROOMS_TO_CAPACITY[roomsNumber];

    for (var i = 0; i < capacitySelect.length; i++) {
      capacitySelect.options[i].disabled = false;

      if (indexesToDisable.includes(i)) {
        capacitySelect.options[i].disabled = true;
      }
    }
  };

  roomsSelect.addEventListener('change', onRoomSelectChange);

  // Меняем значение плейсхолдера и мин.цены
  var changePriceInput = function(price) {
    housingPriceInput.setAttribute('placeholder', price);
    housingPriceInput.setAttribute('min', price);
  };

  var onHousingTypeChange = function(e) {
    changePriceInput(TYPES_MIN_PRICES[e.target.value]);
  };

  housingTypeSelect.addEventListener('change', onHousingTypeChange);

  // Синхронизируем время заезда/выезда
  var onTimeInChange = function(e) {
    timeOutInpun.value = e.target.value;
  };
  var onTimeOutChange = function(e) {
    timeInInpun.value = e.target.value;
  };

  timeInInpun.addEventListener('change', onTimeInChange);
  timeOutInpun.addEventListener('change', onTimeOutChange);
})();
