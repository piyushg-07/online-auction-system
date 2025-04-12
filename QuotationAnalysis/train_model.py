import os
import numpy as np
import pandas as pd
from fpdf import FPDF
import PyPDF2
from sklearn.ensemble import RandomForestClassifier
import joblib

# Directory to store generated PDF files
PDF_FOLDER = "pdf_data"
os.makedirs(PDF_FOLDER, exist_ok=True)

# List of feature names
FEATURES = [
    "proposal_cost", "road_length", "material_quality", "contract_duration",
    "past_performance", "experience_years", "regional_infrastructure_quality",
    "traffic_density", "environmental_impact_score", "regulatory_complexity",
    "construction_complexity", "budget_variance", "maintenance_history"
]

# Define units for each feature to be used in the PDF output.
FEATURE_UNITS = {
    "proposal_cost": "Rs",                    # in rupees
    "road_length": "km",                      # kilometers
    "material_quality": "score",              # quality score (1-10)
    "contract_duration": "days",              # days
    "past_performance": "",                   # ratio (0-1) or percentage if multiplied by 100
    "experience_years": "yrs",                # years of experience
    "regional_infrastructure_quality": "score",  # rating 1-10
    "traffic_density": "",                    # ratio (0-1)
    "environmental_impact_score": "score",    # rating 1-10
    "regulatory_complexity": "score",         # rating 1-10
    "construction_complexity": "score",       # rating 1-10
    "budget_variance": "",                    # ratio (0-0.2), could be percentage if desired
    "maintenance_history": "times"            # count of occurrences/issues
}

def generate_random_features():
    """Generate a dictionary of random features using similar distributions as before."""
    return {
        "proposal_cost": np.random.normal(loc=500000, scale=150000),
        "road_length": np.random.normal(loc=50, scale=20),
        "material_quality": np.random.randint(1, 11),
        "contract_duration": np.random.randint(30, 365),
        "past_performance": np.random.uniform(0, 1),
        "experience_years": np.random.randint(1, 40),
        "regional_infrastructure_quality": np.random.randint(1, 11),
        "traffic_density": np.random.uniform(0, 1),
        "environmental_impact_score": np.random.randint(1, 11),
        "regulatory_complexity": np.random.randint(1, 11),
        "construction_complexity": np.random.randint(1, 11),
        "budget_variance": np.random.uniform(0, 0.2),
        "maintenance_history": np.random.randint(1, 6)
    }

def create_pdf(data_dict, filename):
    """Creates a PDF file with key-value pairs from data_dict including unit labels."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    for key, value in data_dict.items():
        # Get the unit (if available) for the feature.
        unit = FEATURE_UNITS.get(key, "")
        # Format the value based on its type. For floats, we format to 4 decimals.
        if isinstance(value, float):
            formatted_value = f"{value:.4f}"
        else:
            formatted_value = str(value)
        # Create a text line with unit appended if provided.
        line = f"{key}: {formatted_value} {unit}".strip()
        pdf.cell(200, 10, txt=line, ln=True)
    pdf.output(filename)

def generate_pdfs(n_pdfs=50):
    """Generate n_pdfs PDF files with random proposal data."""
    for i in range(n_pdfs):
        data = generate_random_features()
        filename = os.path.join(PDF_FOLDER, f"proposal_{i+1}.pdf")
        create_pdf(data, filename)
    print(f"{n_pdfs} PDF files have been generated in the folder '{PDF_FOLDER}'.")

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
    Given a text string with lines of the form 'key: value unit',
    parse and return a dictionary of features (unit is discarded).
    """
    feature_dict = {}
    for line in text.splitlines():
        if ':' in line:
            key_val = line.split(":", 1)
            key = key_val[0].strip()
            # Remove unit by splitting on space after numeric value.
            val_parts = key_val[1].strip().split()
            if not val_parts:
                continue
            try:
                # Convert the first part to float.
                feature_dict[key] = float(val_parts[0])
            except ValueError:
                feature_dict[key] = val_parts[0]
    return feature_dict

def load_data_from_pdfs():
    """Iterate through all PDFs in PDF_FOLDER, extract and parse data, and return a DataFrame."""
    data_records = []
    for file in os.listdir(PDF_FOLDER):
        if file.lower().endswith(".pdf"):
            pdf_path = os.path.join(PDF_FOLDER, file)
            text = extract_text_from_pdf(pdf_path)
            features_extracted = parse_features_from_text(text)
            # Ensure all expected features are present.
            if all(feature in features_extracted for feature in FEATURES):
                data_records.append(features_extracted)
            else:
                print(f"File {file} is missing some features. Skipped.")
    return pd.DataFrame(data_records)

def compute_target(df):
    """
    Compute the target variable 'feasible' using a synthetic rule:
      Feasible if:
        - proposal_cost < 550000
        - material_quality > 5
        - past_performance > 0.5
        - construction_complexity < 8
    """
    df["feasible"] = ((df["proposal_cost"] < 550000) &
                      (df["material_quality"] > 5) &
                      (df["past_performance"] > 0.5) &
                      (df["construction_complexity"] < 8)).astype(int)
    return df

def train_model_from_pdf_data():
    """Load data from PDFs, compute target, and train a Random Forest model."""
    df = load_data_from_pdfs()
    if df.empty:
        raise ValueError("No valid PDF data found!")
    print("Data extracted from PDFs:")
    print(df.head())
    df = compute_target(df)
    print("Data with computed target (feasible):")
    print(df.head())
    
    X = df[FEATURES]
    y = df["feasible"]
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    return clf, df

def save_model(model, model_path="model_from_pdf.pkl"):
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    # 1. Generate 50 PDFs containing random proposal data with units.
    generate_pdfs(n_pdfs=500)
    
    # 2. Load the data from the generated PDFs and train the model.
    model, data_df = train_model_from_pdf_data()
    
    # 3. Save the trained model.
    save_model(model)
    
    # (Optional) Demonstrate prediction on a new PDF:
    new_data = generate_random_features()
    new_pdf_path = os.path.join(PDF_FOLDER, "new_proposal.pdf")
    create_pdf(new_data, new_pdf_path)
    new_text = extract_text_from_pdf(new_pdf_path)
    new_features = parse_features_from_text(new_text)
    
    # Create a DataFrame ensuring the keys order matches FEATURES.
    new_X = pd.DataFrame([{key: new_features[key] for key in FEATURES}])
    prediction = model.predict(new_X)[0]
    prediction_str = "Feasible" if prediction == 1 else "Not Feasible"
    print("\nNew proposal data:")
    print(new_features)
    print(f"Prediction for the new proposal is: {prediction_str}")
