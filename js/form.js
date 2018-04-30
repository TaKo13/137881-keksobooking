'use strict';

(function() {
  var ROOMS_TO_CAPACITY = {
    '1': [0, 1, 3],
    '2': [0, 3],
    '3': [3],
    '100': [0, 1, 2]
  };
  var TYPES_MIN_PRICES = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

  var adForm = document.querySelector('.ad-form');
  var housingTypeSelect = adForm.elements.namedItem('type');
  var housingPriceInput = adForm.elements.namedItem('price');
  var timeInInpun = adForm.elements.namedItem('timein');
  var timeOutInpun = adForm.elements.namedItem('timeout');
  var roomsSelect = adForm.elements.namedItem('rooms');
  var capacitySelect = adForm.elements.namedItem('capacity');
  var inputAddress = adForm.elements.namedItem('address');
  var fieldsets = adForm.querySelectorAll('fieldset');
  var submitButton = adForm.querySelector('.ad-form__submit');
  var resetButton = adForm.querySelector('.ad-form__reset');

  window.fillInputCoordinates = function(coordinates) {
    inputAddress.value = coordinates.x + ', ' + coordinates.y;
  };

  var onResetClick = function(e) {
    e.preventDefault();

    adForm.reset();
    window.deactivate();
  };

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

  // Меняем значение плейсхолдера и мин.цены
  var changePriceInput = function(price) {
    housingPriceInput.setAttribute('placeholder', price);
    housingPriceInput.setAttribute('min', price);
  };

  var onHousingTypeChange = function(e) {
    changePriceInput(TYPES_MIN_PRICES[e.target.value]);
  };

  // Синхронизируем время заезда/выезда
  var onTimeInChange = function(e) {
    timeOutInpun.value = e.target.value;
  };
  var onTimeOutChange = function(e) {
    timeInInpun.value = e.target.value;
  };

  var onSuccessSubmit = function(e) {
    var successElement = document.querySelector('.success');

    successElement.classList.remove('hidden');

    setTimeout(function() {
      successElement.classList.add('hidden');
    }, 2000);

    adForm.reset();
    window.deactivate();
  };

  var onErrorSubmit = function(errorMessage) {
    window.showErrorMessage(errorMessage);
  };

  var onFormSubmit = function(e) {
    e.preventDefault();
    window.postData(new FormData(adForm), onSuccessSubmit, onErrorSubmit);
  };

  roomsSelect.addEventListener('change', onRoomSelectChange);

  housingTypeSelect.addEventListener('change', onHousingTypeChange);

  window.disableForm = function() {
    adForm.classList.add('ad-form--disabled');

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', '');
    }
  };

  window.enableForm = function() {
    adForm.classList.remove('ad-form--disabled');

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }
  };

  timeInInpun.addEventListener('change', onTimeInChange);
  timeOutInpun.addEventListener('change', onTimeOutChange);
  adForm.addEventListener('submit', onFormSubmit);
  resetButton.addEventListener('click', onResetClick);
})();
