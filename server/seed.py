#!/usr/bin/env python3

"""
Database seeding script for JamboStays
Run this to populate your database with sample data
"""

from datetime import datetime, date, timedelta
from models import User, Owner, Property, PropertyImage, Booking, Favorite
from config import app, db

def seed_database():
    with app.app_context():
        print("🌱 Starting database seeding...")
        
        try:
            # Clear existing data (optional - remove if you want to keep existing data)
            print("🧹 Clearing existing data...")
            PropertyImage.query.delete()
            Booking.query.delete()
            Favorite.query.delete()
            Property.query.delete()
            Owner.query.delete()
            User.query.delete()
            
            # Create sample users
            print("👤 Creating sample users...")
            
            # Create owner users
            owner1 = User(
                email="owner1@jambostays.com",
                name="Sarah Johnson",
                user_type="owner",
                created_at=datetime.utcnow()
            )
            owner1.set_password("password123")
            
            owner2 = User(
                email="owner2@jambostays.com", 
                name="Michael Chen",
                user_type="owner",
                created_at=datetime.utcnow()
            )
            owner2.set_password("password123")
            
            # Create guest users
            guest1 = User(
                email="guest1@example.com",
                name="Emma Wilson",
                user_type="guest",
                created_at=datetime.utcnow()
            )
            guest1.set_password("password123")
            
            guest2 = User(
                email="guest2@example.com",
                name="David Martinez",
                user_type="guest", 
                created_at=datetime.utcnow()
            )
            guest2.set_password("password123")
            
            # Add users to session
            db.session.add_all([owner1, owner2, guest1, guest2])
            db.session.commit()
            
            print(f"✅ Created {User.query.count()} users")
            
            # Create sample owners (legacy table)
            print("🏢 Creating sample owners...")
            legacy_owner1 = Owner(
                name="Sarah Johnson",
                email="owner1@jambostays.com",
                phone="+1234567890"
            )
            
            legacy_owner2 = Owner(
                name="Michael Chen", 
                email="owner2@jambostays.com",
                phone="+1987654321"
            )
            
            db.session.add_all([legacy_owner1, legacy_owner2])
            db.session.commit()
            
            # Create sample properties
            print("🏨 Creating sample properties...")
            
            properties = [
                {
                    "name": "Luxury Oceanview Villa",
                    "description": "Experience unparalleled luxury in this stunning oceanfront villa featuring panoramic views, infinity pool, and world-class amenities. Perfect for discerning travelers seeking the ultimate coastal retreat.",
                    "location": "Malibu, California",
                    "price_per_night": 850.00,
                    "max_guests": 8,
                    "amenities": "Ocean view, Infinity pool, Private beach access, Gourmet kitchen, Wine cellar, Spa, Butler service",
                    "owner_id": owner1.id,
                    "images": [
                        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
                    ]
                },
                {
                    "name": "Mountain Chalet Retreat",
                    "description": "Escape to this exquisite mountain chalet offering breathtaking alpine views, cozy fireplaces, and luxury amenities. Ideal for winter sports enthusiasts and nature lovers.",
                    "location": "Aspen, Colorado",
                    "price_per_night": 1200.00,
                    "max_guests": 6,
                    "amenities": "Mountain views, Fireplace, Hot tub, Ski-in/ski-out, Gourmet kitchen, Wine bar, Heated floors",
                    "owner_id": owner1.id,
                    "images": [
                        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=800&h=600&fit=crop"
                    ]
                },
                {
                    "name": "Urban Penthouse Suite",
                    "description": "Sophisticated city living at its finest. This penthouse offers stunning skyline views, modern amenities, and prime location in the heart of downtown.",
                    "location": "Manhattan, New York",
                    "price_per_night": 950.00,
                    "max_guests": 4,
                    "amenities": "City views, Rooftop terrace, Modern kitchen, Gym access, Concierge service, High-speed WiFi",
                    "owner_id": owner2.id,
                    "images": [
                        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1560448204-e1a3ecb4d9ed?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
                    ]
                },
                {
                    "name": "Tropical Paradise Bungalow",
                    "description": "Wake up to the sound of waves in this stunning beachfront bungalow. Features private beach access, outdoor shower, and tropical garden views.",
                    "location": "Tulum, Mexico",
                    "price_per_night": 650.00,
                    "max_guests": 4,
                    "amenities": "Beachfront, Private beach, Outdoor shower, Tropical garden, Kayaks, Snorkeling gear",
                    "owner_id": owner2.id,
                    "images": [
                        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
                    ]
                },
                {
                    "name": "Historic Countryside Manor",
                    "description": "Step into elegance at this restored 18th-century manor house. Set on 50 acres of rolling countryside with gardens, stables, and timeless charm.",
                    "location": "Cotswolds, England",
                    "price_per_night": 750.00,
                    "max_guests": 10,
                    "amenities": "Historic property, 50 acres, Garden, Stables, Library, Formal dining, Tennis court",
                    "owner_id": owner1.id,
                    "images": [
                        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=600&fit=crop"
                    ]
                },
                {
                    "name": "Desert Oasis Resort Villa",
                    "description": "Modern luxury meets desert tranquility in this architectural masterpiece. Features infinity pool, spa, and panoramic desert views.",
                    "location": "Scottsdale, Arizona", 
                    "price_per_night": 780.00,
                    "max_guests": 6,
                    "amenities": "Desert views, Infinity pool, Private spa, Modern architecture, Outdoor kitchen, Fire pit",
                    "owner_id": owner2.id,
                    "images": [
                        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=600&fit=crop",
                        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
                    ]
                }
            ]
            
            created_properties = []
            for prop_data in properties:
                images_data = prop_data.pop('images')
                property_obj = Property(**prop_data)
                db.session.add(property_obj)
                db.session.flush()  # Get the ID
                created_properties.append((property_obj, images_data))
            
            db.session.commit()
            print(f"✅ Created {len(properties)} properties")
            
            # Create property images
            print("📸 Creating property images...")
            for property_obj, images_data in created_properties:
                for i, image_url in enumerate(images_data):
                    property_image = PropertyImage(
                        property_id=property_obj.id,
                        image_url=image_url,
                        image_name=f"image_{i+1}.jpg",
                        is_featured=(i == 0),  # First image is featured
                        upload_order=i
                    )
                    db.session.add(property_image)
            
            db.session.commit()
            print(f"✅ Created {PropertyImage.query.count()} property images")
            
            # Create sample bookings
            print("📅 Creating sample bookings...")
            
            # Get properties for bookings
            prop1, prop2, prop3 = Property.query.limit(3).all()
            
            bookings = [
                {
                    "property_id": prop1.id,
                    "guest_name": guest1.name,
                    "guest_email": guest1.email,
                    "check_in_date": date.today() + timedelta(days=30),
                    "check_out_date": date.today() + timedelta(days=35),
                    "total_price": prop1.price_per_night * 5,
                    "booking_status": "confirmed"
                },
                {
                    "property_id": prop2.id,
                    "guest_name": guest2.name,
                    "guest_email": guest2.email,
                    "check_in_date": date.today() + timedelta(days=15),
                    "check_out_date": date.today() + timedelta(days=18),
                    "total_price": prop2.price_per_night * 3,
                    "booking_status": "confirmed"
                },
                {
                    "property_id": prop3.id,
                    "guest_name": guest1.name,
                    "guest_email": guest1.email,
                    "check_in_date": date.today() - timedelta(days=10),
                    "check_out_date": date.today() - timedelta(days=7),
                    "total_price": prop3.price_per_night * 3,
                    "booking_status": "confirmed"
                },
                {
                    "property_id": prop1.id,
                    "guest_name": guest2.name,
                    "guest_email": guest2.email,
                    "check_in_date": date.today() + timedelta(days=60),
                    "check_out_date": date.today() + timedelta(days=67),
                    "total_price": prop1.price_per_night * 7,
                    "booking_status": "cancelled"
                }
            ]
            
            for booking_data in bookings:
                booking = Booking(**booking_data)
                db.session.add(booking)
            
            db.session.commit()
            print(f"✅ Created {Booking.query.count()} bookings")
            
            # Create sample favorites
            print("❤️ Creating sample favorites...")
            
            favorites = [
                {"user_id": guest1.id, "property_id": prop1.id},
                {"user_id": guest1.id, "property_id": prop3.id},
                {"user_id": guest2.id, "property_id": prop2.id},
            ]
            
            for fav_data in favorites:
                favorite = Favorite(**fav_data)
                db.session.add(favorite)
            
            db.session.commit()
            print(f"✅ Created {Favorite.query.count()} favorites")
            
            # Print summary
            print("\n🎉 Database seeding completed successfully!")
            print("\n📊 Summary:")
            print(f"   Users: {User.query.count()}")
            print(f"   Properties: {Property.query.count()}")
            print(f"   Property Images: {PropertyImage.query.count()}")
            print(f"   Bookings: {Booking.query.count()}")
            print(f"   Favorites: {Favorite.query.count()}")
            
            print("\n🔑 Test Accounts:")
            print("   Owners:")
            print("   - owner1@jambostays.com / password123")
            print("   - owner2@jambostays.com / password123")
            print("   Guests:")
            print("   - guest1@example.com / password123")
            print("   - guest2@example.com / password123")
            
        except Exception as e:
            print(f"❌ Error during seeding: {str(e)}")
            db.session.rollback()
            raise

if __name__ == "__main__":
    seed_database()