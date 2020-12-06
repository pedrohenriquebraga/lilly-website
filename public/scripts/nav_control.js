const menuIcon = document.querySelector('header i')
const header = document.querySelector('header')
const login = document.querySelector('.login')

if (Cookies.get("userToken")) {
    login.innerHTML = '<i class="fa fa-sign-in logout"></i> Sair'
    login.setAttribute('href', '/logout')
} else {
    login.setAttribute('href', `/api/login?redirect=${window.location}`)
}

function toggleNav() { 
    header.classList.toggle('nav')
        if (header.classList.contains('nav')) { 
            menuIcon.classList.remove('fa-bars')
            menuIcon.classList.add('fa-times')
        } else {
            menuIcon.classList.add('fa-bars')
            menuIcon.classList.remove('fa-times')
        }
    }
menuIcon.addEventListener('click', toggleNav)