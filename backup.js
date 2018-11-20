// var app_id = "/+QN4JxDkG59";
// var user_key = "Hl11J8r8i7At5Bd4";
// var signature = getSignature(barcode, user_key);
//
// var query = "https://digit-eyes.com/gtin/v2_0/?upc_code="+barcode+"&app_key="+app_id+"&signature="+signature+"&language=en&field_names=description,uom,usage,brand";

function getSignature(upc, auth) {
  var algorithm = 'sha1';
  var hash, hmac;

  hmac = crypto.createHmac(algorithm, auth);
  hmac.update(upc);
  hash = hmac.digest('base64');
  var format_sig = hash.replace(/ /g, "");
  console.log("Hash:", format_sig);
  return(format_sig);
};
