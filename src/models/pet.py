from ..App import db

class Pet(db.Model):
    __tablename__ = 'pets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    img_url = db.Column(db.String(300))
    name = db.Column(db.String(100))
    type = db.Column(db.String(50))
    breed = db.Column(db.String(100))
    birthday = db.Column(db.Date)