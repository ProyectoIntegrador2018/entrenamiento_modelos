from flask import Flask
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def hola_mundo():
    return json.dumps({'message': 'Hola Mundo'})