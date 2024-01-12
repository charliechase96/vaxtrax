from models.user import db

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    alert_date = db.Column(db.Date, nullable=False)
    vaccine_id = db.Column(db.Integer, db.ForeignKey('vaccine.id'), nullable=False)