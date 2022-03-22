//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const Youtube = require("yt-live-url");
const twitch = require("twitch-m3u8");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/convert-url-to-m3u8", async function (req, res) {
  let payload = await getM3U8url(req.body.url);
  res.status(payload.status);
  res.json(payload);
});

async function getM3U8url(stream_url) {
  if (stream_url) {
    if (stream_url.includes("twitch")) {
      let twitchM3U8Url = "";
      var channelName = stream_url.split("https://www.twitch.tv/")[1];
      if (channelName == null) {
        return {
          status: 400,
          message: "Passe uma url do canal de streaming da twitch válido",
        };
      }
      try {
        twitchM3U8Url = await twitch.getStream(channelName);
        //twitchM3U8Url[1] = resolução 720p60
        return { status: 200, message: "success", url: twitchM3U8Url[1].url };
      } catch (e) {
        console.log(e);
        return {
          status: 500,
          message:
            "Não foi possível processar a url, certifique-se de que a mesma está correta.",
        };
      }
    } else if (stream_url.includes("youtube")) {
      let youtubeM3U8Url = "";
      var channelId = stream_url.split("https://www.youtube.com/channel/")[1];
      if (channelId == null) {
        console.log("Passe uma url de um canal do youtube válido");
        return null;
      }
      try {
        youtubeM3U8Url = await Youtube.getStream(channelId);
        return {
          status: 400,
          message: "Passe uma url do canal de streaming da twitch válido",
        };
      } catch (e) {
        console.log(e);
        return {
          status: 500,
          message:
            "Não foi possível processar a url, certifique-se de que a mesma está correta.",
        };
      }
    } else {
      return { status: 400, message: "bad request" };
    }
  } else {
    return { status: 400, message: "bad request" };
  }
}

app.listen(3000, function () {
  console.log("Server is up on port 3000");
});
