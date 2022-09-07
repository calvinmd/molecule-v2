var https = require("follow-redirects").https;
var fs = require("fs");

var options = {
  method: "GET",
  hostname: "www.treasury.gov",
  path: "/ofac/downloads/sdn.csv",
  maxRedirects: 20,
};

const file = fs.createWriteStream("blacklist.csv");

var req = https.request(options, function (res) {
  var chunks = [];

  res.pipe(file);

  // after download completed close filestream
  file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();
