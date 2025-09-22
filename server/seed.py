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