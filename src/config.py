import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://charlie_chase_gray:BLONDIE_96@localhost/vaxtrax_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
    JWT_SECRET_KEY = os.urandom(24)