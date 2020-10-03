const menuIcon = document.querySelector('header i')
const header = document.querySelector('header')
const nav = document.querySelector('nav')

function toggleNav() { header.classList.toggle('nav') }
menuIcon.addEventListener('click', toggleNav)