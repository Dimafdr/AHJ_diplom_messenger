export default class Timer {
  constructor() {
    this.sec = 0;
    this.min = 0;
  }

  startTimer() {
    this.timerEl = document.querySelector('.timer');
    this.timerId = setInterval(() => {
      this.sec += 1;
      if (this.sec >= 60) {
        this.min += 1;
        this.sec -= 60;
      }
      if (this.min >= 1) {
        this.stopTimer();
        document.querySelector('.cansellAudioRecording').click();
        // eslint-disable-next-line no-alert
        alert('Запись не может длисться более 1 минуты. Постараайтесь уложиться в 1 минуту');
      }
      const time = `${this.min > 9 ? this.min : `0${this.min}`}:${this.sec > 9 ? this.sec : `0${this.sec}`}`;
      this.timerEl.innerHTML = time;
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerId);
    this.sec = 0;
    this.min = 0;
  }
}
