import os
from werkzeug.security import generate_password_hash, check_password_hash

from flask_restful import Resource
from flask import jsonify, request, session

from datetime import datetime, date, timedelta

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from .models import User, Pet, Vaccine, Alert

from . import create_app, db, api 


class EmailManager:
    def __init__(self, sendgrid_api_key, mail_sender):
        self.sendgrid_api_key = sendgrid_api_key
        self.mail_sender = mail_sender

    def send_email(self, to_email, template_id, template_data):
        message = Mail(
            from_email=self.mail_sender,
            to_emails=to_email
        )
        message.template_id = template_id
        message.dynamic_template_data = template_data

        try:
            sg = SendGridAPIClient(self.sendgrid_api_key)
            response = sg.send(message)
            if response.status_code == 202:
                return "Email sent successfully"
            else:
                return f"Email sending failed with status code {response.status_code}"
        except Exception as e:
            return f"Email sending failed with error: {str(e)}"

    def check_vaccine_alerts(self):
        today = date.today()
        alerts = Alert.query.all()

        for alert in alerts:
            days_until_due = (alert.due_date - today).days

            if days_until_due == 60:
                self.send_vaccine_alert_email(alert, 'd-90b599178f2643a398d2f03cea421446')
            elif days_until_due == 30:
                self.send_vaccine_alert_email(alert, 'd-093c3d47b70f49b4a0413c2a5f55dcb8')
            elif days_until_due == 7:
                self.send_vaccine_alert_email(alert, 'd-56aaa70ae0ef405183b58bf12df975fb')
            elif days_until_due == 0:
                self.send_vaccine_alert_email(alert, 'd-82bce353b16143b1bb85cdb58e5842bf')

    def send_vaccine_alert_email(self, alert, template_id):
        pet = Pet.query.get(alert.pet_id)
        user = User.query.get(pet.user_id)

        self.send_email(user.email, template_id, {
            'pet_name': pet.name,
            'vaccine_name': alert.vaccine_name,
            'due_date': alert.due_date.strftime('%Y-%m-%d'),
            'alert_date': alert.alert_date.strftime('%Y-%m-%d')
        })



class Signup(Resource):
    def __init__(self, email_manager):
        self.email_manager = email_manager

    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return {'message': 'Email and password are required.'}, 400

            if User.query.filter_by(email=email).first():
                return {'message': 'Email already in use.'}, 400

            hashed_password = generate_password_hash(password)
            new_user = User(email=email, password_hash=hashed_password)
            db.session.add(new_user)
            db.session.commit()

            # Send welcome email after successful signup
            self.email_manager.send_email(email, "d-f4402d6b25344e208bddadade9f984fc", {})

            # Automatically log in the user by setting up the session
            session['user_id'] = new_user.id
            return {'message': 'User created and logged in successfully.'}, 201

        except Exception as e:
            return {'message': f'An error occurred during signup: {str(e)}'}, 500

email_manager = EmailManager(sendgrid_api_key=os.getenv('SENDGRID_API_KEY'), mail_sender="alerts@vaxtrax.pet")
api.add_resource(Signup, '/signup', resource_class_args=(email_manager,))



class Login(Resource):
    def post(self):
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400

        email = request.json.get('email', None)
        password = request.json.get('password', None)

        if not email or not password:
            return jsonify({"msg": "Missing email or password"}), 400

        try:
            user = User.query.filter_by(email=email).first()

            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id  # Store user ID in session
                return jsonify({"msg": "Login successful", "user_id": user.id})

            else:
                return jsonify({"msg": "Bad email or password"}), 401

        except Exception as e:
            return jsonify({"msg": f"Internal server error: {str(e)}"}), 500

# Add the Login resource to your API
api.add_resource(Login, '/login')



class CheckSession(Resource):
    def get(self):
        try:
            user_id = session.get('user_id')
            if user_id:
                return jsonify({'user_id': user_id})
            else:
                return {'message': 'User not logged in.'}, 401
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"An error occurred: {e}")
            return {'message': 'An error occurred while checking the session.'}, 500

# Add the CheckSession resource to your API
api.add_resource(CheckSession, '/check_session')



class Logout(Resource):
    def delete(self):
        # Clearing the entire session
        session.clear()
        return {'message': 'User successfully logged out'}, 200

api.add_resource(Logout, '/logout')

# @app.route('/<int:user_id>/add_pet', methods=['POST'])
# @jwt_required()
# def add_pet(user_id):
#     data = request.get_json()
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403

#     try:
#         birthday_date = datetime.strptime(data['birthday'], '%Y-%m-%d').date()

#     except ValueError:
#         return jsonify({"error": "Invalid date format"}), 400
        
    
#     try:
#         new_pet = Pet(
#             img_url=data['img_url'],
#             name=data['name'],
#             type=data['type'],
#             breed=data['breed'],
#             birthday=birthday_date,
#             user_id=current_user_id
#         )
#         db.session.add(new_pet)
#         db.session.commit()
#         return jsonify({"message": "Pet added successfully", "pet": data}), 201
    
#     except Exception as e:
#         print("Error adding pet:", str(e))
#         return jsonify({"error": str(e)}), 500

# @app.route('/<int:user_id>/pets', methods=['GET'])
# @jwt_required()
# def get_pets(user_id):
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403
    
#     pets = Pet.query.filter_by(user_id=current_user_id).all()
#     pet_list = [{
#         'id': pet.id,
#         'img_url': pet.img_url,
#         'name': pet.name,
#         'type': pet.type,
#         'breed': pet.breed,
#         'birthday': pet.birthday.strftime("%Y-%m-%d"),
#         'user_id': current_user_id
#     } for pet in pets]

#     return jsonify(pet_list)

# @app.route('/<int:user_id>/add_vaccine', methods=['POST'])
# @jwt_required()
# def add_vaccine(user_id):
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403
    
#     data = request.get_json()

#     try:
#         vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()

#     except ValueError:
#         return jsonify({"error": "Invalid date format"}), 400
    
#     try:
#         new_vaccine = Vaccine(
#             user_id=current_user_id,
#             name=data['name'],
#             due_date=vaccine_due_date
#         )
#         db.session.add(new_vaccine)
#         db.session.commit()
#         return jsonify({"message": "Vaccine added successfully", "vaccine": data}), 201
    
#     except Exception as e:
#         print("Error adding vaccine:", str(e))
#         return jsonify({"error": str(e)}), 500

# @app.route('/<int:user_id>/vaccines', methods=['GET'])
# @jwt_required()
# def get_vaccines(user_id):
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403
    
#     vaccines = Vaccine.query.filter_by(user_id=current_user_id).all()
#     vaccine_list = [{
#         'id': vaccine.id,
#         'name': vaccine.name,
#         'due_date': vaccine.due_date.strftime("%Y-%m-%d")
#     } for vaccine in vaccines]

#     return jsonify(vaccine_list)

# @app.route('/<int:user_id>/delete_pet/<int:pet_id>', methods=['DELETE'])
# @jwt_required()
# def delete_pet(user_id, pet_id):
#     try:
#         current_user_id = get_jwt_identity()
#         if user_id != current_user_id:
#             return jsonify({'message': 'Unauthorized access'}), 403
    
#         pet = Pet.query.filter_by(id=pet_id, user_id=current_user_id).first()
#         if pet is None:
#             return jsonify({"message": "Pet not found"}), 404

#         db.session.delete(pet)
#         db.session.commit()
#         return jsonify({"message": "Pet deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
# @app.route('/<int:user_id>/delete_vaccine/<int:vaccine_id>', methods=['DELETE'])
# @jwt_required()
# def delete_vaccine(user_id, vaccine_id):
#     try:
#         current_user_id = get_jwt_identity()
#         if user_id != current_user_id:
#             return jsonify({'message': 'Unauthorized access'}), 403
        
#         vaccine = Vaccine.query.filter_by(id=vaccine_id, user_id=current_user_id).first()
#         if vaccine is None:
#             return jsonify({"message": "Vaccine not found"}), 404

#         db.session.delete(vaccine)
#         db.session.commit()
#         return jsonify({"message": "Vaccine deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Add an alert
# @app.route('/<int:user_id>/add_alert', methods=['POST'])
# @jwt_required()
# def add_alert(user_id):
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403
    
#     data = request.get_json()
#     print("Received data:", data)

#     try:
#         # Extract the vaccine name and due date from the nested dictionary
#         vaccine_name = data.get('vaccine_name', '')
#         alert_date = datetime.strptime(data['alert_date'], '%Y-%m-%d').date()
#         vaccine_due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
#         print("Extracted due_date:", vaccine_due_date)

#         new_alert = Alert(
#             user_id=current_user_id,
#             vaccine_name=vaccine_name, 
#             alert_date=alert_date,
#             due_date=vaccine_due_date, 
#             vaccine_id=data['vaccine_id']
#         )
#         db.session.add(new_alert)
#         db.session.commit()

#         added_alert = Alert.query.filter_by(id=new_alert.id).first()
#         if added_alert:
#             print("Newly added alert:", added_alert)

#         print("New alert added:", new_alert)
#         return jsonify({"message": "Alert added successfully"}), 201
#     except KeyError:
#         return jsonify({"error": "Invalid data format"}), 400
#     except ValueError:
#         return jsonify({"error": "Invalid date format"}), 400
#     except Exception as e:
#         print("Error:", e)
#         return jsonify({"error": str(e)}), 500

# # Get all alerts
# @app.route('/<int:user_id>/alerts', methods=['GET'])
# @jwt_required()
# def get_alerts(user_id):
#     current_user_id = get_jwt_identity()
#     if user_id != current_user_id:
#         return jsonify({'message': 'Unauthorized access'}), 403
    
#     alerts = Alert.query.filter_by(user_id=current_user_id).all()
#     alert_list = [{
#         'id': alert.id,
#         'vaccine_name': alert.vaccine_name,
#         'alert_date': alert.alert_date.strftime("%Y-%m-%d"),
#         'due_date': alert.due_date.strftime("%Y-%m-%d"),
#         'vaccine_id': alert.vaccine_id
#     } for alert in alerts]
#     return jsonify(alert_list)

# # Delete an alert
# @app.route('/<int:user_id>/delete_alert/<int:alert_id>', methods=['DELETE'])
# @jwt_required
# def delete_alert(user_id, alert_id):
#     try:
#         current_user_id = get_jwt_identity()
#         if user_id != current_user_id:
#             return jsonify({'message': 'Unauthorized access'}), 403
        
#         alert = Alert.query.filter_by(id=alert_id, user_id=current_user_id).first()
#         if alert is None:
#             return jsonify({"message": "Alert not found"}), 404
#         db.session.delete(alert)
#         db.session.commit()
#         return jsonify({"message": "Alert deleted successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


app = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()    
    app.run(debug=True)