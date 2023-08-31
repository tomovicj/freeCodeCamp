var express = require('express');
var cors = require('cors');
const upload = require('./upload.js');  // Used to download a file
const fs = require('fs');  // Used to delete a file
require('dotenv').config();


var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {
  // Take data about the file
  const name = req.file.originalname;
  const type = req.file.mimetype;
  const size = req.file.size;

  // Delete the file after data is taken
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err)
    }
  });

  res.json({
    name,
    type,
    size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
