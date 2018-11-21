
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = "mongodb+srv://SenneS_Admin:SenneS2018@sennescluster-onimy.mongodb.net/SenneSDB";

// Database name
const dbName = "SenneSDB";

// Create a global variable for database access
var dbClient;

// Connect to the Database
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to SenneSDB");

  // Update the dbClient varaiable and use it make connections in functions
  const dbClient = client.db(dbName);

  // ******************************
  // I had to make the function call from within this connection because I couldn't get it to work outside of it
  // Having an issue where the getBarcodeInfo function would call before the DB connectione was made
  var upc = "012000018794";
  getBarcodeInfo(dbClient, upc);

});


function getBarcodeInfo(dbClient, barcode) {

    // Query for UPCitemdb database
    var query = "https://api.upcitemdb.com/prod/trial/lookup?upc="+barcode;

    const options = {
        url: query,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    // Parse the barcode information
    request(options, function(err, res, body) {
        var barcodeInfo = JSON.parse(body);
        console.log(barcodeInfo);

        // Store the returned JSON object in the Barcodes database
        const collection = dbClient.collection("Barcodes");
        collection.insertOne(barcodeInfo, function(err, res) {
         if (err) throw err;
         console.log("Barcodes DB Updated");

         // I am not sure how to use callback so can't get it to return the barcodeInfo object
         //callback(barcodeInfo);
        });
    });
}


function addUpdate(dbClient, item, FridgeID) {
// update block that is encrypted
// add fridge_id and increment state
// need a string
// id, state and string

     // create the collection object for inserting documents
     const collection = dbClient.db("SenneSDB").collection(Fridges);

     var doc = { name: barcodeInfo.title , brand: barcodeInfo.brand, size: barcodeInfo.size, weight: barcodeInfo.weight };

     // insert the document into the DB
     collection.insertOne(doc, function(err, res) {
      if (err) throw err;
      console.log("Document inserted");

     // need to update and return state
     client.close();
    });
  }

function getUpdates(dbClient, fridgeID, state) {
// Take all updates that are bigger than the state and belong to the fridge
// return a list of the strings between the two states

     // create the collection object for retrieving documents
     const collection = dbClient.db("SenneSDB").collection(Fridges);

     // items from the DB are stored in an array of dictionaries
     collection.find().toArray(function(err, items) {
       if (err) throw err;
       console.log("Documents retrieved")
       console.log(items);
     });

     // need to update and return state
     client.close();
   }
