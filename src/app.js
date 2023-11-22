/* eslint-disable import/no-cycle */
import PopUp from './modules/pop_up/pop_up.js';
import PopUpGps from './modules/pop_up/pop_up_gps.js';
import PopUpAddFile from './modules/pop_up/pop_up_add_file.js';
import LazyLoadingMessages from './modules/lazy_loading/lazy_loading_messages.js';
import InputForm from './modules/input_form/Input_form.js';
import Messenger from './modules/messenger/messenger.js';
import Ws from './modules/ws/ws.js';
import Gps from './modules/gps/gps.js';
import Message from './modules/message/message.js';
import Timer from './modules/timer/timer.js';
import MessageManagement from './modules/message/message_management.js';

const messagesEl = document.querySelector('.messages');
const popUpAddFile = new PopUpAddFile();
const timer = new Timer();
const popUpGps = new PopUpGps();
const messageManagement = new MessageManagement();
const popUp = new PopUp('container', messageManagement);
const ws = new Ws(popUp);
const lazyLoadingMessages = new LazyLoadingMessages(ws);
const gps = new Gps(popUpGps);
const messenger = new Messenger(popUp, ws);
const message = new Message(messagesEl, gps, popUpAddFile);
const argsInputForm = {
  message, gps, popUpGps, timer, ws, popUpAddFile, lazyLoadingMessages,
};
const inputForm = new InputForm(argsInputForm);

export {
  popUp, messenger, ws, inputForm, message, lazyLoadingMessages, gps,
};
