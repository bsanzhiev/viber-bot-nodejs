// https://github.com/gsake/viber-bot-sample

const ViberBot = require("viber-bot").Bot,
  BotEvents = require("viber-bot").Events,
  TextMessage = require("viber-bot").Message.Text,
  PictureMessage = require("viber-bot").Message.Picture,
  express = require("express");

const app = express();

const config = require("./config.json");

if (!config.token) {
  console.log("Could not find bot account token key.");
  return;
}
if (!config.expose_domain) {
  console.log("Could not find exposing url");
  return;
}

const bot = new ViberBot({
  authToken: config.token,
  name: "Viberbot Kurumkan",
  avatar: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Katze_weiss.png",
});
bot.on(BotEvents.SUBSCRIBED, (response) => {
  response.send(
    new TextMessage(
      `Hi there ${response.userProfile.name}. I am ${bot.name}! Feel free to ask me anything.`
    )
  );
});
bot.on(BotEvents.MESSAGE_RECEIVED, (message, response) => {
  response.send(
    new TextMessage(
      `Сообщение доставлено: "${message.text}" от ${response.userProfile.name}`
    )
  );
});

bot.on(BotEvents.MESSAGE_RECEIVED, (media, response) => {
  response.send(
    new PictureMessage(media="https://image.shutterstock.com/image-photo/waves-hitting-lighthouse-scotland-600w-1993378820.jpg", text="Viber logo")
  );
});

const port = process.env.PORT || 8090;
app.use("/viber/webhook", bot.middleware());
app.listen(port, () => {
  console.log(`Application running on port: ${port}`);
  bot.setWebhook(`${config.expose_domain}/viber/webhook`).catch((error) => {
    console.log("Can not set webhook on following server. Is it running?");
    console.error(error);
    process.exit(1);
  });
});
