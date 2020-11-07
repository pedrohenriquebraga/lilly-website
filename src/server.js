const express = require("express");
const cors = require("cors");
const path = require("path");
const nunjucks = require("nunjucks");
const compression = require("compression");
const zlib = require("zlib");

const app = express();

app.use(cors());
app.disable("x-powered-by");
app.use(compression({ level: 9 }));
app.use(express.static(path.join(__dirname, "..", "public")));

nunjucks.configure(path.join(__dirname, "views"), {
  express: app,
  noCache: true
});

// Rota Principal
app.get("/", (req, res) => {
  return res.render("index.html", {
    title: "Lilly, um bot simples mas poderoso para o Discord",
    desc:
      "Venha conhecer um dos melhores e mais completos bots do Discord, que vai trazer muita mais alegria, diversão e controle do seu servidor, e o melhor, de graça!",
  });
});

// Rota para mostrar comandos
app.get("/commands", (req, res) => {
  return res.render("commands.html", {
    title: "Comandos da Lilly",
    desc:
      "Veja a lista completa de comandos da Lilly sempre atualizada e cheia de comandos realmente úteis para você!",
  });
});

// Convite da Lilly
app.get("/invite", (req, res) => {
  return res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=754548334328283137&permissions=8&scope=bot"
  );
});

app.get("/support", (req, res) => {
  return res.redirect("https://discord.gg/SceHNfZ");
});

app.get("/community-terms", (req, res) => {
  return res.render("communityTerms.html", {
    title: "Termos de uso e comunidade da Lilly",
    desc:
      "Aqui estão todos as regras que devem ser seguidas pela comunidade para usarem a Lilly sem corre riscos de ser punido.",
  });
});

app.get("/privacy-policy", (req, res) => {
  return res.render("privacyPolicy.html");
});

app.listen(process.env.PORT || 3000);
