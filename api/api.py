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
    print(dataset)
    while(data[0][-1] == None):
        data = np.delete(data, len(data[0])-1, 1)    
    headers = headers[:len(data[0])]

    while(data[len(data)-1][0] == None):
        data  = data[:len(data)-1]



    print(modelType)
    if(modelType=='neuralN'):
        coef = neuralN(data, headers)
    elif(modelType=='linearR'):
        coef = linearR(data, headers)

    return str(coef)