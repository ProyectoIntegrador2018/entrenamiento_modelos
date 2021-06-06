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
### Deploy in firebase
1. Login in the FirebaseConsole with the credencials in Accesos.txt in the next page:

```
$ https://accounts.google.com/signin/v2/identifier?flowName=GlifWebSignIn&flowEntry=ServiceLogin
```

2. Install Firebase CLI in your machine

```
$ npm install -g firebase-tools
```

3. Acces to the acount throught the next command:

```
$ firebase login
```

3. Inside the client Folder inicialize firebase

```
% firebase init
```
  Select hosting navigating with the arrows and select the opcion with spacebar and then press enter

  Do not replace the index.html and not link-it with github
  

4. In the firebase.json change public atributte:

```
% "public": "build",
```

5. In the terminal of Client use the following command:

```
% npm run deploy
```

6. Deploy the proyect to firebase with the next command:

```
% firebase deploy
```