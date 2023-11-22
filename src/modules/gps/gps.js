/* eslint-disable consistent-return */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-cycle

export default class Gps {
  constructor(popUpGps) {
    this.popUpGps = popUpGps;
  }

  async getСoordinates() { // получает координаты
    if (this.coordString) {
      return this.coordString;
    }
    if (!navigator.geolocation) { // Проверить есть или нет сохраненные координаты
      this.popUpGps.renderingPopUp();
      return;
    }
    const promise = new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((_position) => resolve(_position),
        (e) => reject(e), { timeout: 5000 }); // ожидание координат 5 сек. потом выбросит исключение
    });
    try {
      this.position = await promise;
      const { latitude, longitude } = this.position.coords;
      this.coordString = `[${latitude}, ${longitude}]`;
      // eslint-disable-next-line consistent-return
      return this.coordString;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ошибка при получении координат', e);
    }
    this.coordString = await this.popUpGps.renderingPopUp(); // Проверить есть или нет сохраненные координаты
    return this.coordString;
  }

  showPosition() {
    // eslint-disable-next-line no-alert
    alert('логика отображения местоположени человека на карте ещё не написана SORRY');
  }
}
