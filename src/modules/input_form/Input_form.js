/* eslint-disable no-await-in-loop */

/* eslint-disable no-alert */
export default class InputForm {
  constructor(argsInputForm) {
    this.messageApi = argsInputForm.message;
    this.gps = argsInputForm.gps;
    this.popUpGps = argsInputForm.popUpGps;
    this.timer = argsInputForm.timer;
    this.ws = argsInputForm.ws;
    this.popUpAddFile = argsInputForm.popUpAddFile;
    this.lLM = argsInputForm.lazyLoadingMessages;
  }

  // обрабатывает клик по кнопке записи аудио и при нажатии enter
  // при отправке текстового сообщения
  eventHandler(e) {
    this.textarea = document.querySelector('.messageInput');
    this.soundRecordingButton = document.querySelector('.postAudioRecording');
    const { target, key } = e;
    if (target === this.textarea && key === 'Enter') {
      const textMessage = this.textarea.value;
      document.querySelector('.messageInput').value = '';
      this.createTextMessage(textMessage);
      return;
    }
    if (target === this.soundRecordingButton) {
      this.soundRecord();
    }
  }

  static getData() {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString().slice(0, -3);
    const dateMessage = `${date} ${time}`;
    return dateMessage;
  }

  async getObjMessage(action, message, typeMes, filesName) {
    return {
      action,
      login: this.ws.login,
      message,
      dateMessage: InputForm.getData(),
      coordinates: await this.gps.getСoordinates(),
      typeMes,
      filesName,
    };
  }

  async soundRecord() { // записывает аудиосообщение
    if (!navigator.mediaDevices) {
      alert('Ваше устройство не поддерживаетс запись звука. Зайдите в приложение с другого устройства');
      return;
    }
    this.modificationForm('record'); // изменяет вид формы при записи аудио
    const constraints = {
      audio: true,
      video: false,
    };
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.recorder = new MediaRecorder(this.stream);
      const chunks = [];
      this.recorder.addEventListener('start', () => {
        this.timer.startTimer();
      });
      this.recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data);
      });
      this.recorder.addEventListener('stop', async () => {
        this.stopEventHandlerRecordAudio(chunks);
      });
      this.recorder.start();
    } catch (e) {
      this.modificationForm('text');
      alert('Вы не дали разрешения для записи аудио. Оставьте текстовое сообщение');
    }
  }

  async stopEventHandlerRecordAudio(chunks) {
    this.modificationForm('text');
    if (this.recordingResult === 'message') {
      this.stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const dataURLBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
      });
      const objMessageData = await this.getObjMessage('postMessage', dataURLBase64, 'audioRecord', null);
      this.messageApi.printMessage(objMessageData, 'toTheEnd');
      this.ws.sendMessage(JSON.stringify(objMessageData));
    } else {
      // eslint-disable-next-line no-param-reassign
      chunks.length = 0;
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  async createTextMessage(text) {
    const modifyTextMessage = this.checkMessageForLink(text);
    this.popUpGps.text = modifyTextMessage;
    const objMessageData = await this.getObjMessage('postMessage', modifyTextMessage, 'text', null);
    this.messageApi.printMessage(objMessageData, 'toTheEnd');
    this.ws.sendMessage(JSON.stringify(objMessageData));
  }

  async createMessageFile(files) {
    // Ждем результата действия пользователя по отправке файла. кликнет "отправить", вернется файл
    const resultPopUpAddFile = await this.popUpAddFile.renderingPopUp(files);
    if (resultPopUpAddFile === 'canсell') { // пользователь отменил отправку файла
      document.querySelector('.popup').remove();
    } else { // пользователь согласился отправить файл
      document.querySelector('.popup').remove();
      // добавить отправку на сервер
      const arrURLBase64 = [];
      let typeFile = null;
      for (const file of resultPopUpAddFile) {
        typeFile = file.type;
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error);
        });
        arrURLBase64.push(base64);
      }
      const typeFileName = typeFile.match(/\w*(?=\/)/i)[0]; // получим image, audio или video
      const { filesName } = this.popUpAddFile;
      const objMessageData = await this.getObjMessage('postMessage', arrURLBase64, typeFileName, filesName);
      this.messageApi.printMessage(objMessageData, 'toTheEnd');

      this.ws.sendMessage(JSON.stringify(objMessageData));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  checkMessageForLink(messageText) { // проверяет сообщение на наличие ссылки
    // eslint-disable-next-line no-useless-escape
    const regexp = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?/igm;
    return messageText.replace(regexp, (str) => `<a href = "${str}">${str}</a>`);
  }

  modificationForm(state) { // меняет вид формы под запись аудио и обратно для ввода текста
    if (state === 'record') {
      this.soundRecordingButton.remove();
      const htmlAudioRecord = `
      <input class="okAudioRecording buttonForm" type="button" />
      <div class="timer">00:00</div>
      <input class="cansellAudioRecording buttonForm" type="button" />
      `;
      this.footerForm = document.querySelector('.form_footer');
      this.footerForm.innerHTML += htmlAudioRecord;
      this.buttonOk = this.footerForm.querySelector('.okAudioRecording');
      this.buttonCansell = this.footerForm.querySelector('.cansellAudioRecording');
      this.buttonOk.addEventListener('click', () => {
        this.recordingResult = 'message';
        this.recorder.stop();
      });
      this.buttonCansell.addEventListener('click', () => {
        this.recordingResult = 'cansellMessage';
        this.recorder.stop();
      });
    }
    if (state === 'text') {
      this.timer.stopTimer();
      this.buttonOk.remove();
      this.buttonCansell.remove();
      this.footerForm.querySelector('.timer').remove();
      const buttonRecordHTML = '<input class="postAudioRecording buttonForm" type="button" />';
      this.footerForm.innerHTML += buttonRecordHTML;
      this.soundRecordingButton = document.querySelector('.postAudioRecording');
      this.soundRecordingButton.addEventListener('click', (e) => this.eventHandler(e));
    }
  }
}
