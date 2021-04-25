import numpy as np
from numpy import loadtxt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from keras import backend as K
from sklearn.metrics import r2_score


def prepareData(data, variable, variables, modelType):
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
    

    print(elements)
    print(type(elements[0][0]))
    print(modelType)

    if(modelType=='neuralN'):
        coef = neuralN(elements)
    elif(modelType=='linearR'):
        coef = linearR(elements)

    return coef

def neuralN(data):
    
    data =  np.asarray(data).astype('float64')
    scaler = MinMaxScaler()
    scaler.fit(data)
    #data = scaler.transform(data)

    X, test_X, y, test_y = train_test_split(data[:,:-1], data[:,-1], test_size=0.20, random_state=42)

    model = Sequential([
    layers.Dense(64, activation='relu'),
    layers.Dense(64, activation='relu'),
    layers.Dense(1)
    ]) 

    model.compile(loss='mean_squared_error',
                optimizer='adam'
                )

    model.fit(X, y,epochs=80, validation_split = 0.2)

    loss = model.evaluate(test_X, test_y, verbose=0)
    y_pred = model.predict(test_X)

    r2 = r2_score(test_y, y_pred)
    print(r2)
    return r2



def linearR(data):
    data =  np.asarray(data).astype('float64')
    scaler = MinMaxScaler()
    scaler.fit(data)
    #data = scaler.transform(data)

    X, test_X, y, test_y = train_test_split(data[:,:-1], data[:,-1], test_size=0.20, random_state=42)

    reg = LinearRegression().fit(X, y)

    score = reg.score(test_X, test_y)
    print(score)
    return score

