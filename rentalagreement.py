from dbManager import DbManager
from bson import ObjectId


def get_products_by_ids_db(productIds, user):
    rental_collection = DbManager.get_rentals_collection()

    print('products', productIds)
    product_list = []
    for productId in productIds:

        product_cursor = rental_collection.find(
            {'customer_id': ObjectId(user['user_id']), '_id': ObjectId(productId)})
        product = list(product_cursor)
        product_list.extend(product)

    # Optionally, you can convert ObjectId to string if needed
    for product in product_list:
        product['_id'] = str(product['_id'])
        product['appliance_id'] = str(product['appliance_id'])
        product['customer_id'] = str(product['customer_id'])

    return product_list
