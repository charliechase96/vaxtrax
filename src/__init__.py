#!/usr/bin/env python3
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from flask_restful import Api
from .config import Config

# Load environment variables
load_dotenv()

# Initialize Flask extensions but don't associate them with an app yet
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
api = Api()

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with app context
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    api.init_app(app)
    
    CORS(app, resources={
    r"/*": {
        "origins": ["https://vaxtrax.pet", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Authorization"],
        "supports_credentials": True
        }
    })

    # Import and register models
    from .models.user import User
    from .models.pet import Pet
    from .models.vaccine import Vaccine
    from .models.alert import Alert

    return app