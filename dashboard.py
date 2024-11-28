from dbManager import DbManager
from bson import ObjectId


def get_rentals_db(user_id):
    rental_collection = DbManager.get_rentals_collection()
    appliance_collection = DbManager.get_appliances_collection()

    rentals_cursor = rental_collection.find({'customer_id': user_id})
    rentals_list = list(rentals_cursor)

    # Optionally, you can convert ObjectId to string if needed
    for rental in rentals_list:
        rental['_id'] = str(rental['_id'])

    # Add appliance details to each rental
    for rental in rentals_list:
        rental['_id'] = str(rental['_id'])
        appliance_id = rental.get('appliance_id')
        if appliance_id:
            appliance = appliance_collection.find_one(
                {'appliance_id': appliance_id})
            if appliance:
                rental['appliance_brand'] = appliance.get('brand')
                rental['appliance_model'] = appliance.get('model')
                rental['appliance_type'] = appliance.get('type')

    return rentals_list
