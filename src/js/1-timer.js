import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const daysSel = document.querySelector('[data-days]');
const hoursSel = document.querySelector('[data-hours]');
const minutesSel = document.querySelector('[data-minutes]');
const secondsSel = document.querySelector('[data-seconds]');
const picker = document.querySelector('#datetime-picker');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysSel.textContent = addLeadingZero(days);
  hoursSel.textContent = addLeadingZero(hours);
  minutesSel.textContent = addLeadingZero(minutes);
  secondsSel.textContent = addLeadingZero(seconds);
}

function startTimer() {
  startBtn.disabled = true;
  picker.disabled = true;

  timerId = setInterval(() => {
    const diff = userSelectedDate - Date.now();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      picker.disabled = false;
      return;
    }

    updateTimerDisplay(convertMs(diff));
  }, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'center',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

flatpickr(picker, options);
startBtn.addEventListener('click', startTimer);
