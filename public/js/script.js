let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
  loginForm.classList.remove('active');
};

let searchForm = document.querySelector('.search-form');

// document.querySelector('#search-btn').onclick = () => {
//   searchForm.classList.toggle('active');
//   navbar.classList.remove('active');
//   loginForm.classList.remove('active');
// };

window.onscroll = () => {
  navbar.classList.remove('active');
  loginForm.classList.remove('active');
};
// const Swiper = require('swiper');
// // import Swiper styles
// var swiper = new Swiper('.review-slider', {
//   loop: true,
//   spaceBetween: 30,
//   centeredSlides: true,
//   autoplay: {
//     delay: 5500,
//     disableOnInteraction: false,
//   },
//   pagination: {
//     el: '.swiper-pagination',
//   },
// });

// scroll to top // Get the button
let mybutton = document.getElementById('myBtn');

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = 'block';
  } else {
    mybutton.style.display = 'none';
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
