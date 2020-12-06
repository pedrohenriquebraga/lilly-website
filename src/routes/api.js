const routes = require("./routes");
const client = require("disco-oauth");
const disco = new client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

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

module.exports = routes;
