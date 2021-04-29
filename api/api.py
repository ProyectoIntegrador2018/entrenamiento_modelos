from flask import Flask, request, jsonify
from flask_cors import CORS
from tablib import Dataset
import json
import numpy as np
import time
from models import *
import sys




app = Flask(__name__)
app.run(debug=True)
CORS(app)


@app.route('/')
def hola_mundo():
    return json.dumps({'message': 'Hola Mundo'})

@app.route('/api/upload/<modelType>', methods = ['POST'])
def upload_file(modelType):
    raw_data = request.files['file'].read() 
    dataset = Dataset().load(raw_data, format='xlsx', headers=True)
    
    data = np.array(dataset)
    headers = np.array(dataset.headers)
    #index variable to predict
    variable = int(request.form["variable"])
    #array of variables used for training
    variables = request.form["variables"]
    variables = list(variables.split(","))
    variables = np.array([True if x=="true" else False for x in variables])

    while(data[0][-1] == None):
        data = np.delete(data, len(data[0])-1, 1)    
    headers = headers[:len(data[0])]
    while(data[len(data)-1][0] == None):
        data  = data[:len(data)-1]
    
    coef = prepareData(data, variable, variables, modelType)

    return str(coef)