from flask import Flask, request, jsonify
from flask_cors import CORS
from tablib import Dataset
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def hola_mundo():
    return json.dumps({'message': 'Hola Mundo'})

@app.route('/api/upload', methods = ['POST'])
def upload_file():
    raw_data = request.files['file'].read() 
    dataset = Dataset().load(raw_data, format='xlsx', headers=True)
    print(dataset)
    return "done"