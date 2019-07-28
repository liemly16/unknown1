var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'data/' })
var Video = require('../models/video');
var pathLink = require('path');
var fs = require('fs');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let videos = await Video.find({});
  res.locals.videos = videos;
  res.render('video-list');
});

router.get('/post', async function (req, res, next) {
  res.render('video-post');
});

router.post('/post', upload.single('video'), async function (req, res, next) {
  console.log(req.file)
  let video = new Video({
    title: req.body.title,
    path: req.file.filename
  });

  await video.save();
  res.redirect('/video');
});

router.get('/:_id', async (req, res) => {
  let video = await Video.findOne({ _id: req.params._id });

  res.locals.video = video;
  res.render('video');
});

router.get('/data/:_id', async (req, res) => {
  let rec = await Video.findOne({_id: req.params._id});
  var path = pathLink.join(__dirname, "../data/", rec.path);
  var stat = fs.statSync(path);
  var total = stat.size;
  if (req.headers['range']) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total - 1;
    var chunksize = (end - start) + 1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    var file = fs.createReadStream(path, { start: start, end: end });
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;
