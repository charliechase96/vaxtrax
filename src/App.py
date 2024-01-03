from flask import Flask
from models.user import db
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

with app.app_context():
    db.create_all() # This line creates all SQL tables based on the models

if __name__ == '__main__':
    app.run(debug=True)