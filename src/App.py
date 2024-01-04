from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models.user import User, db
from models.pet import Pet
from config import Config
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://vaxtrax.pet", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
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


@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

with app.app_context():
    db.create_all() # This line creates all SQL tables based on the models

if __name__ == '__main__':
    app.run(debug=True)