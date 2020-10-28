import re

def validEmail(email):
    pattern = r'^([\w\.-]+)@([a-zA-Z-]+).([a-zA-Z]{2,10})(\.[a-zA-Z]{2,10})$'
    return True if re.search(pattern, email) else False

def validPassword(password):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!"#$%&\'\\()*+,-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z\d!"#$%&\'\\()*+,-./:;<=>?@[\\\]^_`{|}~]{8,128}$'
    return True if re.search(pattern, password) else False

def username_no_space(username):
    pattern = r'^\w{3,25}$'
    return True if re.search(pattern, username) else False
