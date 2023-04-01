const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

let client;

const getClient = async () => {
    if (client) {
        console.log("DB CLIENT ALREADY CONNECTED");
    } else
        try {
            client = MongoClient.connect(MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("DB CLIENT RECONNECTED");
        } catch (e) {
            throw e;
        }

    return client;
};

const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

const insertDocument = async (document) => {
    try {
        let client = await getClient();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);
        await collection.insertOne(document);
    } catch (error) {
        console.log(error);
    }
};

const getDocument = async (search) => {
    try {
        let client = await getClient();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);
        result = await collection.findOne(search);
        if (!result) {
            return {
                status: 0,
                user: result
            };
        }
        return {
            status: 1,
            user: result
        };
    } catch (error) {
        console.log(error);
        return {
            status: -1,
            user: null
        };
    }
};

const updateDocument = async (search, update, message) => {
    try {
        let client = await getClient();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);
        if (message === '') {
            await collection.updateOne(search, { $set: update });
        } else {
            await collection.updateOne(search, { $set: update, $push: { messages: message } }, { multi: true });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getDocument,
    insertDocument,
    updateDocument
}
