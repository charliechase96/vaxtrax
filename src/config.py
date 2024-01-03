import os

class Config:
    SECRET_KEY = os.urandom(24) #generate a random secret key
    SQLALCHEMY_DATABASE_URI = 'sqlite:///vaxtrax.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.urandom(24)