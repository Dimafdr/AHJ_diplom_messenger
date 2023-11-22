// eslint-disable-next-line import/no-cycle

import validationCoord from '../../validation/validation_coord.js';

export default class PopUpGPS {
  constructor() {
    this.container = document.querySelector('.container');
  }

  // eslint-disable-next-line class-methods-use-this
  getHTMLPopUp() { // получаем html разметку окна при отсутствии данных GPS
    return `
    <form class="formGps" action="">
    <h1 class="form_NameGps">что то пошло не так</h1>
    <section class="textmessage">
      <p>
        К сожалению нам не удалось определить ваше местоположение, пожалуйста,
        дайте разрешение на использование геолокации, либо введите координаты
        вручную.
      </p>
      <p>Широта и долгота через запятую</p>
    </section>
    <footer class="form_footerGps">
      <input placeholder = "[51.12345, - 50.12345]"class="coordinatesText form_inputGps" name="form_input" type="text">
      <button type="buttonGps" class="form_cancell buttonGps">Отмена</button>
      <button type="submit" class="form_submitBt buttonGps">Ok</button>
    </footer>
  </form>`;
  }

  renderingPopUp() { // рендерит окно ручного ввода координат
    return new Promise((resolve) => {
      const containerForm = document.createElement('div');
      containerForm.className = 'popupGps';
      this.container.append(containerForm);
      containerForm.innerHTML = this.getHTMLPopUp();
      const popUpButtons = containerForm.querySelectorAll('button');
      for (const element of popUpButtons) {
        element.addEventListener('click', (event) => {
          event.preventDefault();
          this.onClickPopUp(event).then((coordinates) => {
            resolve(coordinates); // передаем в GPS.getСoordinates() координаты
          });
        });
      }
    });
  }

  onClickPopUp(event) { // логика обработки вариантов ввода координат вручную
    const { target } = event;
    // eslint-disable-next-line no-shadow
    const promiseCoordinates = new Promise((resolve) => {
      if (target.classList.contains('form_cancell')) {
        // if (inputForm.stream) { // если стрим есть значит пупап вызван при записи аудио
        document.querySelector('.coordinatesText').value = '';
        this.closepopUp();
        resolve('Координаты скрыты пользователем');
      }
      if (target.classList.contains('form_submitBt')) {
        const inputValue = document.getElementsByName('form_input');
        const objCoord = validationCoord(inputValue[0].value);
        if (objCoord) {
          document.querySelector('.coordinatesText').value = '';
          this.closepopUp();
          const coorgString = `[${objCoord.latitude}, ${objCoord.longitude}]`;
          resolve(coorgString);
        } else {
        // eslint-disable-next-line no-alert
          alert('Координаты введены в неверном формате, введите координаты еще раз');
          inputValue[0].value = '';
        }
      }
    });
    return promiseCoordinates;
  }

  // eslint-disable-next-line class-methods-use-this
  closepopUp() {
    document.querySelector('.popupGps').remove();
  }
}
