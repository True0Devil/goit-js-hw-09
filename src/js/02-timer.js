import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hrs: document.querySelector('[data-hours]'),
  mins: document.querySelector('[data-minutes]'),
  secs: document.querySelector('[data-seconds]'),
};

let selectedTime = null;

refs.startBtn.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      window.alert('Please choose a date in the future');
      refs.startBtn.setAttribute('disabled', true);
      return;
    }

    selectedTime = selectedDates[0].getTime();
    refs.startBtn.removeAttribute('disabled');
  },
};

flatpickr('#datetime-picker', options);

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.onTick = onTick;
  }

  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const countdownTime = this.convertMs(selectedTime - currentTime);
      this.onTick(countdownTime);
    }, 1000);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hrs = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const mins = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    // Remaining seconds
    const secs = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hrs, mins, secs };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateTimerInterface,
});
refs.startBtn.addEventListener('click', timer.start.bind(timer));

function updateTimerInterface({ days, hrs, mins, secs }) {
  refs.days.textContent = `${days}`;
  refs.hrs.textContent = `${hrs}`;
  refs.mins.textContent = `${mins}`;
  refs.secs.textContent = `${secs}`;
}
