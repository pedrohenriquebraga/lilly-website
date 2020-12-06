require("dotenv").config();
const { Router } = require("express");
const routes = Router();
const commandsJson = require("../../commands.json");
const config = require("../../config.json");
const api = require("../services/api");
const fetch = require("node-fetch");
process.on("unhandledRejection", (error) => console.error(error));

function isAuthenticated(req, res, next) {
  const routePath = req.path
  const authorization = req.cookies.userToken

  if (!authorization || authorization.length <= 10 || typeof authorization !== "string")
    return res.redirect(`/api/login?redirect=${routePath}`)

  return next()
}

// Rota Principal
routes.get("/", (req, res) => {
  return res.render("pages/index.html", {
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

  return res.render("pages/commands.html", {
    title: "Comandos da Lilly",
    canon: `${config.url}/commands`,
    desc:
      "Veja a lista completa de comandos da Lilly sempre atualizada e cheia de comandos realmente úteis para você!",
    commands: commands,
    total: commands.length,
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

routes.get("/logout", (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/");
});

routes.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("pages/dashboard.html", {
    title: "Configure seu server na Dashboard da Lilly",
    description:
      "Configure toda a LIlly através do site dela com apenas alguns cliques!",
    canon: `${config.url}/dashboard`,
  });
});

routes.get("/dashboard/guild/:guildId", (req, res) => {
  res.send("OK!");
});

routes.get("/dashboard/user/:userId", (req, res) => {
  res.send("OK!");
});

routes.get("/user", async (req, res) => {
  if (!req.cookies.discordToken)
    return res.json({ error: true, message: "No Token provided" });
  const discordToken = req.cookies.discordToken;

  await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${discordToken}`,
    },
  })
    .then((response) => response.json())
    .then((response) => res.json(response));
});

routes.get("/community-terms", (req, res) => {
  return res.render("pages/communityTerms.html", {
    title: "Termos de uso e comunidade da Lilly",
    canon: `${config.url}/community-terms`,
    desc:
      "Aqui estão todos as regras que devem ser seguidas pela comunidade para usarem a Lilly sem corre riscos de ser punido.",
  });
});

routes.get("/privacy-policy", (req, res) => {
  return res.render("pages/privacyPolicy.html", {
    title: "Políticas de Privacidade da Lilly",
    canon: `${config.url}/privacy-policy`,
    desc:
      "Veja todas as políticas de privacidade e como são usados os dados enviados a Lilly.",
  });
});

routes.get("*", (req, res) => {
  res.status(404).render("pages/404.html", {
    title: "Não encontrei nada por aqui!",
    canon: `${config.url}/404`,
    desc:
      "Eu não encontrei nada por aqui! Tem certeza que você está no lugar certo?",
  });
});

module.exports = routes;
