# Models Training
Tool for Ternium to allow them to train new models based on historical data and upload files with a graphic interface. 

## Table of contents

* [Client Details](#client-details)
* [Environment URLS](#environment-urls)
* [Team](#team)
* [Technology Stack](#technology-stack)
* [Management resources](#management-tools)
* [Setup the project](#setup-the-project)
* [Running the stack for development](#running-the-stack-for-development)
* [Stop the project](#stop-the-project)
* [Restoring the database](#restoring-the-database)
* [Debugging](#debugging)
* [Running specs](#running-specs)
* [Checking code for potential issues](#checking-code-for-potential-issues)


### Client Details

| Name               | Email             | Role |
| ------------------ | ----------------- | ---- |
| Marco Antonio del Valle C. | mdelvalc@ternium.com.mx |   |


### Environment URLS

* **Production** - [TBD](TBD)
* **Development** - [TBD](TBD)

### Team

| Name           | Email             | Role        |
| -------------- | ----------------- | ----------- |
| Fiacro Gilberto Reyes López | A01730836@itesm.com | Development |
| Gerardo Guillermo Garza Tamez | A01380899@itesm.com | Development |
| Sergio González Sifuentes  | A00821229@itesm.com  | Development |
| Miguel Ángeles Ortiz | A01730939@itesm.com  | Development |

### Technology Stack
| Technology    | Version      |
| ------------- | -------------|
| NodeJS  | v14.10.1     |
| NPM  | 6.14.8    |
| Python3  | 3.7.10     |

### Management tools

You should ask for access to this tools if you don't have it already:

* [Github repo](https://github.com/ProyectoIntegrador2018/entrenamiento_modelos)
* [Backlog](https://teams.microsoft.com/_?lm=deeplink&lmsrc=homePageWeb&cmpid=WebSignIn#/xlsx/viewer/teams/https:~2F~2Ftecmx.sharepoint.com~2Fsites~2FProy.IntegradorFJ2021-grupo1-Equipo1.1~2FShared%20Documents~2FEquipo%201.1~2FProduct%20Backlog%20-%20Plantilla.xlsx?threadId=19:f6812e469f1e42faab54f0749326e3b0@thread.tacv2&baseUrl=https:~2F~2Ftecmx.sharepoint.com~2Fsites~2FProy.IntegradorFJ2021-grupo1-Equipo1.1&fileId=3f6fbbf1-5cdc-4d66-af6a-ebeb2e9f9839&ctx=files&rootContext=items_view&viewerAction=view)
* [Documentation](https://teams.microsoft.com/_?lm=deeplink&lmsrc=homePageWeb&cmpid=WebSignIn#/school/files/Equipo%201.1%20-%20Los%20Compadres?threadId=19:f6812e469f1e42faab54f0749326e3b0@thread.tacv2&ctx=channel)

## Development

### Setup the project

Before setting up the project, you need to install the following three packages:

 * [Node.js](https://nodejs.org/en/)
 * [Yarn](https://yarnpkg.com/)
 * [Python](https://www.python.org)

After installing, you can follow these simple steps:

1. Clone this repository into your local machine

```
$ git clone https://github.com/ProyectoIntegrador2018/entrenamiento_modelos.git
```

2. Inside the api folder you need to create a Python env with the following command:

```
% python3 -m venv venv
```
  If you are using windows
  
```
% python -m venv venv
```

3. Fire up a terminal inside client folder and run:

```
$ npm install
```

### Running the stack for Development

1. Inside the api folder run this:

```
% source venv/bin/activate
```
  If you are using windows
  
```
% venv\Scripts\activate logs
```

2. Before running the server you need run:

```
$ pip install flask python-dotenv
```

3. Install CORS to allow the client side to make requests

```
$ pip install -U flask-cors
```

3. And you start the server with:

```
$ flask run
```

4. Finally to start the front end part you need to type this in a terminal inside the client folder:

```
$ npm start
```


Once you see an output like this in the api terminal:

```
* Serving Flask app "api.py" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 847-005-851
```

And something like this in the client side:

```
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.106:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

```

This means the project is up and running.

### Stop the project

The server and front end part can be stopped with well known command

```
ctrl + c
```

### Restoring the database

In this case the data storage will be managed without a database by request of the client

### Debugging

[TBD](TBD)

### Running specs

[TBD](TBD)

### Checking code for potential issues

[TBD](TBD)
