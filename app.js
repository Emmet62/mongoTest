const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://SenneS_Admin:SenneS2018@sennescluster-onimy.mongodb.net/SenneSDB"

MongoClient.connect(uri, { useNewUrlParser: true }, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');

   // cretae the collection object for inserting documents
   // collection will need to be filled with the FridgeID
   const collection = client.db("SenneSDB").collection("sampleFridgeID");

   // document to be inserted
   // will need to be populated with information from the getBarcodeInfo function
   var doc = { name: "PepsiMax", size: "500" };

   // insert the document
   collection.insertOne(doc, function(err, res) {
    if (err) throw err;
    console.log("Document inserted");

   client.close();
  });
});
