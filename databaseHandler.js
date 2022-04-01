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

const USER_TABLE_NAME = "Users"
module.exports = {insertObject, checkUserRole, USER_TABLE_NAME}