#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports

from models import Owner, Property, Booking

# Views go here!

@app.route('/api/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return [property.to_dict() for property in properties]


@app.route('/api/properties/<int:id>', methods=['GET'])
def get_property(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    return property.to_dict()


@app.route('/api/bookings', methods=['POST'])
def create_booking():
    from datetime import datetime
    
    data = request.get_json()
    
    # Basic validation
    if not all(k in data for k in ('property_id', 'guest_name', 'guest_email', 'check_in_date', 'check_out_date')):
        return {"error": "Missing required fields"}, 400
    
    # Calculate total price
    property = Property.query.get(data['property_id'])
    if not property:
        return {"error": "Property not found"}, 404
    
    from datetime import datetime
    check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
    check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
    days = (check_out - check_in).days
    total_price = property.price_per_night * days
    
    booking = Booking(
        property_id=data['property_id'],
        guest_name=data['guest_name'],
        guest_email=data['guest_email'],
        check_in_date=check_in,
        check_out_date=check_out,
        total_price=total_price
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return booking.to_dict(), 201


# Owners endpoints
@app.route('/api/owners', methods=['GET'])
def get_owners():
    owners = Owner.query.all()
    return [owner.to_dict() for owner in owners]

@app.route('/api/owners', methods=['POST'])
def create_owner():
    data = request.get_json()
    
    if not all(k in data for k in ('name', 'email')):
        return {"error": "Name and email are required"}, 400
    
    owner = Owner(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone')
    )
    
    db.session.add(owner)
    db.session.commit()
    
    return owner.to_dict(), 201

# Complete Properties CRUD
@app.route('/api/properties', methods=['POST'])
def create_property():
    data = request.get_json()
    
    required_fields = ['name', 'description', 'location', 'price_per_night', 'max_guests', 'owner_id']
    if not all(k in data for k in required_fields):
        return {"error": "Missing required fields"}, 400
    
    property = Property(
        name=data['name'],
        description=data['description'],
        location=data['location'],
        price_per_night=data['price_per_night'],
        max_guests=data['max_guests'],
        amenities=data.get('amenities', ''),
        owner_id=data['owner_id']
    )
    
    db.session.add(property)
    db.session.commit()
    
    return property.to_dict(), 201

@app.route('/api/properties/<int:id>', methods=['PATCH'])
def update_property(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    
    data = request.get_json()
    
    for key, value in data.items():
        setattr(property, key, value)
    db.session.commit()
    return property.to_dict(), 200

# Bookings CRUD
@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return [booking.to_dict() for booking in bookings]

@app.route('/api/bookings/<int:id>', methods=['PATCH'])
def update_booking(id):
    booking = Booking.query.get(id)
    if not booking:
        return {"error": "Booking not found"}, 404
    
    data = request.get_json()
    if 'booking_status' in data:
        booking.booking_status = data['booking_status']
    
    db.session.commit()
    return booking.to_dict()

# Property bookings
@app.route('/api/properties/<int:id>/bookings', methods=['GET'])
def get_property_bookings(id):
    property = Property.query.get(id)
    if not property:
        return {"error": "Property not found"}, 404
    
    return [booking.to_dict() for booking in property.bookings]

if __name__ == '__main__':
    app.run(port=5555, debug=True)

