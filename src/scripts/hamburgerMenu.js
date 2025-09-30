const toggleButton = document.getElementById('button-menu');
const mainNav = document.querySelector('.main-nav');


toggleButton.addEventListener('click', () => {
  toggleButton.classList.toggle('close');
  mainNav.classList.toggle('show');
});