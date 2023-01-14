import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const dataInput = document.querySelector('#datetime-picker');
const startBt = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let selectedDate = null;
let timerId = null;

// startBt.setAttribute('disabled', 'true');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = new Date();
    if (selectedDates[0] <= date) {
      Notify.failure('Please choose a date in the future');
    } else {
      startBt.removeAttribute('disadled');
      selectedDate = selectedDates;
    }
  },
};

flatpickr('#datetime-picker', options);

startBt.addEventListener('click', onStartBtClick);

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function onStartBtClick() {
  timerId = setInterval(updateInterface, 1000);
  startBt.setAttribute('disabled', 'true');
  dataInput.setAttribute('disabled', 'true');
}

function updateInterface() {
  const date = new Date();
  const dataTimer = selectedDate[0] - date;
  if (dataTimer < 1000) {
    endTime();
  }
  const { days, hours, minutes, seconds } = convertMs(dataTimer);
  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

function endTime() {
  clearInterval(timerId);
  Notify.success('Time is over');
}
