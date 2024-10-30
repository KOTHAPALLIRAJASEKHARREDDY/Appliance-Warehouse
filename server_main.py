from gc import collect

from flask import Flask, request, render_template, send_from_directory
from pymongo import MongoClient
import re

app = Flask(__name__)

client = MongoClient('mongodb+srv://rxk40660:Admin123@cluster0.oxjxd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['project']
collection = db['users']

@app.route('/')
def index():
    return render_template('SignUp.html')

@app.route('/signup', methods=['POST'])
def signup():
    print(request.form)
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    phone = request.form['phone']
    ssn = request.form['ssn']
    password = request.form['password']

    user_data = {
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'phone': phone,
        'ssn': ssn,
        'password': password
    }

    collection.insert_one(user_data)

    return "Account created successfully!"

@app.route('/css/<path:filename>')
def send_css(filename):
    print(filename)
    return send_from_directory('./css/', filename)

@app.route('/script/<path:filename>')
def send_javascript(filename):
    print(filename)
    return send_from_directory('./script/', filename)

if __name__ == '__main__':
    app.run(debug=True)