// var upc_code = "889142235385";
// var auth_key = "Hl11J8r8i7At5Bd4";

var crypto    = require('crypto');
var text      = "889142235385";
var secret    = "Hl11J8r8i7At5Bd4"; //make this your secret!!
var algorithm = 'sha1';   //consider using sha256
var hash, hmac;

// Method 2 - Using update and digest:
hmac = crypto.createHmac(algorithm, secret);
hmac.update(text);
hash = hmac.digest('base64');
console.log("Method 2: ", hash);
