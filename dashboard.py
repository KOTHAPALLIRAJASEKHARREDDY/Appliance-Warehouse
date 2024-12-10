from dbManager import DbManager
from bson import ObjectId


def get_rentals_db(user_id):
    rental_collection = DbManager.get_rentals_collection()
    appliance_collection = DbManager.get_appliances_collection()

    rentals_cursor = rental_collection.find({'customer_id': ObjectId(user_id)})
    rentals_list = list(rentals_cursor)

    # Add appliance details to each rental
    for rental in rentals_list:
        rental['_id'] = str(rental['_id'])
        rental['appliance_id'] = str(rental['appliance_id'])
        rental['customer_id'] = str(rental['customer_id'])
        appliance_id = rental.get('appliance_id')
        print('before', appliance_id)
        if appliance_id:
            appliance = appliance_collection.find_one(
                {'_id': ObjectId(appliance_id)})
            print('appliance', appliance)
            if appliance:
                rental['appliance_brand'] = appliance.get('brand')
                rental['appliance_model'] = appliance.get('model')
                rental['appliance_type'] = appliance.get('type')

    # print('after', rentals_list)
    return rentals_list
