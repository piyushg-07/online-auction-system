import os
import random
import sys
import numpy as np
import pandas as pd
import PyPDF2
import joblib

# List of feature names (must match exactly the ones used during training)
FEATURES = [
    "proposal_cost", "road_length", "material_quality", "contract_duration",
    "past_performance", "experience_years", "regional_infrastructure_quality",
    "traffic_density", "environmental_impact_score", "regulatory_complexity",
    "construction_complexity", "budget_variance", "maintenance_history"
]

# Directories containing test PDFs (modify if your folder names are different)
TEST_FEASIBLE_FOLDER = "test_feasible"
TEST_NONFEASIBLE_FOLDER = "test_nonfeasible"
MODEL_PATH = "model_from_pdf.pkl"

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
    Given a text string with lines formatted as 'key: value unit',
    parse and return a dictionary of features (ignoring the unit).
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
                # Convert the first token into a float
                feature_dict[key] = float(val_parts[0])
            except ValueError:
                feature_dict[key] = val_parts[0]
    return feature_dict

def load_pdf_features(pdf_path):
    """Extract and parse features from a PDF file and return a DataFrame along with the parsed feature dictionary."""
    text = extract_text_from_pdf(pdf_path)
    features_extracted = parse_features_from_text(text)
    # Check that all necessary features exist.
    missing = [f for f in FEATURES if f not in features_extracted]
    if missing:
        raise ValueError(f"Missing features {missing} in file: {pdf_path}")
    # Construct a DataFrame with features in the expected order.
    df = pd.DataFrame([{key: features_extracted[key] for key in FEATURES}])
    return df, features_extracted

def predict_pdf(model, pdf_path):
    """Load PDF, extract its features, predict outcome, and return prediction and parsed features."""
    df, features_extracted = load_pdf_features(pdf_path)
    prediction = model.predict(df)[0]
    return prediction, features_extracted

def main():
    # Check if model file exists.
    if not os.path.exists(MODEL_PATH):
        print(f"Error: Model file '{MODEL_PATH}' not found. Please train and save your model first.")
        sys.exit(1)
    
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}.\n")
    
    # Get one random PDF file from the feasible folder.
    feasible_files = [f for f in os.listdir(TEST_FEASIBLE_FOLDER) if f.lower().endswith(".pdf")]
    if not feasible_files:
        print(f"No PDF files found in '{TEST_FEASIBLE_FOLDER}'")
        sys.exit(1)
    sample_feasible = os.path.join(TEST_FEASIBLE_FOLDER, random.choice(feasible_files))
    
    # Get one random PDF file from the non-feasible folder.
    nonfeasible_files = [f for f in os.listdir(TEST_NONFEASIBLE_FOLDER) if f.lower().endswith(".pdf")]
    if not nonfeasible_files:
        print(f"No PDF files found in '{TEST_NONFEASIBLE_FOLDER}'")
        sys.exit(1)
    sample_nonfeasible = os.path.join(TEST_NONFEASIBLE_FOLDER, random.choice(nonfeasible_files))
    
    # Predict for the feasible sample.
    try:
        prediction_f, features_f = predict_pdf(model, sample_feasible)
    except ValueError as e:
        print("Error during prediction for feasible sample:", e)
        sys.exit(1)
    result_f = "Feasible" if prediction_f == 1 else "Not Feasible"
    print("--- Sample from FEASIBLE Folder ---")
    print(f"File: {sample_feasible}")
    for key in FEATURES:
        print(f"  {key}: {features_f[key]}")
    print(f"Prediction: {result_f}\n")
    
    # Predict for the non-feasible sample.
    try:
        prediction_nf, features_nf = predict_pdf(model, sample_nonfeasible)
    except ValueError as e:
        print("Error during prediction for non-feasible sample:", e)
        sys.exit(1)
    result_nf = "Feasible" if prediction_nf == 1 else "Not Feasible"
    print("--- Sample from NON-FEASIBLE Folder ---")
    print(f"File: {sample_nonfeasible}")
    for key in FEATURES:
        print(f"  {key}: {features_nf[key]}")
    print(f"Prediction: {result_nf}\n")
    
if __name__ == '__main__':
    main()
