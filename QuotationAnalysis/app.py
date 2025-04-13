import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask import send_from_directory
import PyPDF2
import joblib
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS  # Import CORS


# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_PATH = 'model_from_pdf.pkl'
ALLOWED_EXTENSIONS = {'pdf'}
DB_NAME = 'MajorProject'
COLLECTION_NAME = 'proposals'

# List of feature names; must match training script exactly.
FEATURES = [
    "proposal_cost", "road_length", "material_quality", "contract_duration",
    "past_performance", "experience_years", "regional_infrastructure_quality",
    "traffic_density", "environmental_impact_score", "regulatory_complexity",
    "construction_complexity", "budget_variance", "maintenance_history"
]

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.secret_key = "super_secret_key_123!"  # Use a secure random key in production.
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client[DB_NAME]
proposals_collection = db[COLLECTION_NAME]

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyPDF2."""
    text = ""
    try:
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
    return text

def parse_features_from_text(text):
    """
    Parse features from text.
    Expected format per line: 'key: value unit'
    Returns a dictionary with key-value pairs (units ignored).
    """
    feature_dict = {}
    for line in text.splitlines():
        if ':' in line:
            key_val = line.split(":", 1)
            key = key_val[0].strip()
            val_parts = key_val[1].strip().split()
            if not val_parts:
                continue
            try:
                feature_dict[key] = float(val_parts[0])
            except ValueError:
                feature_dict[key] = val_parts[0]
    return feature_dict

def load_pdf_features(pdf_path):
    """
    Load PDF features into a DataFrame and return both the DataFrame and extracted feature dictionary.
    """
    text = extract_text_from_pdf(pdf_path)
    features_extracted = parse_features_from_text(text)
    missing = [f for f in FEATURES if f not in features_extracted]
    if missing:
        raise ValueError(f"Missing features {missing} in file: {pdf_path}")
    df = pd.DataFrame([{key: features_extracted[key] for key in FEATURES}])
    return df, features_extracted

def generate_explanation(features):
    """
    Generate a rule-based explanation using the feasibility criteria.
    """
    reasons = []
    
    if features["proposal_cost"] < 5500000:
        reasons.append("Proposal cost is acceptable.")
    else:
        reasons.append("Proposal cost is too high.")
    
    if features["road_length"] <= 10:
        reasons.append("Road length is too short.")
    elif features["road_length"] >= 20:
        reasons.append("Road length is too long.")
    else:
        reasons.append("Road length is appropriate.")
    
    if features["material_quality"] > 5:
        reasons.append("Material quality is good.")
    else:
        reasons.append("Material quality is poor.")
    
    if features["past_performance"] > 0.5:
        reasons.append("Past performance is strong.")
    else:
        reasons.append("Past performance is weak.")
    
    if features["construction_complexity"] < 8:
        reasons.append("Construction complexity is low.")
    else:
        reasons.append("Construction complexity is high.")
    
    return " ".join(reasons)

@app.route('/predict', methods=['POST'])
def predict():
    # Check if file is present in the request.
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
    
    file = request.files['file']
    if file.filename == "":
        return jsonify({"error": "No file selected for uploading."}), 400
    
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        try:
            features_df, features_extracted = load_pdf_features(filepath)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Check if model file exists.
        if not os.path.exists(MODEL_PATH):
            return jsonify({"error": "Model file not found. Please train and save the model first."}), 500
        
        model = joblib.load(MODEL_PATH)
        prediction_value = model.predict(features_df)[0]
        result = "Feasible" if prediction_value == 1 else "Not Feasible"
        explanation = generate_explanation(features_extracted)

        # Save the proposal to the database
        proposal_data = {
            "filename": file.filename,
            "prediction": result,
            "explanation": explanation,
            "features": features_extracted,
            "user_id": request.form.get("user_id", "unknown"),  # Add user ID if available
        }
        inserted_id = proposals_collection.insert_one(proposal_data).inserted_id

        # Add the inserted ID as a string to the response
        proposal_data["_id"] = str(inserted_id)

        return jsonify(proposal_data)
    else:
        return jsonify({"error": "Allowed file type is PDF."}), 400

@app.route('/proposals', methods=['GET'])
def get_proposals():
    """Get all proposals for a specific user."""
    user_id = request.args.get("user_id")
    if not user_id:
        print("No user_id provided in the request.")  # Debugging log
        return jsonify({"error": "User ID is required."}), 400

    try:
        print(f"Fetching proposals for user_id: {user_id}")  # Debugging log

        # Check if the user_id exists in the database
        user_exists = proposals_collection.find_one({"user_id": user_id})
        if not user_exists:
            print(f"No proposals found for user_id: {user_id}")  # Debugging log
            return jsonify({"error": "No proposals found for this user."}), 404

        # Fetch all proposals for the user_id
        proposals = list(proposals_collection.find({"user_id": user_id}))
        for proposal in proposals:
            # Convert ObjectId to string and include the filename
            proposal["_id"] = str(proposal["_id"])
            proposal["file_url"] = f"http://127.0.0.1:5000/uploads/{proposal['filename']}"

        print(f"Proposals fetched: {proposals}")  # Debugging log
        return jsonify(proposals)
    except Exception as e:
        print(f"Error fetching proposals: {e}")  # Debugging log
        return jsonify({"error": "Internal server error"}), 500
    
    
@app.route('/uploads/<filename>', methods=['GET'])
def serve_file(filename):
    """Serve a file from the uploads folder."""
    try:
        print(f"Serving file: {filename}")  # Debugging log
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print(f"Error serving file {filename}: {e}")  # Debugging log
        return jsonify({"error": "File not found"}), 404
    

if __name__ == '__main__':
    app.run(debug=True)
