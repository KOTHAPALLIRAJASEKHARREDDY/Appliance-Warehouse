from flask import request

def flask(param):
    pass


def user_login(collection):
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()

    if username and password:
        if username.lower() == 'admin' and password == 'Admin.123':
            return "Admin"
        else:
            isLogin = check_for_user_credentials(username, password, collection)
            if isLogin:
                print("redirecting to dashboard")
                return "true"
            else:
                return "false"
    return "false"



def check_for_user_credentials(username, password, collection):
    user = collection.find_one({'email': username})
    if user and user['password'] == password:
        print("returning true")
        return True
    return False

