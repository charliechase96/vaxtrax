from flask import Flask, jsonify, request
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models.user import User, db
from models.pet import Pet
from models.vaccine import Vaccine
from models.alert import Alert
from config import Config
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

migrate = Migrate(app, db)

db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://vaxtrax.pet", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Authorization"],
        "supports_credentials": True
        }
    })

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad email or password"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=16)
    new_user = User(email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully!'}), 201

@app.route('/api/add_pet', methods=['POST'])
def add_pet():
    data = request.get_json()

    try:
        birthday_date = datetime.strptime(data['birthday'], '%Y-%m-%d').date()

    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    try:
        new_pet = Pet(
            img_url=data['img_url'],
            name=data['name'],
            type=data['type'],
            breed=data['breed'],
            birthday=birthday_date
        )
        db.session.add(new_pet)
        db.session.commit()
        return jsonify({"message": "Pet added successfully", "pet": data}), 201
    
    except Exception as e:
        print("Error adding pet:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    pet_list = [{
        'id': pet.id,
        'img_url': pet.img_url,
        'name': pet.name,
        'type': pet.type,
        'breed': pet.breed,
        'birthday': pet.birthday.strftime("%Y-%m-%d")
    } for pet in pets]

    return jsonify(pet_list)

@app.route('/api/add_vaccine', methods=['POST'])
def add_vaccine():
    data = request.get_json()

    try:
        vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()

    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    try:
        new_vaccine = Vaccine(
            name=data['name'],
            due_date=vaccine_due_date
        )
        db.session.add(new_vaccine)
        db.session.commit()
        return jsonify({"message": "Vaccine added successfully", "vaccine": data}), 201
    
    except Exception as e:
        print("Error adding vaccine:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/vaccines', methods=['GET'])
def get_vaccines():
    vaccines = Vaccine.query.all()
    vaccine_list = [{
        'id': vaccine.id,
        'name': vaccine.name,
        'due_date': vaccine.due_date.strftime("%Y-%m-%d")
    } for vaccine in vaccines]

    return jsonify(vaccine_list)

@app.route('/api/delete_pet/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    try:
        pet = Pet.query.get(pet_id)
        if pet is None:
            return jsonify({"message": "Pet not found"}), 404

        db.session.delete(pet)
        db.session.commit()
        return jsonify({"message": "Pet deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/delete_vaccine/<int:vaccine_id>', methods=['DELETE'])
def delete_vaccine(vaccine_id):
    try:
        vaccine = Vaccine.query.get(vaccine_id)
        if vaccine is None:
            return jsonify({"message": "Vaccine not found"}), 404

        db.session.delete(vaccine)
        db.session.commit()
        return jsonify({"message": "Vaccine deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add an alert
@app.route('/api/add_alert', methods=['POST'])
def add_alert():
    data = request.get_json()
    print("Received data:", data)

    try:
        # Extract the vaccine name and due date from the nested dictionary
        vaccine_name = data.get('vaccine_name', '')
        alert_date = datetime.strptime(data['alert_date'], '%Y-%m-%d').date()
        vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
        print("Extracted due_date:", vaccine_due_date)

        new_alert = Alert(
            vaccine_name=vaccine_name, 
            alert_date=alert_date,
            due_date=vaccine_due_date, 
            vaccine_id=data['vaccine_id']
        )
        db.session.add(new_alert)
        db.session.commit()

        added_alert = Alert.query.filter_by(id=new_alert.id).first()
        if added_alert:
            print("Newly added alert:", added_alert)

        print("New alert added:", new_alert)
        return jsonify({"message": "Alert added successfully"}), 201
    except KeyError:
        return jsonify({"error": "Invalid data format"}), 400
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# Get all alerts
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    alerts = Alert.query.all()
    alert_list = [{
        'id': alert.id,
        'vaccine_name': alert.vaccine_name,
        'alert_date': alert.alert_date.strftime("%Y-%m-%d"),
        'due_date': alert.due_date.strftime("%Y-%m-%d"),
        'vaccine_id': alert.vaccine_id
    } for alert in alerts]
    return jsonify(alert_list)

# Delete an alert
@app.route('/api/delete_alert/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    try:
        alert = Alert.query.get(alert_id)
        if alert is None:
            return jsonify({"message": "Alert not found"}), 404
        db.session.delete(alert)
        db.session.commit()
        return jsonify({"message": "Alert deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

with app.app_context():
    db.create_all() # This line creates all SQL tables based on the models

if __name__ == '__main__':
    app.run(debug=True)