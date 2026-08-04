const qlairCursor = document.createElement('div');
qlairCursor.id = 'qlair-cursor';
qlairCursor.setAttribute('aria-hidden', 'true');
document.body.appendChild(qlairCursor);

const showCursor = (event) => {
  if (event.pointerType === 'touch') return;
  qlairCursor.style.left = `${event.clientX}px`;
  qlairCursor.style.top = `${event.clientY}px`;
  document.body.classList.add('has-custom-cursor');
};

window.addEventListener('pointermove', showCursor);
window.addEventListener('mousemove', showCursor);

document.addEventListener('mouseleave', () => document.body.classList.remove('has-custom-cursor'));
document.addEventListener('mouseenter', () => document.body.classList.add('has-custom-cursor'));
