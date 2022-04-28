const {MongoClient,ObjectId} = require('mongodb');

const URL = "mongodb+srv://admin86:12345DD@cluster0.k6d3f.mongodb.net/GCH0902-ApplicationDev?retryWrites=true&w=majority"
const DATABASE_NAME = "Book-store"

async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

async function insertObject(collectionName,objectToInsert){
    const dbo = await getDB();
    const newObject = await dbo.collection(collectionName).insertOne(objectToInsert);
    console.log("Gia tri id moi duoc insert la: ", newObject.insertedId.toHexString());
}

async function checkUserLogin(nameI) {
    const dbo = await getDB();
    const results = await dbo.collection("Users").findOne({userName: nameI})
    if (results) {
    return results;
    } else {
    return -1;
    }
}

async function findOne(collectionName, findObject) {
    const dbo = await getDB();
    const result = await dbo.collection(collectionName).findOne(findObject);
    return result;
}

async function checkUserRole(nameI) {
    const dbo = await getDB();
    const user = await dbo.collection("Users").findOne({userName: nameI})
    if (user == null) {
    return -1;
    } else {
    return user.role;
    }
}

async function getUser(name) {
    const dbo = await getDB();
    const result = await dbo.collection("Users").findOne({ userName: name })
    return result;
}

async function getAllDocumentsFromCollection(collectionName) {
    const dbo = await getDB()
    const results = await dbo.collection(collectionName).find({}).toArray()
    return results
}

async function deleteDocumentById(collectionName, id) {
    const dbo = await getDB()
    await dbo.collection(collectionName).deleteOne({ _id: ObjectId(id) })
}

async function updateCollection(collectionName, myquery, newvalues) {
    const dbo = await getDB()
    await dbo.collection(collectionName).updateOne(myquery, newvalues)
}

async function getDocumentById(collectionName, id) {
    const dbo = await getDB()
    const productToEdit = await dbo.collection(collectionName).findOne({ _id: ObjectId(id) })
    return productToEdit
}

async function FindAllDocumentsByName(value) {
    const dbo = await getDB()  
    const results = await dbo.collection("Products").find({name: new RegExp(value)}).limit(10).toArray() 
    return results
}

async function FindDocumentsByGmail(value) {
    const dbo = await getDB()
    const results = await dbo.collection("Users").findOne({gmail: value})
    return results
}

async function getCustomer(collectionName) {
    const dbo = await getDB();
    const customers = await dbo.collection(collectionName).find({role: 'Customer'}).toArray()
    return customers
}

async function FindDocumentsById(collectionName, id) {
    const dbo = await getDB()
    const results = await dbo.collection(collectionName).findOne({ _id: ObjectId(id)})
    return results
}

async function getAllFeedback() {
    const result = await getAll("Feedback");
    result.forEach(
        (e) => (e.timeString = new Date(e.time).toLocaleString("vi-VN"))
    )
    return result
}

async function updateDocument(id, data, collectionName) {
    const dbo = await getDB()
    await dbo.collection(collectionName).updateOne(id, data)
}
const USER_TABLE_NAME = "Users"
module.exports = {
    getCustomer,
    insertObject,
    FindDocumentsByGmail, 
    FindAllDocumentsByName, 
    findOne,checkUserRole, 
    checkUserLogin, 
    getUser,
    USER_TABLE_NAME, 
    getAllDocumentsFromCollection, 
    deleteDocumentById, 
    updateCollection,
    FindDocumentsById,
    getAllFeedback,
    getDocumentById,
    updateDocument}