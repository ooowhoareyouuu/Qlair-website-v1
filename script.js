const counter = document.querySelector('#counter');
const refresh = document.querySelector('#refresh');
const BASE_VALUE = 2130562998.59;
const INTERVAL_MS = 5 * 60 * 1000;
const INCREMENT = 10000;
const VALUE_KEY = 'qlair-recovered-value';
const REFRESH_KEY = 'qlair-recovered-last-refresh';
let value = Number(localStorage.getItem(VALUE_KEY)) || BASE_VALUE;
let lastRefreshAt = Number(localStorage.getItem(REFRESH_KEY)) || Date.now();
const render = (amount) => {
  const [whole, cents] = amount.toFixed(2).split('.');
  counter.textContent = `$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}.${cents}`;
};

function refreshValue() {
  refresh.disabled = true;
  refresh.style.transform = 'rotate(360deg)';
  const now = Date.now();
  const completedIntervals = Math.floor((now - lastRefreshAt) / INTERVAL_MS);
  if (completedIntervals === 0) {
    refresh.disabled = false;
    setTimeout(() => refresh.style.transform = '', 220);
    return;
  }
  const target = value + completedIntervals * INCREMENT;
  const start = value;
  const started = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - started) / 850, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    render(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
    else {
      value = target;
      lastRefreshAt += completedIntervals * INTERVAL_MS;
      localStorage.setItem(VALUE_KEY, value.toFixed(2));
      localStorage.setItem(REFRESH_KEY, String(lastRefreshAt));
      refresh.disabled = false;
      setTimeout(() => refresh.style.transform = '', 220);
    }
  };
  requestAnimationFrame(tick);
}

render(value);
refresh.addEventListener('click', refreshValue);
