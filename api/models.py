import numpy as np
from numpy import loadtxt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from keras import backend as K

def neuralN(data, headers):
    
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

    r2 =np.array( correlation_coefficient(test_y, y_pred))
    print(r2)
    return loss

def correlation_coefficient(y_true, y_pred):
    x = y_true
    y = y_pred
    mx = K.mean(K.constant(x))
    my = K.mean(K.constant(y))
    xm, ym = x-mx, y-my
    r_num = K.sum(xm * ym)
    r_den = K.sum(K.sum(K.square(xm)) * K.sum(K.square(ym)))
    r = r_num / r_den
    return 1-r**2



def linearR(data, headers):
    data =  np.asarray(data).astype('float64')
    scaler = MinMaxScaler()
    scaler.fit(data)
    data = scaler.transform(data)

    X, test_X, y, test_y = train_test_split(data[:,:-1], data[:,-1], test_size=0.20, random_state=42)

    reg = LinearRegression().fit(X, y)

    score = reg.score(test_X, test_y)
    print(score)
    return score

