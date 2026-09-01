const licenseStyle = document.createElement('style');
licenseStyle.textContent = '.license-button{min-width:214px;min-height:50px;padding:13px 18px;justify-content:space-between;gap:22px;white-space:nowrap;border-radius:4px}.license-form .button{min-width:260px;min-height:50px;padding:13px 18px;justify-content:space-between;gap:22px;white-space:nowrap;border-radius:4px}';
document.head.appendChild(licenseStyle);
const openLicense = document.querySelector('[data-open-license]');
const licenseModal = document.querySelector('#license-modal');
const closeLicense = document.querySelector('[data-close-license]');
if (openLicense && licenseModal) {
  openLicense.addEventListener('click', () => licenseModal.classList.add('is-open'));
  closeLicense.addEventListener('click', () => licenseModal.classList.remove('is-open'));
  licenseModal.addEventListener('click', event => { if (event.target === licenseModal) licenseModal.classList.remove('is-open'); });
}
