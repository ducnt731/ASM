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

async function checkUserRole(nameI, passI){
    const dbo = await getDB();
    const user = await dbo.collection(USER_TABLE_NAME).findOne({userName:nameI, password:passI});
    //Neu ko trung user name va password
    if (user==null) {
        return "-1"
    }else{
        console.log(user)
        //Tra lai: role cua user, admin, staff
        return user.role;
    }
}

async function insertObjectToCollection(collectionName,obj){
    const dbo = await getDB()
    const result = await dbo.collection(collectionName).insertOne(obj)
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
const USER_TABLE_NAME = "Users"
module.exports = {insertObject, checkUserRole, USER_TABLE_NAME, insertObjectToCollection, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById}