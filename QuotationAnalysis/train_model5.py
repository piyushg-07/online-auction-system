import os
import numpy as np
import pandas as pd
from fpdf import FPDF
import PyPDF2
from sklearn.ensemble import RandomForestClassifier
import joblib

# Directories to store generated PDF files
TRAIN_PDF_FOLDER = "pdf_data"             # Training dataset PDFs
TEST_FEASIBLE_FOLDER = "test_feasible"      # Test PDFs for feasible proposals
TEST_NONFEASIBLE_FOLDER = "test_nonfeasible"  # Test PDFs for non-feasible proposals

# Create folders if they do not exist.
os.makedirs(TRAIN_PDF_FOLDER, exist_ok=True)
os.makedirs(TEST_FEASIBLE_FOLDER, exist_ok=True)
os.makedirs(TEST_NONFEASIBLE_FOLDER, exist_ok=True)

# List of feature names (order must be consistent)
FEATURES = [
    "proposal_cost", "road_length", "material_quality", "contract_duration",
    "past_performance", "experience_years", "regional_infrastructure_quality",
    "traffic_density", "environmental_impact_score", "regulatory_complexity",
    "construction_complexity", "budget_variance", "maintenance_history"
]

# Define units for each feature used in the PDF output.
FEATURE_UNITS = {
    "proposal_cost": "Rs",                   # rupees
    "road_length": "km",                     # kilometers
    "material_quality": "score",             # score 1-10
    "contract_duration": "days",             # days
    "past_performance": "",                  # ratio (0-1)
    "experience_years": "yrs",               # years
    "regional_infrastructure_quality": "score", # score 1-10
    "traffic_density": "",                   # ratio (0-1)
    "environmental_impact_score": "score",   # score 1-10
    "regulatory_complexity": "score",        # score 1-10
    "construction_complexity": "score",      # score 1-10
    "budget_variance": "",                   # ratio (0-0.2)
    "maintenance_history": "times"           # count
}

# ------------------------
# Feature Generators
# ------------------------

def generate_random_features():
    """
    Generate a dictionary of random features.
    Note: proposal_cost is now scaled to have a mean in the millions (i.e. lakhs of rupees).
    """
    return {
        "proposal_cost": np.random.normal(loc=5000000, scale=1500000),  # Mean cost ~50 lakh rupees
        "road_length": np.random.normal(loc=50, scale=20),                # 50 km mean
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

def generate_conditioned_features(feasible=True):
    """
    Generate features biased toward being feasible or non-feasible.
    For a proposal to be feasible, the synthetic rule is:
      - proposal_cost < 5,500,000 rupees (55 lakh)
      - road_length > 10 km
      - material_quality > 5
      - past_performance > 0.5
      - construction_complexity < 8
    For feasible proposals, we produce ranges well within these thresholds.
    For non-feasible proposals, we force one condition to be violated.
    """
    if feasible:
        return {
            "proposal_cost": np.random.uniform(3500000, 4500000),  # well below 55 lakh
            "road_length": np.random.uniform(20, 100),               # always greater than 10 km
            "material_quality": np.random.randint(8, 11),            # high quality
            "contract_duration": np.random.randint(30, 365),
            "past_performance": np.random.uniform(0.8, 1.0),           # strong past performance
            "experience_years": np.random.randint(1, 40),
            "regional_infrastructure_quality": np.random.randint(1, 11),
            "traffic_density": np.random.uniform(0, 1),
            "environmental_impact_score": np.random.randint(1, 11),
            "regulatory_complexity": np.random.randint(1, 11),
            "construction_complexity": np.random.randint(1, 4),      # very low complexity
            "budget_variance": np.random.uniform(0, 0.2),
            "maintenance_history": np.random.randint(1, 6)
        }
    else:
        # For a non-feasible proposal, force one violation.
        choices = {}
        condition_break = np.random.choice(["cost", "quality", "performance", "complexity", "road_length"])
        if condition_break == "cost":
            choices["proposal_cost"] = np.random.uniform(5600000, 7000000)  # Above threshold
        else:
            choices["proposal_cost"] = np.random.normal(loc=5000000, scale=1500000)
        if condition_break == "quality":
            choices["material_quality"] = np.random.randint(1, 6)           # low quality
        else:
            choices["material_quality"] = np.random.randint(1, 11)
        if condition_break == "performance":
            choices["past_performance"] = np.random.uniform(0, 0.4)           # weak performance
        else:
            choices["past_performance"] = np.random.uniform(0, 1)
        if condition_break == "complexity":
            choices["construction_complexity"] = np.random.randint(8, 12)     # high complexity
        else:
            choices["construction_complexity"] = np.random.randint(1, 11)
        if condition_break == "road_length":
            choices["road_length"] = np.random.uniform(0, 5)                  # too short
        else:
            choices["road_length"] = np.random.normal(loc=50, scale=20)
        
        # Fill remaining features with random values.
        choices["contract_duration"] = np.random.randint(30, 365)
        choices["experience_years"] = np.random.randint(1, 40)
        choices["regional_infrastructure_quality"] = np.random.randint(1, 11)
        choices["traffic_density"] = np.random.uniform(0, 1)
        choices["environmental_impact_score"] = np.random.randint(1, 11)
        choices["regulatory_complexity"] = np.random.randint(1, 11)
        choices["budget_variance"] = np.random.uniform(0, 0.2)
        choices["maintenance_history"] = np.random.randint(1, 6)
        return choices

# ------------------------
# PDF Generation Functions
# ------------------------

def create_pdf(data_dict, filename):
    """
    Create a PDF file with key-value pairs from data_dict.
    Each line will appear as 'key: value unit', where the unit is defined in FEATURE_UNITS.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    for key, value in data_dict.items():
        unit = FEATURE_UNITS.get(key, "")
        if isinstance(value, float):
            formatted_value = f"{value:.4f}"
        else:
            formatted_value = str(value)
        line = f"{key}: {formatted_value} {unit}".strip()
        pdf.cell(200, 10, txt=line, ln=True)
    pdf.output(filename)

def generate_pdfs(n_pdfs, folder, feature_gen_func):
    """
    Generate n_pdfs PDF files by calling feature_gen_func (which returns a dict of features)
    and saving them into the given folder.
    """
    for i in range(n_pdfs):
        data = feature_gen_func()
        filename = os.path.join(folder, f"proposal_{i+1}.pdf")
        create_pdf(data, filename)
    print(f"{n_pdfs} PDF files have been generated in '{folder}'.")

# ------------------------
# PDF Parsing Functions
# ------------------------

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
    Given text from a PDF (with lines like 'key: value unit'),
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
                feature_dict[key] = float(val_parts[0])
            except ValueError:
                feature_dict[key] = val_parts[0]
    return feature_dict

def load_data_from_pdfs(folder):
    """
    Iterate through all PDFs in a folder, extract the features,
    and return a DataFrame of the parsed data.
    """
    data_records = []
    for file in os.listdir(folder):
        if file.lower().endswith(".pdf"):
            pdf_path = os.path.join(folder, file)
            text = extract_text_from_pdf(pdf_path)
            features_extracted = parse_features_from_text(text)
            if all(feature in features_extracted for feature in FEATURES):
                data_records.append(features_extracted)
            else:
                print(f"File {file} is missing some features. Skipped.")
    return pd.DataFrame(data_records)

# ------------------------
# Training Functions
# ------------------------

def compute_target(df):
    """
    Compute the target variable 'feasible' using the synthetic rule:
      A proposal is considered feasible if:
         - proposal_cost < 5,500,000 (55 lakh rupees)
         - road_length > 10 km
         - material_quality > 5
         - past_performance > 0.5
         - construction_complexity < 8
    """
    df["feasible"] = ((df["proposal_cost"] < 5500000) &
                      (df["road_length"] > 10) &
                      (df["material_quality"] > 5) &
                      (df["past_performance"] > 0.5) &
                      (df["construction_complexity"] < 8)).astype(int)
    return df

def train_model_from_pdf_data():
    """
    Load training PDFs from TRAIN_PDF_FOLDER, compute the target variable,
    and train a Random Forest classifier.
    """
    df = load_data_from_pdfs(TRAIN_PDF_FOLDER)
    if df.empty:
        raise ValueError("No valid training PDF data found!")
    print("Training data extracted from PDFs:")
    print(df.head())
    df = compute_target(df)
    print("Training data with computed target:")
    print(df.head())
    
    X = df[FEATURES]
    y = df["feasible"]
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    return clf, df

def save_model(model, model_path="model_from_pdf.pkl"):
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

# ------------------------
# Main Section (Training & PDF Generation)
# ------------------------

if __name__ == '__main__':
    # 1. Generate 500 training PDFs.
    generate_pdfs(n_pdfs=500, folder=TRAIN_PDF_FOLDER, feature_gen_func=generate_random_features)
    
    # 2. Generate 20 test PDFs for feasible proposals.
    generate_pdfs(n_pdfs=20, folder=TEST_FEASIBLE_FOLDER, feature_gen_func=lambda: generate_conditioned_features(feasible=True))
    
    # 3. Generate 20 test PDFs for non-feasible proposals.
    generate_pdfs(n_pdfs=20, folder=TEST_NONFEASIBLE_FOLDER, feature_gen_func=lambda: generate_conditioned_features(feasible=False))
    
    # 4. Load training data, train the model, and save it.
    model, train_df = train_model_from_pdf_data()
    save_model(model)
    
    # 5. (Optional) Demonstrate prediction on a new PDF.
    new_data = generate_random_features()
    new_pdf_path = os.path.join(TRAIN_PDF_FOLDER, "new_proposal.pdf")
    create_pdf(new_data, new_pdf_path)
    new_text = extract_text_from_pdf(new_pdf_path)
    new_features = parse_features_from_text(new_text)
    
    new_X = pd.DataFrame([{key: new_features[key] for key in FEATURES}])
    prediction = model.predict(new_X)[0]
    prediction_str = "Feasible" if prediction == 1 else "Not Feasible"
    print("\nNew proposal data:")
    print(new_features)
    print(f"Prediction for the new proposal is: {prediction_str}")
