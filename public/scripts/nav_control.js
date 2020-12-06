const menuIcon = document.querySelector("header i");
const header = document.querySelector("header");
const login = document.querySelector(".login");
const loginAvatar = document.querySelector(".login img");

if (Cookies.get("userToken")) {
  const basicUserInfo = Cookies.get("basicInfosUser");
  const infos = JSON.parse(basicUserInfo.replace(basicUserInfo[0] + ":", ""));
  console.log(infos);

  login.innerHTML = 
  `  <i class="fa fa-sign-in logout"></i> Sair<img src="${`https://cdn.discordapp.com/avatars/${infos.id}/${infos.avatar}.webp`}"/>`;
  login.setAttribute("href", "/logout");
} else {
  login.setAttribute("href", `/api/login?redirect=${window.location}`);
}

function toggleNav() {
  header.classList.toggle("nav");
  if (header.classList.contains("nav")) {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-times");
  } else {
    menuIcon.classList.add("fa-bars");
    menuIcon.classList.remove("fa-times");
  }
}
menuIcon.addEventListener("click", toggleNav);
