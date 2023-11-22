/* eslint-disable no-param-reassign */
/* eslint-disable no-self-assign */
// eslint-disable-next-line import/no-cycle
import {
  messenger, inputForm, message, lazyLoadingMessages,
} from '../../app.js';

export default class PopUp {
  constructor(container, messageManagement) {
    if (typeof container === 'string') {
      this.container = document.querySelector('.container');
    } else this.container = container;
    this.messageManagement = messageManagement;
  }

  // eslint-disable-next-line class-methods-use-this
  getHTMLPopUpStart() { // возвращает html разметку стартового окна
    const HTML = `
        <form class="form choosePseudonym" action="">
          <h1 class="form_Name">Выберите псевдоним</h1>
          <p>
          <textarea class="form_input form_inputNickName" type="text" id="content" name='NickName'></textarea>
          </p>
          <footer class="form_footer">
            <button type="button" class="form_continue button">Продолжить</button>
          </footer>
        </form>
    `;
    return HTML;
  }

  renderingPopUpStart() { // отрисовывает окно регистрации и ставит обработчик 'klick'
    const containerForm = document.createElement('div');
    containerForm.className = 'popup';
    this.container.append(containerForm);
    containerForm.innerHTML = this.getHTMLPopUpStart();
    const forma = containerForm.querySelector('.form');
    forma.addEventListener('click', (event) => {
      // event.preventDefault();
      this.onClickPopUpStart(event);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getHTMLMessenger() { // возвращает html разметку окна мессенджера
    const HTML = `  
      <div class="activeUsers">
        <ul class="usersList"></ul>
      </div>
      <form class="form messengerWindow" action="">
        <div class ="messages" id="scrollArea"></div>
        <footer class="form_footer">
        <textarea class="messageInput dropzone" type="text" placeholder="Введите сообщение и нажмите Enter
        или перетащите файл" name='messageText'></textarea>
          <div class="input__wrapper">
            <input name="file" type="file" id="input__file" class="input input__file" accept="image/png, image/jpeg, audio/mpeg, video/mp4, video/mpeg">
            <label for="input__file" class="input__file-button buttonForm"></label>
          </div>
        <input class="postAudioRecording buttonForm" type="button"/>
        </footer>
      </form>`;
    return HTML;
  }

  renderingMessenger() { // рендерит окно мессенджера
    this.container.innerHTML = this.getHTMLMessenger();
  }

  // срабатывает при входе в мессенджер. Рендерит подключенных пользователей и список сообщений
  openMessenger(activeUsers, userName, messages = []) {
    // Прокинул в lazyLoadingMessages массив сообщений
    // для дальнейшего рендеринга в мессенджере при прокрутке вверх
    lazyLoadingMessages.messages = messages;
    this.renderingMessenger();
    this.usersList = document.querySelector('.usersList');
    activeUsers.forEach((user) => {
      let html = null;
      if (user !== userName) {
        html = `<li class="user">${user}</li>`;
      } else {
        html = '<li class="user userYou" >You</li>';
      }
      this.usersList.innerHTML += html;
    });

    this.inputFormEl = document.querySelector('.messageInput');
    this.form = document.querySelector('.form');
    this.addEventListenerMessenger();
    this.lastMessages = [];
    // выводим в мессенджере последние 5 сообщений
    if (messages.length === 0) {
      return;
    }
    if (messages.length > 5) {
      this.lastMessages = messages.splice(-5, 5);
      // прокинул массив сообщений в lazyLoadingMessages для отрисовки по частям
      lazyLoadingMessages.allMessages = messages;
    }
    if (messages.length <= 5) {
      this.lastMessages = messages;
    }
    for (let i = 0; i <= this.lastMessages.length - 1; i += 1) {
      const traceable = i === 0 ? 'traceable' : null; // если элемент последний в серии добавить ему класс traceable
      this.lastMessages[i].traceable = traceable;
      message.printMessage(this.lastMessages[i], 'toTheEnd');
    }
    if (messages.length > 5) {
      lazyLoadingMessages.lazyLoadingMessage(document.querySelectorAll('.traceable'));
    }
  }

  addEventListenerMessenger() {
    this.addFileInputEl = document.querySelector('.input__file'); // кнопка добавления файла
    this.form.addEventListener('click', (e) => { // обработаем клик на форме !!!!
      inputForm.eventHandler(e);
      this.messageManagement.eventHandlerClick(e);
    });
    this.inputFormEl.addEventListener('keyup', (e) => inputForm.eventHandler(e));
    this.inputFormEl.addEventListener('drop', (e) => {
      e.preventDefault();
      this.inputFormEl.style.borderWidth = '1px';
      const { files } = e.dataTransfer;
      inputForm.createMessageFile(files);
    });
    this.inputFormEl.addEventListener('dragenter', () => {
      this.inputFormEl.style.borderWidth = '2px';
    });
    this.inputFormEl.addEventListener('dragleave', () => {
      this.inputFormEl.style.borderWidth = '1px';
    });
    this.addFileInputEl.addEventListener('change', () => {
      const addFileInput = document.querySelector('.input__file');
      const { files } = addFileInput;
      inputForm.createMessageFile(files);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onClickPopUpStart(event) { // обрабатывает клик по кнопке входа в форме регистрации
    const { target } = event;
    if (target.classList.contains('form_continue')) messenger.signIn(event);
  }

  // eslint-disable-next-line class-methods-use-this
  closepopUp() {
    if (document.querySelector('.popup')) {
      document.querySelector('.popup').remove();
    }
  }
}
