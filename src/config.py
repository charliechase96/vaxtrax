import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///vaxtrax.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
    JWT_SECRET_KEY = os.urandom(24)