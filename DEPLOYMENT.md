# Deployment Instructions for the Product after Sprint 1

### Setup the project

Before setting up the project, you need to install the following three packages:

 * [Node.js](https://nodejs.org/en/)
 * [Yarn](https://yarnpkg.com/)
 * [Python](https://www.python.org)

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