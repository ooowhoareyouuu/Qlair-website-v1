const qlairCursor = document.createElement('div');
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/svg+xml';
favicon.href = 'assets/qlair-cursor.svg';
document.head.appendChild(favicon);
qlairCursor.id = 'qlair-cursor';
qlairCursor.setAttribute('aria-hidden', 'true');
document.body.appendChild(qlairCursor);

const showCursor = (event) => {
  if (event.pointerType === 'touch') return;
  qlairCursor.style.left = `${event.clientX}px`;
  qlairCursor.style.top = `${event.clientY}px`;
  let target = document.elementFromPoint(event.clientX, event.clientY);
  let isLight = false;
  while (target && target !== document.documentElement) {
    const rgb = getComputedStyle(target).backgroundColor.match(/\d+/g);
    if (rgb && rgb.length >= 3 && (rgb.length < 4 || Number(rgb[3]) > 0)) {
      const brightness = (Number(rgb[0]) * 299 + Number(rgb[1]) * 587 + Number(rgb[2]) * 114) / 1000;
      if (brightness > 180) isLight = true;
      break;
    }
    target = target.parentElement;
  }
  qlairCursor.classList.toggle('on-light', isLight);
  document.body.classList.add('has-custom-cursor');
};

window.addEventListener('pointermove', showCursor);
window.addEventListener('mousemove', showCursor);

document.addEventListener('mouseleave', () => document.body.classList.remove('has-custom-cursor'));
document.addEventListener('mouseenter', () => document.body.classList.add('has-custom-cursor'));
