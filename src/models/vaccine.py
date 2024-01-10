from models.user import db

class Vaccine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    due_date = db.Column(db.Date)