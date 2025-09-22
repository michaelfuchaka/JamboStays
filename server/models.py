from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import DateTime
from datetime import datetime


from config import db

# Models go here!
class Owner(db.Model, SerializerMixin):
     __tablename__ = 'owners'

    # Serialization rules
     serialize_rules = ('-properties.owner' ,)
     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(100), nullable=False)
     email = db.Column(db.String(120), unique=True, nullable=False)
     phone = db.Column(db.String(20), nullable=True)
     created_at = db.Column(DateTime, default=datetime.utcnow)

     # Relationships
     properties = db.relationship('Property', backref='owner', lazy=True, cascade='all, delete-orphan')

     def __repr__(self):
            return f"<Owner {self.name}>"
     
     class Property(db.Model, SerializerMixin):
            __tablename__ = 'properties'

     # Serialization rules
     serialize_rules = ('-owner.properties', '-bookings.property')


     id = db.Column(db.Integer, primary_key=True)
     name = db.Column(db.String(100), nullable=False)
     description = db.Column(db.Text, nullable=False)
     location = db.Column(db.String(100), nullable=False)
     price_per_night = db.Column(db.Float, nullable=False)
     max_guests = db.Column(db.Integer, nullable=False)
     amenities = db.Column(db.Text, nullable=True)  # Could be JSON string
     owner_id = db.Column(db.Integer, db.ForeignKey('owners.id'), nullable=False)
     created_at = db.Column(DateTime, default=datetime.utcnow)