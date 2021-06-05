import os
import tempfile
import numpy as np
import pandas as pd
from numpy import loadtxt
import pickle
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.callbacks import Callback
from keras.layers import Dense
from keras import layers
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from keras import backend as K
from sklearn.metrics import r2_score
from sklearn.preprocessing import OrdinalEncoder, LabelEncoder, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn import preprocessing
from datetime import datetime
from copy import copy
from database import mongo

#mongo.db.progress.insert_one({"name":name, "ind":ind, "acc":acc})
class CustomCallback(Callback):
    def __init__(self, name):
        self.name = name
        

    def on_epoch_end(self, epoch, logs=None):
        ind = epoch
        acc = logs['accuracy']
        acc = int(acc*10000) / 10000
        mongo.db.progress.insert_one({"name":self.name, "ind":ind, "acc":acc})

def prepareData(data, variable, variables, modelType, name):
    Y = []
    elements = np.array([0]*len(data))
    data = data.T
    index = 0

    #get variables to train in elements
    while(index< len(variables)):
        if(index == variable):
            Y = data[index]
        elif(variables[index]):
            elements = np.vstack((elements,data[index]))
        index+=1

    elements = np.vstack((elements,Y))
    elements=elements[1:]
    elements=elements.T
    

    

    if(modelType=='neuralN'):
        coef = neuralN(elements, name)
    elif(modelType=='linearR'):
        coef = linearR(elements)
    elif(modelType=='randomFC'):
        coef = randomFC(elements, name)
    elif(modelType=='randomFR'):
        coef = randomFR(elements, name)
    return coef

def prepare_inputs_categorical(X_train):
	ohe = OneHotEncoder()
	ohe.fit(X_train)
	X_train_enc = ohe.transform(X_train).toarray()

	return X_train_enc

def prepare_inputs(X):
	oe = OrdinalEncoder()
	oe.fit(X)
	X = oe.transform(X)

	return X
# prepare target
def prepare_targets(y_train):
	le = LabelEncoder()
	le.fit(y_train)
	y_train_enc = le.transform(y_train)
	
	return y_train_enc

def neuralN(data, name):
    
    Y = prepare_targets(data[:,-1])
    data = prepare_inputs_categorical(data[:,:-1])
    
   
   
    X, test_X, y, test_y = train_test_split(data, Y, test_size=0.20, random_state=42)
    model = Sequential([
    layers.Dense(16, activation='relu'),
    layers.Dense(16, activation='relu'),
    layers.Dense(1, activation='sigmoid')
    ]) 

    model.compile(loss='binary_crossentropy',
                optimizer='adam', metrics=['accuracy']
                )

    model.fit(X, y,epochs=20, validation_split = 0.2, callbacks=[CustomCallback(name)])

    _ , acc = model.evaluate(test_X, test_y, verbose=0)

    
   
    print(acc)
    name = name.split(".")[0]
    model.save("models/"+name+'.h5')
    return acc



def linearR(data):
    data =  np.asarray(data).astype('float64')
    

    X, test_X, y, test_y = train_test_split(data[:,:-1], data[:,-1], test_size=0.20, random_state=42)

    reg = LinearRegression().fit(X, y)

  
    score = reg.score(test_X, test_y)
    print(score)
    return score

def randomFC(data, name):
    df = pd.DataFrame(data)
    target = df.columns[-1]
    ######## Manipulacion de la data
    # Discretizamos el target
    # Donde OK es 1, y 0 es Rechazado
    df[target] = df[target].map(lambda x: 1 if x == "OK" else 0)
    # Esta sera una lista de las columnas 
    cols = list( df.drop(columns = [target]).columns )
    # Discretizamos cols
    for i in cols:
        # Objeto para discretizar
        le = preprocessing.LabelEncoder()
        # Hacemos el fit a la columna de interes
        le.fit( df[i] )

        # transformamos la columna de interes
        df[i] = le.transform( df[i] )
    # Objeto de clasificacion
    clf = RandomForestClassifier(max_depth=2, random_state=0)

    # Hacemos el fit de la clasificacion
    clf = clf.fit( df.drop(columns = [target]), df[target] )

    name = name.split(".")[0]
    filename = name + '.pickle'
    
    pickle.dump(clf, open("models/"+filename, 'wb'))
    score = clf.score(df.drop(columns = [target]), df[target])
    print(score)
    return score

def randomFR(data, name):
    df = pd.DataFrame(data)
    target = df.columns[-1]
    ######## Manipulacion de la data
    cols = list( df.drop(columns = [target]).columns )
    # Discretizamos cols
    for i in cols:
        # Objeto para discretizar
        le = preprocessing.LabelEncoder()
        # Hacemos el fit a la columna de interes
        le.fit( df[i] )

        # transformamos la columna de interes
        df[i] = le.transform( df[i] )
    # Objeto de clasificacion
    clf = RandomForestRegressor(max_depth=2, random_state=0)

    # Hacemos el fit de la clasificacion
    clf = clf.fit( df.drop(columns = [target]), df[target] )
    
    name = name.split(".")[0]
    filename = name + '.pickle'
    pickle.dump(clf, open("models/"+filename, 'wb'))
    score = clf.score(df.drop(columns = [target]), df[target])
    print(score)
    return score
