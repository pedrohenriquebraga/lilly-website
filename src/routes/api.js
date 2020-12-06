require("dotenv").config();
const { Router } = require("express");
const routes = Router();
const fetch = require("node-fetch");

function isAuthenticated(req, res, next) {
  const routePath = req.path
  const authorization = req.headers.authorization

  if (!authorization)
    return res.redirect(`/api/login?redirect=${routePath}`)

  return next()
}

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
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET

  const dataToSend = {
    client_id: clientId,
    client_secret: clientSecret,
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

  const user = await fetch("http://localhost:3000/api/user", {
    method: "GET",
    headers: {
      authorization: token.access_token
    }
  }).then((response) => response.json())
    .then((response) => response)

  res.cookie("basicInfosUser", user)

  return res.redirect(redirect);
});

routes.get("/api/user", isAuthenticated, async (req, res) => {
  if (!req.headers.authorization)
    return res.status(403).json({ error: true, message: "No Token provided" });
  const discordToken = req.headers.authorization;

  await fetch("https://discord.com/api/users/@me", {
    method: "GET",
    headers: {
      authorization: `Bearer ${discordToken}`,
    },
  })
    .then((response) => response.json())
    .then((response) => res.json(response));
});

routes.get("/api/guilds", isAuthenticated, async (req, res) => {
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

module.exports = routes
