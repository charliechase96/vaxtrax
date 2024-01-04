from models.user import db

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    img_url = db.Column(db.String(300))
    name = db.Column(db.String(100))
    type = db.Column(db.String(50))
    breed = db.Column(db.String(100))
    birthday = db.Column(db.Date)