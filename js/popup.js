'use srtict';

(function() {
  window.showErrorMessage = function(errorMessage) {
    var fade = document.createElement('div');
    var popup = document.createElement('div');
    var okButton = document.createElement('button');

    popup.classList.add('error-popup');
    fade.classList.add('error-fade');

    popup.textContent = errorMessage;
    okButton.textContent = 'OK';
    popup.appendChild(okButton);
    fade.appendChild(popup);

    var onClickHandler = function(e) {
      if (e.target === fade || e.target === okButton) {
        document.removeEventListener('click', onClickHandler);
        document.body.removeChild(fade);
      }
    };

    document.body.appendChild(fade);
    document.addEventListener('click', onClickHandler);
  };
})();
