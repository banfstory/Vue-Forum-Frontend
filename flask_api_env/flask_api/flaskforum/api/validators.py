import re

# User validation
def validEmail(email, errors):
    if len(email) > 254:
        return False
    pattern = r'^([\w\.-]+)@([a-zA-Z-]+).([a-zA-Z]{2,10})(\.[a-zA-Z]{2,10})$'
    return True if re.search(pattern, email) else False

def EmailMessage():
    return ''

def validPassword(password, errors):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!"#$%&\'\\()*+,-./:;<=>?@[\\\]^_`{|}~])[a-zA-Z\d!"#$%&\'\\()*+,-./:;<=>?@[\\\]^_`{|}~]{8,128}$'
    return True if re.search(pattern, password) else False

def PasswordMessage():
    return ''

def validUsername(username, errors):
    pattern = r'^\w{3,25}$'
    return True if re.search(pattern, username) else False

def UsernameMessage():
    return ''   

#Forum validation
def validForumName(name, errors):
    pattern = r'^\w{3,25}$'
    return True if re.search(pattern, name) else False

def ForumNameMessage():
    return ''  

def validForumAbout(about, errors):
    pattern = r'^.{1,30000}$'
    return True if re.search(pattern, about) else False

def ForumAboutMessage():
    return '' 

#Post validation
def validPostTitle(title, errors):
    pattern = r'^.{1,5000}$'
    return True if re.search(pattern, title) else False

def PostTitleMessage():
    return '' 

def validPostContent(content, errors):
    pattern = r'^.{1,30000}$'
    return True if re.search(pattern, content) else False  
   
def PostContentMessage():
    return '' 

#Comment validation
def validCommentContent(content, errors):
    pattern = r'^.{1,20000}$'
    return True if re.search(pattern, content) else False  

def CommentContentMessage():
    return '' 

#Reply validation
def validReplyContent(content, errors):
    pattern = r'^.{1,20000}$'
    return True if re.search(pattern, content) else False

def ReplyContentMessage():
    return '' 

#Invalid Request Message
def InvalidRequest():
    return {'message' : 'Invalid request'}