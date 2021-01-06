const { Router } = require("express");
const { readdirSync } = require("fs");
const { join } = require("path");
const routes = Router();
const commandsJson = require("../commands.json");
const config = require("../config.json");
const api = require("./services/api");

// Rota Principal
routes.get("/", (req, res) => {
  return res.render("index.html", {
    title: "Lilly, um bot simples mas poderoso para o Discord",
    canon: `${config.url}`,
    desc:
      "Venha conhecer um dos melhores e mais completos bots do Discord, que vai trazer muita mais alegria, diversão e controle do seu servidor, e o melhor, de graça!",
  });
});

// Rota para mostrar comandos
routes.get("/commands", async (req, res) => {
  let commands = await api
    .get("/commandList")
    .then((response) => response.data)
    .catch((error) => commandsJson);

  commands.sort((a, b) => (a.name > b.name ? 1 : -1));

  return res.render("commands.html", {
    title: "Comandos da Lilly",
    canon: `${config.url}/commands`,
    desc:
      "Veja a lista completa de comandos da Lilly sempre atualizada e cheia de comandos realmente úteis para você!",
    commands: commands,
    total: commands.length,
  });
});

// Rota de Fanarts
routes.get("/fanarts", (req, res) => {
  const fanarts = [];
  const files = readdirSync(
    join(__dirname, "..", "public", "assets", "fanarts")
  ).filter((file) => file.endsWith(".webp"));

  files.map((file) => fanarts.push(`/assets/fanarts/${file}`));

  return res.render("fanarts.html", {
    title: "Fanarts da Lilly",
    canon: `${config.url}/fanarts`,
    fanarts,
    desc: "Veja algumas fanarts da Lilly feitas por pessoas incríveis!",
  });
});

// Convite da Lilly
routes.get("/invite", (req, res) => {
  return res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=754548334328283137&permissions=8&scope=bot"
  );
});

routes.get("/support", (req, res) => {
  return res.redirect("https://discord.gg/SceHNfZ");
});

routes.get("/community-terms", (req, res) => {
  return res.render("communityTerms.html", {
    title: "Termos de uso e comunidade da Lilly",
    canon: `${config.url}/community-terms`,
    desc:
      "Aqui estão todos as regras que devem ser seguidas pela comunidade para usarem a Lilly sem corre riscos de ser punido.",
  });
});

routes.get("/privacy-policy", (req, res) => {
  return res.render("privacyPolicy.html", {
    title: "Políticas de Privacidade da Lilly",
    canon: `${config.url}/privacy-policy`,
    desc:
      "Veja todas as políticas de privacidade e como são usados os dados enviados a Lilly.",
  });
});

routes.get("*", (req, res) => {
  res.status(404).render("404.html", {
    title: "Não encontrei nada por aqui!",
    canon: `${config.url}/404`,
    desc:
      "Eu não encontrei nada por aqui! Tem certeza que você está no lugar certo?",
  });
});

module.exports = routes;
