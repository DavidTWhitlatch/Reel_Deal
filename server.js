const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/favorites', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./data.json'));
  res.json(data);
});

app.post('/favorites', (req, res) => {
  if (!req.body.name || !req.body.oid) {
    res.send('Error');
  } else {
    const data = JSON.parse(fs.readFileSync('./data.json'));
    data.push(req.body);
    fs.writeFile('./data.json', JSON.stringify(data), () => console.log('favorites updated'));
    res.json(data);
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
