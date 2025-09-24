#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import send_from_directory
from flask import request
from flask_restful import Resource
import os
import uuid
from werkzeug.utils import secure_filename
from config import allowed_file
from models import PropertyImage

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

# Upload property images
@app.route('/api/properties/<int:property_id>/images', methods=['POST'])
def upload_property_images(property_id):
    property = Property.query.get(property_id)
    if not property:
        return {"error": "Property not found"}, 404
    
    if 'images' not in request.files:
        return {"error": "No images provided"}, 400
    
    files = request.files.getlist('images')
    uploaded_images = []
    
    for i, file in enumerate(files):
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            
            property_folder = os.path.join(app.config['UPLOAD_FOLDER'], str(property_id))
            os.makedirs(property_folder, exist_ok=True)
            
            file_path = os.path.join(property_folder, unique_filename)
            file.save(file_path)
            
            image_url = f"/uploads/properties/{property_id}/{unique_filename}"
            is_featured = i == 0 and PropertyImage.query.filter_by(property_id=property_id).count() == 0
            
            property_image = PropertyImage(
                property_id=property_id,
                image_url=image_url,
                image_name=unique_filename,
                is_featured=is_featured,
                upload_order=PropertyImage.query.filter_by(property_id=property_id).count()
            )
            
            db.session.add(property_image)
            uploaded_images.append(property_image)
    
    db.session.commit()
    return {"message": f"Uploaded {len(uploaded_images)} images", 
            "images": [img.to_dict() for img in uploaded_images]}, 201

# Get property images
@app.route('/api/properties/<int:property_id>/images', methods=['GET'])
def get_property_images(property_id):
    images = PropertyImage.query.filter_by(property_id=property_id).order_by(PropertyImage.upload_order).all()
    return [image.to_dict() for image in images]

# Delete specific image
@app.route('/api/properties/images/<int:image_id>', methods=['DELETE'])
def delete_property_image(image_id):
    image = PropertyImage.query.get(image_id)
    if not image:
        return {"error": "Image not found"}, 404
    
    # Delete physical file
    file_path = os.path.join('uploads/properties', str(image.property_id), image.image_name)
    if os.path.exists(file_path):
        os.remove(file_path)
    
    db.session.delete(image)
    db.session.commit()
    return {"message": "Image deleted successfully"}

# Serve uploaded files
@app.route('/uploads/properties/<int:property_id>/<filename>')
def uploaded_file(property_id, filename):
    return send_from_directory(os.path.join(app.config['UPLOAD_FOLDER'], str(property_id)), filename)

if __name__ == '__main__':
    app.run(port=5555, debug=True)

