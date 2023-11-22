export default class PopUpAddFile {
  constructor() {
    this.container = document.getElementsByClassName('container');
  }

  getPopUpHTML(files) { // возвращает html разметку окна отправки файла
    for (const file of files) {
      this.filesName = file.name;
    }
    const word = files.length > 1 ? 'файлы' : 'файл';
    return `
        <form class="form_add_file" action="">
          <h1 class="form_Name">Отправить ${word} с именем </h1>
          <p>
          <span class="name_add_file">${this.filesName} ?</span>
          </p>
          <footer class="form_footer_add_file">
            <button type="button" class="download_cancell button">Отмена</button>
            <button type="button" class="download_ok button">Отправить</button>
          </footer>
        </form>
    `;
  }

  // отрисовывает окно отправки файла и ставит обработчик 'klick'
  async renderingPopUp(files) {
    this.files = files;
    this.containerForm = document.createElement('div');
    this.containerForm.className = 'popup';
    this.container[0].append(this.containerForm);
    this.containerForm.innerHTML = this.getPopUpHTML(files);
    return new Promise((resolve) => {
      this.containerForm.addEventListener('click', async (event) => {
        const resultPopUpAddFile = await this.onClickPopUp(event);
        if (resultPopUpAddFile === 'canсell') {
          resolve('canсell');
        } else {
          resolve(this.files);
        }
      });
    });
  }

  onClickPopUp(event) {
    return new Promise((resolve) => {
      const { target } = event;
      if (target === document.querySelector('.download_cancell')) {
        resolve('canсell');
      }
      if (target === document.querySelector('.download_ok')) {
        resolve(this.files);
      }
    });
  }
}
