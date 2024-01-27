import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgres://charliechasegray:WrRwcVJ1zTCQpwdscEqXyLFwQ0V8Rx20@dpg-cmtnud2cn0vc73bfsvug-a.oregon-postgres.render.com/vaxtrax_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
    JWT_SECRET_KEY = os.urandom(24)