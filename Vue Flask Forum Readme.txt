Instructions

For this website, it is required that two local servers are running at the same time, one will be used for the Restful Flask API and the other will be used for Vue Js frontend. 

FLASK RESTFUL API INSTRUCTIONS:
To run the Flask API, it needs to run on a local server and it will be running the application from a virtual environment so that all packages will be already pre-installed within the whole folder itself.

To run the virtual environment do the following (instructions for windows OS only), start with going into command prompt:

1. Go to the following path: vue_forum_flask (folder) > flask_api_env (folder)
2. Enter 'venv\Scripts\activate' to activate the virtual environment
3. Go to the following path: vue_forum_flask (folder) > flask_api_env (folder) > flask_api (folder)
4. Enter 'python run.py' to run the local server

If you want to change the port number for the localhost, go to the following path: vue_forum_flask (folder) > flask_api_env (folder) > flask_api (folder) > run.py . Look for the code 'app.run(debug=True, port=5000)' on line 14 and change the 'port' parameter 
(localhost uses port number 5000 by default)

VUE JS FRONTEND INSTRUCTIONS:
To run the local server of the Vue js website, start with going into command prompt:

1. Go to the following path: vue_forum_flask (folder) > vue_frontend (folder)
2. Enter 'npm run serve' to run the local server
