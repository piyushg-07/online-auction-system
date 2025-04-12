import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
import PyPDF2
import joblib

# Configuration
UPLOAD_FOLDER = 'uploads'
MODEL_PATH = 'model_from_pdf.pkl'
ALLOWED_EXTENSIONS = {'pdf'}

# List of feature names; must match training script exactly.
FEATURES = [
    "proposal_cost", "road_length", "material_quality", "contract_duration",
    "past_performance", "experience_years", "regional_infrastructure_quality",
    "traffic_density", "environmental_impact_score", "regulatory_complexity",
    "construction_complexity", "budget_variance", "maintenance_history"
]

app = Flask(__name__)
app.secret_key = "super_secret_key_123!"  # Use a secure random key in production.
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    Generate a rule-based explanation using the feasibility criteria:
      - Proposal cost is acceptable if it is less than 5,500,000 rupees.
      - Road length is appropriate if it is strictly greater than 10 km and strictly less than 20 km.
      - Material quality must be greater than 5.
      - Past performance must be greater than 0.5.
      - Construction complexity must be less than 8.
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
        return jsonify({
            "filename": file.filename,
            "prediction": result,
            "explanation": explanation,
            "features": features_extracted
        })
    else:
        return jsonify({"error": "Allowed file type is PDF."}), 400

if __name__ == '__main__':
    app.run(debug=True)
