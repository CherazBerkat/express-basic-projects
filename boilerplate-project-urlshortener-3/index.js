require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let urlDatabase = {}; // In-memory storage for URLs

function generateShortUrl() {
  return Math.floor(Math.random() * 100000).toString();
}

function isValidURL(url) {
  const urlRegex = new RegExp(
    "^" +
      "(https?:\\/\\/)?" +
      "(?:www\\.)?" +
      "([a-zA-Z0-9-]+\\.)+" +
      "[a-zA-Z]{2,}" +
      "(?::\\d{1,5})?" +
      "(?:\\/[^\\s]*)?" +
      "$"
  );
  return urlRegex.test(url);
}

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl", async (req, res) => {
  const longUrl = req.body.url;
  if (!isValidURL(longUrl)) {
    res.json({ error: "invalid url" });
  } else {
    const shortUrl = generateShortUrl();
    urlDatabase[shortUrl] = longUrl; // Store the mapping
    res.json({ original_url: longUrl, short_url: shortUrl });
  }
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shortUrl = req.params.shorturl;
  const longUrl = urlDatabase[shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).json({ error: "Short URL not found" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
