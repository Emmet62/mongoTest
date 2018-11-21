
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const randomstring = require("randomstring");

// Connection URL
const url = "mongodb+srv://SenneS_Admin:SenneS2018@sennescluster-onimy.mongodb.net/SenneSDB";

// Database name
const dbName = "SenneSDB";

// Create a global variable for database access
let dbClient;

// Connect to the Database
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to SenneSDB");

  // Update the dbClient varaiable and use it make connections in functions
  dbClient = client.db(dbName);

  const upc = "049000050110";
  //getBarcodeInfo(upc, (result) => {
    //console.log(result);

  const fridgeID = "abcdef";

  // addUpdate(fridgeID, "encrpyted", (update) => {
  //   console.log(update);
  // });

  getUpdates(fridgeID, 0, (result) => {
    console.log(result);
  });

});

function getBarcodeInfo(barcode, callback) {

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
        let barcodeInfo = JSON.parse(body);
        console.log(barcodeInfo);
        let items = barcodeInfo.items[0];

        // Store the returned JSON object in the Barcodes database
        const collection = dbClient.collection("Barcodes");
        collection.insertOne(items, function(err, res) {
         if (err) throw err;
         console.log("Barcodes DB Updated");

        var result = { barcode: barcode, info: barcodeInfo, error: "null"}

        callback(result);
        });
    });
}

function addUpdate(fridgeID, update, callback) {

   // Create the collection object for inserting documents into Fridges database
   const collection = dbClient.collection("Fridges");

   // Query the database to find the current highest state for this fridge
   collection.find( { fridge_id: fridgeID } ).sort({ state:-1}).limit(1).toArray(function(err, maxState) {
     if (err) throw err;
     console.log(maxState.length);

     if (maxState.length == 0) {
      var newState = 1;
     } else {
      var newState = maxState[0].state + 1;
     }

     // Create the document containing the ID, state and string
     let fridgeUpdate = { fridge_id: fridgeID , state: newState, encrpyted_update: update };

     // insert the document into the DB
     collection.insertOne(fridgeUpdate, function(err, res) {
      if (err) throw err;

     callback(update);
     });
   });
}

function getUpdates(fridgeID, currentState, callback) {

     // create the collection object for retrieving documents
     const collection = dbClient.collection("Fridges");

     // items from the DB are stored in an array of dictionaries
     collection.find( { state: { $gt: currentState } }, { fridge_id: fridgeID } ).toArray(function(err, items) {
       if (err) throw err;
       console.log(items);

       var updates = items.map(i => i.encrpyted_update);
       console.log(updates);

       var result = { new_state: Math.max(...items.map(i => i.state)), update: updates, error: null};

      callback(result);
     });
}
