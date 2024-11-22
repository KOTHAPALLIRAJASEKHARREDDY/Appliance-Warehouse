from flask import Flask, request, render_template, send_from_directory, redirect, url_for, flash, session
from dbManager import DbManager
from validators import validate_input
from login import user_login
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'ABCD123'
app.permanent_session_lifetime = timedelta(minutes=30)

@app.route('/')
def index():
    collection = DbManager.get_appliances_collection()
    items_Data = collection.find()
    return render_template('homepage.html', product_data=items_Data)


@app.route('/login', methods=['GET', 'POST'])
@app.route('/login.html', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        isLogin = user_login(DbManager.get_users_collection())
        if isLogin == 'true':
            session.permanent = True
            session['email'] = request.form.get('username', '').strip()
            return redirect(url_for('user_dashboard'))
        else:
            flash('Invalid username or password')
            return render_template('login.html')
    else:
        if 'email' in session:
            return redirect(url_for('user_dashboard'))
        return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        print(request.form)
        user_data = validate_input()
        (DbManager.get_users_collection()).insert_one(user_data)
        return "Account created successfully!"
    else:
        return render_template('signup.html')

@app.route('/logout')
def logout():
    if 'email' in session:
        session.pop('email', None)
        return redirect(url_for('login'))
    else:
        return 'already logout'


@app.route('/dashboard')
def user_dashboard():
    if session.get('email') is None:
        return redirect(url_for('login'))
    user_details = (DbManager.get_users_collection()).find_one({'email': session['email']})
    usr_name = user_details['firstname']
    return render_template('userdashboard.html', name=usr_name)


def admin():
    pass

@app.route('/css/<path:filename>')
def send_css(filename):
    return send_from_directory('./css/', filename)

@app.route('/script/<path:filename>')
def send_javascript(filename):
    return send_from_directory('./script/', filename)

@app.route('/images/<path:filename>')
def send_imagesfile(filename):
    return send_from_directory('./images/', filename)


if __name__ == '__main__':
    app.run(debug=True)