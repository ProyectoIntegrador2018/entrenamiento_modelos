from flask import Flask, request, jsonify, Response,  send_file, send_from_directory, safe_join, abort
from database import mongo
from flask_cors import CORS
from tablib import Dataset
import json
import numpy as np
import time
from models import *
import sys


app = Flask(__name__)
if __name__ == '__main__':
    flaskapp.run(debug=True)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://dbuser:proyecto1@cluster0-khqt6.mongodb.net/progress?authSource=admin"
mongo.init_app(app)



@app.route('/')
def hola_mundo():
    return json.dumps({'message': 'Hola Mundo'})

@app.route('/api/progress')
def progress():
    name = request.args.get("name")
    ind = request.args.get("index")
    limit = 10000
    x = None
    while(x == None and limit >= 0):
        x = mongo.db.progress.find_one({  "name": name, "ind": int(ind) })
        time.sleep(100/ 1000)
        limit-=100
    
    mongo.db.progress.delete_many({  "name": name, "ind": int(ind) })

    if(x== None):
        return str("Not found")
    
    return str(x["acc"])

@app.route('/api/getModel')
def getModel():
    name = request.args.get("name")
    model = request.args.get("model")
    print(name, model)
    if(model == "neuralN"):
        name = name+".h5"
    else:
        name = name+".pickle"
    try:
        return send_from_directory("models/", filename=name, as_attachment=True)
    except FileNotFoundError:
        abort(404)
    
    

@app.route('/api/upload/<modelType>', methods = ['POST'])
def upload_file(modelType):
    raw_data = request.files['file'].read() 
    dataset = Dataset().load(raw_data, format='xlsx', headers=True)
    name = request.form["name"]
    mongo.db.progress.delete_many({  "name": name })

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
    
    coef = prepareData(data, variable, variables, modelType, name)

    return str(coef)