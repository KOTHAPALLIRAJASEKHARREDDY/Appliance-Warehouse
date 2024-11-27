from pymongo import MongoClient
from flask import request
from bson import ObjectId
from datetime import datetime, timedelta

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

    @staticmethod
    def get_customers_collection():
        collection = DbManager.db['customers']
        return collection

    @staticmethod
    def get_rentals_collection():
        collection = DbManager.db['rentelAgrement']
        return collection

    @staticmethod
    def get_Appliances_Details_WithId(appliance_id):
        collection = DbManager.get_appliances_collection()
        return collection.find_one({'_id': ObjectId(appliance_id)})

    @staticmethod
    def get_customers_details(customer_id):
        collection = DbManager.get_customers_collection()
        return collection.find_one({'customer_id': customer_id})

    @staticmethod
    def get_user_by_mail(mail):
        collection = DbManager.get_users_collection()
        return collection.find_one({'email': mail})


    @staticmethod
    def add_order_to_db(appliance_id, usr_email):
        print(appliance_id, usr_email)
        product_data = DbManager.get_Appliances_Details_WithId(appliance_id)
        usr = DbManager.get_user_by_mail(usr_email)
        customer_id = usr['_id']
        user_name = usr['firstname'] +" "+ usr['lastname']
        address = usr['address']
        phone = usr['phone']
        email = usr['email']
        quantity = int(request.form.get('quantity'))
        customer_details = DbManager.get_customers_details(customer_id)
        customer_collection = DbManager.get_customers_collection()
        is_data_saved = False
        if customer_details is None:
            rental_history = [{ 'appliance_id':appliance_id, 'quantity': quantity, 'insurance': request.form.get('insurance') }]
            is_data_saved = customer_collection.insert_one({
                'customer_id': customer_id,
                'user_name': user_name,
                'address': address,
                'phone_number': phone,
                'email': email,
                'rental_history': rental_history
            })
        else:
            rental_history = customer_details['rental_history']
            found = False
            for entry in rental_history:
                if(entry['appliance_id'] == appliance_id and entry['insurance'] == request.form.get('insurance')):
                    entry['quantity'] = entry['quantity'] + quantity
                    found = True
                    break
            if not found:
                rental_history.append({ 'appliance_id':appliance_id, 'quantity': quantity, 'insurance': request.form.get('insurance') })
            is_data_saved = customer_collection.update_one({'customer_id': customer_id}, {'$set' : {'rental_history': rental_history}} )
        #adding in rental agreement
        rental_collection = DbManager.get_rentals_collection()
        delivery_type = request.form.get('delivery-type')
        print(delivery_type)
        if delivery_type == 'delivery':
            rental_start_date = request.form.get('delivery-date')
        else:
            rental_start_date = request.form.get('pickup-date')
        rental_start_date = datetime.strptime(rental_start_date, '%Y-%m-%d')
        rental_end_date = rental_start_date+ timedelta(days=7)
        rental_rate = int(product_data['rental_rate']) * quantity
        deposit_amount = int(product_data['deposit_amount']) * quantity
        total_amount = rental_rate + deposit_amount
        insurance_status = "Active" if request.form.get('insurance') == "yes" else "In Active"
        return_status = 'not returned'
        damage_report = 'none'

        rental_collection.insert_one({
            'appliance_id': ObjectId(appliance_id),
            'customer_id': customer_id,
            'rental_start_date': rental_start_date,
            'rental_end_date': rental_end_date,
            'quantity': quantity,
            'rental_rate': rental_rate,
            'deposit_amount': deposit_amount,
            'total_amount': total_amount,
            'insurance_status': insurance_status,
            'return_status': return_status,
            'damage_report': damage_report,
            'delivery_type': delivery_type
        })

        return is_data_saved
