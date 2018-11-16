const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://SenneS_Admin:SenneS2018@sennescluster-onimy.mongodb.net/SenneSDB"

function getBarcodeInfo(barcode) {
    //TODO: Actually retrieve barcode information
    // Use the digit-eyes REST API

    var app_id = "/+QN4JxDkG59";
    var user_key = "Hl11J8r8i7At5Bd4";
    var signature = getSignature(barcode, user_key);

    var query = "http://digit-eyes.com/gtin/v2_0/?upc_code="+barcode+"&app_key="+app_id+"&signature="+signature+"&language=en&field_names=description,uom,usage,brand";
    // Call a JSON API with Node JS
    // Return in the format needed for the addUpdate function

    return {};
}

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');

   // create the collection object for inserting documents
   // collection will need to be filled with the FridgeID
   const collection = client.db("SenneSDB").collection("sampleFridgeID");

   // document to be inserted
   // will need to be populated with information from the getBarcodeInfo function
   var doc = { name: "PepsiMax", size: "500" };

   // insert the document
   collection.insertOne(doc, function(err, res) {
    if (err) throw err;
    console.log("Document inserted");

   // need to update and return state
   client.close();
  });
});

function getSignature(upc, auth) {
  var crypto    = require('crypto');
  var algorithm = 'sha1';   
  var hash, hmac;

  hmac = crypto.createHmac(algorithm, auth);
  hmac.update(upc);
  hash = hmac.digest('base64');
  // console.log("Hash: ", hash);

}
