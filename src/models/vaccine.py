from .user import db

class Vaccine(db.Model):
    __tablename__ = 'vaccines'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    due_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)