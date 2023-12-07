const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("video"), (req, res) => {
  res.status(200).json({ message: "Video uploaded successfully!" });
});

app.get("/videos", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.error("Error reading video directory:", err);
      res.status(500).json({ error: "Error fetching video list." });
    } else {
      const videoList = files.filter((file) => file.endsWith(".mp4"));
      res.status(200).json({ videos: videoList });
    }
  });
});

app.use("/videos", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
