
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const randomstring = require("randomstring");

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
  var upc = "000054491472";
  //getBarcodeInfo(dbClient, upc);

  var fridgeID = "testFridge2";
  var state = 3;
  //addUpdate(dbClient, fridgeID, state, "sampleString");

  getUpdates(dbClient, fridgeID, state);

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

        var result = { barcode: barcode, info: barcodeInfo, error: "null"}
        console.log(result);

         // I am not sure how to use callback so can't get it to return the barcodeInfo object
         //callback(result);
        });
    });
}


function addUpdate(dbClient, FridgeID, state, update) {
// id, state and string

   // Create the collection object for inserting documents into Fridges database
   const collection = dbClient.collection("Fridges");

   // Generate a random string
   // var randomstring = randomstring.generate(10);

   // *******************************
   // Not sure how to have a state counter tied to a fridge ID
   state++;

   // Create the document containing the ID, state and string
   var update = { fridge_id: FridgeID , state: state, string: update };

   // insert the document into the DB
   collection.insertOne(update, function(err, res) {
    if (err) throw err;
    console.log("Document inserted");

  });
}

function getUpdates(dbClient, fridgeID, currentState) {
// Take all updates that are bigger than the state and belong to the fridge
// return a list of the strings between the two states

     // create the collection object for retrieving documents
     const collection = dbClient.collection("Fridges");

     // items from the DB are stored in an array of dictionaries
     collection.find( { state: { $gt: currentState } }, { fridge_id: fridgeID } ).toArray(function(err, items) {
       if (err) throw err;
       console.log("Documents retrieved")

       var updates = [];
       for (var i = 0; i < items.length; i++) {
         updates.push(items[i].string);
       }
       console.log(updates);

       currentState++;
       var result = { new_state: currentState, update: updates, error: null};
       console.log(result);
     });

     // need to update and return state

   }
