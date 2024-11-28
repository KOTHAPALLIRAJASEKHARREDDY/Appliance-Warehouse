from dbManager import DbManager
from bson import ObjectId


def get_appliances_db():
    appliance_collection = DbManager.get_appliances_collection()

    appliances_cursor = appliance_collection.find()
    appliances_list = list(appliances_cursor)

    # Optionally, you can convert ObjectId to string if needed
    for appliance in appliances_list:
        appliance['_id'] = str(appliance['_id'])

    return appliances_list


def get_appliance_by_id(appliance_id):
    appliance_collection = DbManager.get_appliances_collection()
    appliance = appliance_collection.find_one({'_id': ObjectId(appliance_id)})
    appliance['_id'] = str(appliance['_id'])
    return appliance


def add_appliance_db(appliance):
    appliance_collection = DbManager.get_appliances_collection()
    appliance_collection.insert_one(appliance)
    return True


def update_appliance_db(appliance_id, appliance):
    appliance_collection = DbManager.get_appliances_collection()
    result = appliance_collection.update_one(
        {'_id': ObjectId(appliance_id)}, {'$set': appliance})
    if result.matched_count == 1:
        return True
    return False


def delete_appliance_db(appliance_id):
    appliance_collection = DbManager.get_appliances_collection()
    result = appliance_collection.delete_one({'_id': ObjectId(appliance_id)})
    if result.deleted_count == 1:
        return True
    return False
