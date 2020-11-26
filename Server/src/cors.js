const cors = require('cors');

var whiteList = ["http://localhost:3000","http://localhost:4200"];

var corsOptions = {
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'),false)
      }
    }
  }

exports.corsWithOption = cors(corsOptions);
