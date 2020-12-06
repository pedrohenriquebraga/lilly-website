const startButton = document.querySelector(".selectBox button");
const selectedGuild = document.querySelector("#selectedGuild");

function verifySelectGuild() {
  if (selectedGuild.value === "") {
    startButton.disable = true;
    startButton.classList.add("disable");
    startButton.classList.remove("enable");
  } else {
    startButton.disable = false;
    startButton.classList.add("enable");
    startButton.classList.remove("disable");
  }
}

async function populateSelect() {
  selectedGuild.disabled = true;
  const userToken = Cookies.get("userToken");
  const guilds = await fetch("/api/guilds", {
    headers: {
      authorization: "Bearer " + userToken,
    },
  })
  .then(response => {
      if (response.ok) return response.json()
      else return alert("Não foi possível obter seus servidores!!")
  })
  .then((res) => {
    selectedGuild.disabled = false;
    return res;
  });

  for (guild of guilds) {
    if (guild.owner && guild.permissions_new & '32')
      selectedGuild.innerHTML += `<option value="${guild.id}">${guild.name}</option>`;
  }
}

function configureGuild() {
  if (selectedGuild.value)
    return window.location = `/dashboard/guild/${selectedGuild.value}`
}

populateSelect();
selectedGuild.addEventListener("change", verifySelectGuild);
selectedGuild.addEventListener("load", verifySelectGuild);
startButton.addEventListener('click', configureGuild)
