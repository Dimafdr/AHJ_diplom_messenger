export default class MessageManagement {
  eventHandlerClick(e) {
    // если кликаем по ссылке в сообщении то сообщение не выделяется
    const { target } = e;
    if (target.matches('a')) {
      return;
    }
    if (target.closest('.messages')) {
      this.highlightMessage(target);
      this.addButtonFixMessage(target);
      return;
    }
    if (target.closest('.fixMessageButton')) {
      this.fixMessage(this.messageEl);
      return;
    }
    if (target.closest('.unFixMessageButton')) {
      const messageElHiding = document.querySelector('.messageHiding');
      this.unFixMessage(messageElHiding);
    }
  }

  highlightMessage(target) {
    this.messageEl = target.closest('.message');
    this.highlightMessageEl = document.querySelector('.highlightMessage');
    if (!this.messageEl && this.highlightMessageEl) {
      this.highlightMessageEl.classList.remove('highlightMessage');
      return;
    }
    if (this.messageEl && this.highlightMessageEl
        && !this.messageEl.classList.contains('highlightMessage')) {
      this.highlightMessageEl.classList.remove('highlightMessage');
      this.messageEl.classList.add('highlightMessage');
      return;
    }
    if (this.messageEl === null) {
      return;
    }
    this.messageEl.classList.toggle('highlightMessage');
  }

  addButtonFixMessage(target) {
    // если одно сообщение закреплено, то кнопка закрепления не появится
    if (document.querySelector('.pinnedArea')) {
      return;
    }
    this.addFileButton = document.querySelector('.input__wrapper');
    this.highlightMessageEl = document.querySelector('.highlightMessage');

    this.fixMessageButtonEl = document.createElement('input');
    this.fixMessageButtonEl.setAttribute('type', 'button');
    this.fixMessageButtonEl.classList.add('buttonForm', 'fixMessageButton');

    if (document.querySelector('.fixMessageButton')
    && !this.highlightMessageEl) {
      this.dellButtonFixMessage();
      return;
    }
    if (!target.closest('.message')
    && !this.highlightMessageEl) {
      return;
    }
    if (document.querySelector('.fixMessageButton')
    && this.highlightMessageEl) {
      return;
    }

    this.addFileButton.before(this.fixMessageButtonEl);
  }

  dellButtonFixMessage() {
    this.fixMessageButtonEl = document.querySelector('.fixMessageButton');
    this.fixMessageButtonEl.remove();
  }

  fixMessage(messageEl) {
    this.formEl = document.querySelector('.form');

    this.pinnedArea = document.createElement('div');
    this.pinnedArea.classList.add('pinnedArea');

    this.formEl.prepend(this.pinnedArea);

    this.unFixMessageButtonEl = document.createElement('input');
    this.unFixMessageButtonEl.setAttribute('type', 'button');

    this.unFixMessageButtonEl.classList.add('unFixMessageButton', 'buttonForm');

    this.pinnedArea.prepend(this.unFixMessageButtonEl);

    this.messageEl.classList.remove('highlightMessage');
    this.dupMessageEl = messageEl.cloneNode(true);
    this.modifyDupMessageEl = this.modifyFixMessage(this.dupMessageEl);
    this.pinnedArea.append(this.dupMessageEl);
    messageEl.classList.add('messageHiding');
    this.dellButtonFixMessage();
  }

  unFixMessage(messageElHiding) {
    messageElHiding.classList.remove('messageHiding');
    this.pinnedArea.remove();
  }

  // eslint-disable-next-line class-methods-use-this
  modifyFixMessage(dupMessageEl) {
    const modifydupMessageEl = dupMessageEl;
    if (modifydupMessageEl.querySelector('img')) {
      modifydupMessageEl.querySelector('img').remove();
    }
    if (modifydupMessageEl.querySelector('video')) {
      modifydupMessageEl.querySelector('video').remove();
    }
    if (modifydupMessageEl.querySelector('audio')) {
      modifydupMessageEl.querySelector('audio').remove();
    }
    modifydupMessageEl.classList.add('fixmessage');
    return modifydupMessageEl;
  }
}
