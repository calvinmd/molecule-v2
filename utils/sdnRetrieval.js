var https = require("follow-redirects").https;
var fs = require("fs");

var options = {
  method: "GET",
  hostname: "www.treasury.gov",
  path: "/ofac/downloads/sdn.csv",
  maxRedirects: 20,
};

// https://docs.fcdo.gov.uk/docs/UK-Sanctions-List.html

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

async function log() {
  var csvData = [];
  var addresses = [];

  fs.createReadStream(__dirname + "/blacklist.csv")
    .pipe(
      parse({
        columns: true,
        relax_quotes: true,
        escape: "\\",
        ltrim: true,
        rtrim: true,
        skip_records_with_error: true,
      })
    )
    .on("data", function (csvrow) {
      Object.values(csvrow).map(function (key) {
        let address = key.match(/(\b0x[a-fA-F0-9]{40}\b)/g);
        if (address) {
          addresses.push(address);
        }
      });
      csvData.push(csvrow);
    })
    .on("end", function () {
      var merged = [].concat.apply([], addresses);
      console.log(merged); //final list of addresses
    });
}
