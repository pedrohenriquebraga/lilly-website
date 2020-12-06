require("dotenv").config();
const { Router } = require("express");
const routes = Router();
const commandsJson = require("../commands.json");
const config = require("../config.json");
const client = require("disco-oauth");
const disco = new client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
const api = require("./services/api");
const fetch = require("node-fetch");
process.on("unhandledRejection", (error) => console.error(error));

const discordConfig = {
  discordBaseUrl: "https://discord.com/api/oauth2",
  discordSendTokenUrl: `${this.discordBaseUrl}/token`,
  discordRequestTokenUrl: `${this.discordBaseUrl}/authorize?client_id=${process.env.CLIENT_ID}`,
};

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

routes.get("/api/login", async (req, res) => {
  const redirectData = req.query.redirect || "/";
  const base64 = Buffer.from(redirectData).toString("base64");

  return res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback&response_type=code&scope=identify%20guilds&state=${base64}`
  );
});

routes.get("/api/callback", async (req, res) => {
  const code = req.query.code;
  const state64 = req.query.state;
  const redirect = Buffer.from(state64, "base64").toString();
  const dataToSend = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/api/callback",
    grant_type: "authorization_code",
    code: code,
    scope: ["identify", "guilds"],
  };

  const token = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams(dataToSend),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((response) => response);

  res.cookie("userToken", token.access_token, {
    maxAge: token.expires_in,
  });

  return res.redirect(redirect);
});

routes.get("/api/guilds", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.redirect(`/api/login?redirect=/`);
  const guilds = await fetch("https://discord.com/api/users/@me/guilds", {
    method: "GET",
    headers: {
      authorization: token,
    },
  })
    .then((response) => response.json())
    .then((response) => response);
  return res.json(guilds);
});

routes.get("/logout", (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/");
});

routes.get("/dashboard", (req, res) => {
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
