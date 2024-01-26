from flask import Flask, jsonify, request
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
from models.user import User, db
from models.pet import Pet
from models.vaccine import Vaccine
from models.alert import Alert
from config import Config
from flask_cors import CORS
from datetime import datetime, date, timedelta
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

migrate = Migrate(app, db)

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

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

def send_email(to_email, template_id):
    message = Mail(
        from_email='alerts@vaxtrax.pet',
        to_emails=to_email
    )
    message.template_id = template_id

    try:
        sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
        response = sg.send(message)
        if response.status_code == 202:
            return "Email sent successfully"
        else:
            return f"Email sending failed with status code {response.status_code}"
    except Exception as e:
        return f"Email sending failed with error: {str(e)}"

def check_vaccine_alerts():
    today = date.today()
    alerts = Alert.query.all()

    for alert in alerts:
        days_until_due = (alert.due_date - today).days

        if days_until_due == 60:
            send_sixty_day_alert_email(alert)
        elif days_until_due == 30:
            send_thirty_day_alert_email(alert)
        elif days_until_due == 7:
            send_seven_day_alert_email(alert)
        elif days_until_due == 0:
            send_due_alert_email(alert)

def send_sixty_day_alert_email(alert):
    pet = Pet.query.get(alert.pet_id)
    user = User.query.get(pet.user_id)

    send_email(user.email, 'd-90b599178f2643a398d2f03cea421446', {
        'pet_name': pet.name,
        'vaccine_name': alert.vaccine_name,
        'due_date': alert.due_date.strftime('%Y-%m-%d'),
        'alert_date': alert.alert_date.strftime('%Y-%m-%d')
    })

def send_thirty_day_alert_email(alert):
    pet = Pet.query.get(alert.pet_id)
    user = User.query.get(pet.user_id)

    send_email(user.email, 'd-093c3d47b70f49b4a0413c2a5f55dcb8', {
        'pet_name': pet.name,
        'vaccine_name': alert.vaccine_name,
        'due_date': alert.due_date.strftime('%Y-%m-%d'),
        'alert_date': alert.alert_date.strftime('%Y-%m-%d')
    })

def send_seven_day_alert_email(alert):
    pet = Pet.query.get(alert.pet_id)
    user = User.query.get(pet.user_id)

    send_email(user.email, 'd-56aaa70ae0ef405183b58bf12df975fb', {
        'pet_name': pet.name,
        'vaccine_name': alert.vaccine_name,
        'due_date': alert.due_date.strftime('%Y-%m-%d'),
        'alert_date': alert.alert_date.strftime('%Y-%m-%d')
    })

def send_due_alert_email(alert):
    pet = Pet.query.get(alert.pet_id)
    user = User.query.get(pet.user_id)

    send_email(user.email, 'd-82bce353b16143b1bb85cdb58e5842bf', {
        'pet_name': pet.name,
        'vaccine_name': alert.vaccine_name,
        'due_date': alert.due_date.strftime('%Y-%m-%d'),
        'alert_date': alert.alert_date.strftime('%Y-%m-%d')
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
        user_id = user.id
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return jsonify(access_token=access_token, refresh_token=refresh_token, user_id=user_id)
    
    return jsonify({"msg": "Bad email or password"}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256', salt_length=16)
        new_user = User(email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=new_user.id)

        send_email(new_user.email, 'd-f4402d6b25344e208bddadade9f984fc')

        user_id = new_user.id
        return jsonify({'message': 'Registered successfully!', 'userId': user_id, 'accessToken': access_token}), 201
    
    except Exception as e:
        print("Error during user regirstration:", str(e))
        db.session.rollback()
        return jsonify({'error': 'User registration failed'}), 500



@app.route('/api/<int:user_id>/add_pet', methods=['POST'])
@jwt_required()
def add_pet(user_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403

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
            birthday=birthday_date,
            user_id=current_user_id
        )
        db.session.add(new_pet)
        db.session.commit()
        return jsonify({"message": "Pet added successfully", "pet": data}), 201
    
    except Exception as e:
        print("Error adding pet:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/<int:user_id>/pets', methods=['GET'])
@jwt_required()
def get_pets(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    pets = Pet.query.filter_by(user_id=current_user_id).all()
    pet_list = [{
        'id': pet.id,
        'img_url': pet.img_url,
        'name': pet.name,
        'type': pet.type,
        'breed': pet.breed,
        'birthday': pet.birthday.strftime("%Y-%m-%d"),
        'user_id': current_user_id
    } for pet in pets]

    return jsonify(pet_list)

@app.route('/api/<int:user_id>/add_vaccine', methods=['POST'])
@jwt_required()
def add_vaccine(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()

    try:
        vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()

    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400
    
    try:
        new_vaccine = Vaccine(
            user_id=current_user_id,
            name=data['name'],
            due_date=vaccine_due_date
        )
        db.session.add(new_vaccine)
        db.session.commit()
        return jsonify({"message": "Vaccine added successfully", "vaccine": data}), 201
    
    except Exception as e:
        print("Error adding vaccine:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/api/<int:user_id>/vaccines', methods=['GET'])
@jwt_required()
def get_vaccines(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    vaccines = Vaccine.query.filter_by(user_id=current_user_id).all()
    vaccine_list = [{
        'id': vaccine.id,
        'name': vaccine.name,
        'due_date': vaccine.due_date.strftime("%Y-%m-%d")
    } for vaccine in vaccines]

    return jsonify(vaccine_list)

@app.route('/api/<int:user_id>/delete_pet/<int:pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(user_id, pet_id):
    try:
        current_user_id = get_jwt_identity()
        if user_id != current_user_id:
            return jsonify({'message': 'Unauthorized access'}), 403
    
        pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
        if pet is None:
            return jsonify({"message": "Pet not found"}), 404

        db.session.delete(pet)
        db.session.commit()
        return jsonify({"message": "Pet deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/<int:user_id>/delete_vaccine/<int:vaccine_id>', methods=['DELETE'])
@jwt_required()
def delete_vaccine(user_id, vaccine_id):
    try:
        current_user_id = get_jwt_identity()
        if user_id != current_user_id:
            return jsonify({'message': 'Unauthorized access'}), 403
        
        vaccine = Vaccine.query.filter_by(id=vaccine_id, user_id=current_user_id).first()
        if vaccine is None:
            return jsonify({"message": "Vaccine not found"}), 404

        db.session.delete(vaccine)
        db.session.commit()
        return jsonify({"message": "Vaccine deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add an alert
@app.route('/api/<int:user_id>/add_alert', methods=['POST'])
@jwt_required()
def add_alert(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    print("Received data:", data)

    try:
        # Extract the vaccine name and due date from the nested dictionary
        vaccine_name = data.get('vaccine_name', '')
        alert_date = datetime.strptime(data['alert_date'], '%Y-%m-%d').date()
        vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
        print("Extracted due_date:", vaccine_due_date)

        new_alert = Alert(
            user_id=current_user_id,
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
@app.route('/api/<int:user_id>/alerts', methods=['GET'])
@jwt_required()
def get_alerts(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    alerts = Alert.query.filter_by(user_id=current_user_id).all()
    alert_list = [{
        'id': alert.id,
        'vaccine_name': alert.vaccine_name,
        'alert_date': alert.alert_date.strftime("%Y-%m-%d"),
        'due_date': alert.due_date.strftime("%Y-%m-%d"),
        'vaccine_id': alert.vaccine_id
    } for alert in alerts]
    return jsonify(alert_list)

# Delete an alert
@app.route('/api/<int:user_id>/delete_alert/<int:alert_id>', methods=['DELETE'])
@jwt_required
def delete_alert(user_id, alert_id):
    try:
        current_user_id = get_jwt_identity()
        if user_id != current_user_id:
            return jsonify({'message': 'Unauthorized access'}), 403
        
        alert = Alert.query.filter_by(id=alert_id, user_id=current_user_id).first()
        if alert is None:
            return jsonify({"message": "Alert not found"}), 404
        db.session.delete(alert)
        db.session.commit()
        return jsonify({"message": "Alert deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/<int:user_id>/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh(user_id):
    current_user_id = get_jwt_identity()
    if user_id != current_user_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    new_token = create_access_token(identity=current_user_id)
    return jsonify(access_token=new_token)


@app.route('/api/<int:user_id>/protected', methods=['GET'])
@jwt_required()
def protected(user_id):
    current_user_id = get_jwt_identity()

    if current_user_id == user_id:
        return jsonify(logged_in_as=current_user_id), 200
    else:
        return jsonify({"message": "Unauthorized access"}), 403

with app.app_context():
    db.create_all() # This line creates all SQL tables based on the models

if __name__ == '__main__':
    app.run(debug=True)