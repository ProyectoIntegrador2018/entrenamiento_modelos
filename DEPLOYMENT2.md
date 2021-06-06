# Deployment Instructions for the Product after Sprint 1

### Setup the project

Before setting up the project, you need to install the following three packages:

 * [Node.js](https://nodejs.org/en/)
 * [Yarn](https://yarnpkg.com/)
 * [Python](https://www.python.org)
 * [Firebase](https://firebase.google.com)

Supported versions for python: Python 3.5-3.8  64-bit

After installing, you can follow these simple steps:

1. Clone this repository into your local machine

```
$ git clone https://github.com/ProyectoIntegrador2018/entrenamiento_modelos.git
```

2. Inside the api folder open a terminal and run this to create a Python env:

```
% python3 -m venv venv
```
  If you are using windows
  
```
% python -m venv venv
```

3. In the same terminal run the following command:

```
% source venv/bin/activate
```
  If you are using windows
  
```
% venv\Scripts\activate logs
```

4. Install the dependencies:

```
% pip install -r requirements.txt
```

5. Fire up a terminal inside client folder and run:

```
$ npm install
```
### Deploy in Heroku
1. Create an account on Heroku:

 https://www.heroku.com/

2. Install heroku CLI in your machine

```
$ npm install -g heroku
```

3. Acces to the acount throught the next command:

```
$ herokulogin
```

4. Create a new app inside the heroku portal

Click on create app

5. Install gunicorn server with the next command:

```
% pip install gunicorn
```

6. In the git terminal run the next command:

```
% heroku git:remote -a <app-name>
```

7. Create a file called Procfile in the git terminal:

```
% touch Procfile
```

8. Add the next content to the Procfile:

```
% web: gunicorn api:app
```

9. List al the requirements in the requirements.txt in the server terminal:

```
% pip freeze > requirements.txt
```

10. When you are ready to upload all the changes to heroky run the next command:

```
% git push heroku master
```