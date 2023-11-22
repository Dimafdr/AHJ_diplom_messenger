// eslint-disable-next-line import/no-cycle
import { inputForm } from '../../app.js';

export default class Message {
  constructor(messages, gps, popUpAddFile) {
    this.messages = messages;
    this.gps = gps;
    this.popUpAddFile = popUpAddFile;
  }

  getUserName(login) {
    if (login === this.login) {
      return 'You';
    }
    return login;
  }

  printMessage(objMessageData, place) {
    this.messagesContaner = document.querySelector('.messages');
    const {
      login, coordinates, dateMessage, typeMes, filesName, message, traceable,
    } = objMessageData;

    if (typeMes === 'text') {
      this.HTML = this.createTextMessageHTML(message, coordinates, login, dateMessage);
    }
    if (typeMes === 'audioRecord') {
      this.HTML = this.createAudioMessageHTML(message, coordinates, login, dateMessage);
    }
    if (typeMes === 'image'
    || typeMes === 'audio'
    || typeMes === 'video') {
      this.HTML = this.createFileMessageHTML(message, coordinates,
        login, dateMessage, typeMes, filesName);
    }
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    if (login === this.login) messageEl.classList.add('myMessage');
    if (traceable) messageEl.classList.add('traceable');
    messageEl.innerHTML = this.HTML;
    if (place === 'toTheEnd') {
      this.messagesContaner.append(messageEl);
      this.messagesContaner.scrollTop = 9999999999;
    }
    if (place === 'toTheBegining') {
      this.messagesContaner.prepend(messageEl);
    }
    this.assignHandler();
  }

  createAudioMessageHTML(dataURLBase64, coordinates, login, date) {
    let userName = null;
    // eslint-disable-next-line no-unused-expressions
    userName = this.getUserName(login);
    inputForm.stream = null;
    return `
    <div class="messageData">${userName}, ${date}</div>
        <div class="messagCont">
          <audio controls class="message_audio" src="${dataURLBase64}"></audio>
          <div class="message_geoposition">${coordinates}
          <button class="message__showPosition"></button>
          </div>
    </div>`;
  }

  createTextMessageHTML(text, coordinates, login, date) {
    let userName = null;
    // eslint-disable-next-line no-unused-expressions
    userName = this.getUserName(login);
    document.querySelector('.messageInput').value = '';

    return `<div class="messageData">${userName}, ${date}</div>
          <div class="messagCont">
            <p class="message_text">${text}</p>
            <div class="message_geoposition">${coordinates}
            <button class="message__showPosition"></button>
          </div>
        </div>`;
  }

  createFileMessageHTML(arrURLBase64, coordinates, login, date, typeFileName, filesName) {
    const tag = typeFileName === 'image' ? 'img' : typeFileName;
    let userName = null;
    // eslint-disable-next-line no-unused-expressions
    userName = this.getUserName(login);
    return `
    <div class="messageData">${userName}, ${date}</div>
        <div class="messagCont">
        <a download="${filesName}" href='${arrURLBase64[0]}' id="link">Скачать ${filesName}</a>
          <${tag} controls class="message_${tag}" src="${arrURLBase64[0]}"></${tag}>
          <div class="message_geoposition">${coordinates}
          <button class="message__showPosition"></button>
          </div>
    </div>`;
  }

  assignHandler() { // обработка клика по кнопке "глаз"
    const lastMessage = this.messagesContaner.lastElementChild;
    const elementHandl = lastMessage.querySelector('.message__showPosition');
    elementHandl.addEventListener('click', (e) => {
      e.preventDefault();
      this.gps.showPosition();
    });
  }
}
