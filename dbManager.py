from pymongo import MongoClient

class DbManager:
    client = MongoClient(
        'mongodb+srv://rxk40660:Admin123@cluster0.oxjxd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    db = client['project']


    @staticmethod
    def get_users_collection():
        collection = DbManager.db['users']
        return collection

    @staticmethod
    def get_payment_collection():
        collection = DbManager.db['payment']
        return collection

    @staticmethod
    def get_appliances_collection():
        collection = DbManager.db['appliances']
        return collection


