const request = require('request');
var crypto    = require('crypto');

var upc = "20825124583";
var app_id = "/+QN4JxDkG59";
var auth = "Hl11J8r8i7At5Bd4";
var signature = String(getSignature(upc, auth));
var format_sig = signature.replace(/ /g, "");
console.log(format_sig);

getBarcodeInfo(upc, app_id);

function getBarcodeInfo(barcode, app_id, format_sig) {

    var query = "http://digit-eyes.com/gtin/v2_0/?upc_code="+barcode+"&app_key="+app_id+"&signature="+signature+"&language=en&field_names=description,uom,usage,brand";
    console.log(query);

    // above query works
    // need to get the data out in a JSON format
    request(query, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      console.log(body.url);
      console.log(body.explanation);
    });
};

function getSignature(upc, auth) {
  var algorithm = 'sha1';
  var hash, hmac;

  hmac = crypto.createHmac(algorithm, auth);
  hmac.update(upc);
  hash = hmac.digest('base64');
  console.log("Hash:", hash);
  return(hash);
};
