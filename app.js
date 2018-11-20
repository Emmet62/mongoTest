
const request = require('request');
var crypto    = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://SenneS_Admin:SenneS2018@sennescluster-onimy.mongodb.net/SenneSDB"

var upc = "721898049963";
var FridgeID = "sampleFridgeID";
//getBarcodeInfo(upc, FridgeID);
getUpdates(FridgeID);

function getBarcodeInfo(barcode) {

    // query for UPCitemdb database
    var query = "https://api.upcitemdb.com/prod/trial/lookup?upc="+barcode;

    const options = {
        url: query,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    // parse the returned object for information we want to input to the DB
    request(options, function(err, res, body) {
        var obj = JSON.parse(body);
        var title = obj.items[0].title;
        var brand = obj.items[0].brand;
        var size = obj.items[0].size;
        var weight = obj.items[0].weight;
        var barcodeInfo = {
          title: title,
          brand: brand,
          size: size,
          weight: weight
        };
        console.log(barcodeInfo);

        // I had to combine these two functions as I could not work out how to access the returned dictionary

        MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
           if(err) {
                console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
           }
           console.log('Connected...');

           // create the collection object for inserting documents
           const collection = client.db("SenneSDB").collection(FridgeID);

           // populate the document with information from barcode database
           var doc = { name: barcodeInfo.title , brand: barcodeInfo.brand, size: barcodeInfo.size, weight: barcodeInfo.weight };

           // insert the document into the DB
           collection.insertOne(doc, function(err, res) {
            if (err) throw err;
            console.log("Document inserted");

           // need to update and return state
           client.close();

          });
        });
    });
}

function addUpdate(item, FridgeID) {

  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
     if(err) {
          console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
     }
     console.log('Connected...');

     // create the collection object for inserting documents
     const collection = client.db("SenneSDB").collection(FridgeID);

     // populate the document with information from barcode database
     var doc = { name: "", brand: "", size: "" };

     // insert the document into the DB
     collection.insertOne(doc, function(err, res) {
      if (err) throw err;
      console.log("Document inserted");

     // need to update and return state
     client.close();
    });
  });
}

function getUpdates(fridgeID) {

  MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
     if(err) {
          console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
     }
     console.log('Connected...');

     // create the collection object for retrieving documents
     const collection = client.db("SenneSDB").collection(FridgeID);

     // items from the DB are stored in an array of dictionaries
     collection.find().toArray(function(err, items) {
       if (err) throw err;
       console.log("Documents retrieved")
       console.log(items);
     });

     // need to update and return state
     client.close();
   });
 }

function removeDoc() {
  // function to remove item from DB
  return 1;
}
