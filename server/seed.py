#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, date, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Owner, Property, Booking

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

        # Clear existing data
        print("Clearing existing data...")
        Booking.query.delete()
        Property.query.delete()
        Owner.query.delete()
        db.session.commit()

        # Create sample owners
        print("Creating owners...")
        owners = []
        for _ in range(5):
            owner = Owner(
                name=fake.name(),
                email=fake.unique.email(),
                phone=fake.phone_number()
            )
            owners.append(owner)
            db.session.add(owner)
        
         
        db.session.commit()
        print(f"Created {len(owners)} owners")

        # Create sample properties
        print("Creating properties...")
        properties = []
        property_names = [
            "Cozy Diani Beach House", "Mount Kenya Retreat", "Nairobi Downtown Loft", 
            "Naivasha Garden Villa", "Lake Victoria View Cabin", "Kisumu City Center Apartment",
            "Rustic Rift Valley Farmhouse", "Westlands Modern Penthouse",  "Lamu Seaside Cottage"
        ]

        locations = [
            "Nairobi", "Mombasa", "Kisumu", "Nakuru", 
            "Eldoret", "Maasai Mara", "Mount Kenya", 
             "Diani Beach", "Lamu"
        ]
 
        amenities_options = [
            "WiFi, Kitchen, Pool, Air Conditioning",
            "WiFi, Fireplace, Mountain View, Hiking Trails",
            "WiFi, Gym, Rooftop Access, City View",
            "WiFi, Garden, BBQ Area, Pet Friendly",
            "WiFi, Boat Dock, Fishing, Lake Access",
            "WiFi, Balcony, Modern Kitchen, Parking",
            "WiFi, Farm Activities, Organic Garden, Peaceful",
            "WiFi, Luxury Amenities, Butler Service, Spa"
         ]
        

        for i in range(8):
            property = Property(
                name=property_names[i],
                description=fake.text(max_nb_chars=200),
                location=locations[i],
                price_per_night=randint(50, 500),
                max_guests=randint(2, 8),
                amenities=rc(amenities_options),
                owner=rc(owners)
            )
            properties.append(property)
            db.session.add(property)

        db.session.commit()
        print(f"Created {len(properties)} properties")

    print("Creating sample property images...")
    sample_images = [
        "https://images.unsplash.com/photo-1564013799919"
    ]
    
    
    # Create sample bookings
    # Replace your entire booking section with this:
    print("Creating bookings...")
    bookings = []
    booking_statuses = ['confirmed', 'confirmed', 'confirmed', 'cancelled']

    # Get fresh property instances from database
    fresh_properties = Property.query.all()

    for _ in range(12):
        start_date = fake.date_between(start_date='-30d', end_date='+60d')
        end_date = start_date + timedelta(days=randint(1, 7))
    
        selected_property = rc(fresh_properties)
        days = (end_date - start_date).days
        total_price = selected_property.price_per_night * days
    
        booking = Booking(
            property_id=selected_property.id,  # Use property_id instead of property object
            guest_name=fake.name(),
            guest_email=fake.email(),
            check_in_date=start_date,
            check_out_date=end_date,
            total_price=total_price,
            booking_status=rc(booking_statuses)
       )
        bookings.append(booking)
        db.session.add(booking)

    db.session.commit()
    print(f"Created {len(bookings)} bookings")
    
    print("Seed completed successfully!")
    
    # Print summary
    print("\n--- DATABASE SUMMARY ---")
    print(f"Total Owners: {Owner.query.count()}")
    print(f"Total Properties: {Property.query.count()}")
    print(f"Total Bookings: {Booking.query.count()}")
    
    # Show sample data
    print("\n--- SAMPLE OWNER ---")
    sample_owner = Owner.query.first()
    if sample_owner:
        print(f"Name: {sample_owner.name}")
        print(f"Email: {sample_owner.email}")
        print(f"Properties owned: {len(sample_owner.properties)}")
    print("\n--- SAMPLE PROPERTY ---")
    sample_property = Property.query.first()
    if sample_property:
        print(f"Name: {sample_property.name}")
        print(f"Location: {sample_property.location}")
        print(f"Price per night: ${sample_property.price_per_night}")
        print(f"Bookings: {len(sample_property.bookings)}")        