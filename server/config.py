
# Remote library imports
from datetime import timedelta
import os
from werkzeug.utils import secure_filename
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
# AFTER (for psycopg3)
# Get the database URL from environment
database_url = os.environ.get("DATABASE_URL") or "sqlite:///jambostays.db"

# CRITICAL: Force psycopg3 dialect for ALL PostgreSQL connections
if database_url.startswith(('postgres://', 'postgresql://')):
    # Extract the connection details
    if database_url.startswith('postgres://'):
        connection_string = database_url[11:]  # Remove 'postgres://'
    else:
        connection_string = database_url[13:]  # Remove 'postgresql://'
    
    # Force psycopg3 dialect
    database_url = f"postgresql+psycopg://{connection_string}"

print(f"DEBUG: Final database URL: {database_url}")  # Debug line - remove in production

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.config['JWT_SECRET_KEY'] = os.environ.get("JWT_SECRET_KEY") or "fallback-secret-change-in-production"
# Add this line:
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

jwt = JWTManager(app)

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)

# Upload configuration
app.config['UPLOAD_FOLDER'] = 'uploads/properties'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create upload directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS