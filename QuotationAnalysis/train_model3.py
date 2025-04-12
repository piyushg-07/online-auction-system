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
    "past_performance": "",                   # ratio (0-1)
    "experience_years": "yrs",                # years of experience
    "regional_infrastructure_quality": "score",  # rating 1-10
    "traffic_density": "",                    # ratio (0-1)
    "environmental_impact_score": "score",    # rating 1-10
    "regulatory_complexity": "score",         # rating 1-10
    "construction_complexity": "score",       # rating 1-10
    "budget_variance": "",                    # ratio (0-0.2)
    "maintenance_history": "times"            # count of occurrences/issues
}

def generate_random_features():
    """Generate a dictionary of random features using general distributions."""
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

def generate_conditioned_features(feasible=True):
    """
    Generate features biased to be feasible or non-feasible.
    For feasible proposals, we set values well within the thresholds:
        - proposal_cost: well below 550000,
        - material_quality: high (8 to 10),
        - past_performance: high (>= 0.8),
        - construction_complexity: very low (1 to 3).
    For non-feasible proposals, we force one condition to break.
    """
    if feasible:
        return {
            "proposal_cost": np.random.uniform(350000, 450000),   # well below threshold
            "road_length": np.random.normal(loc=50, scale=20),
            "material_quality": np.random.randint(8, 11),           # high quality
            "contract_duration": np.random.randint(30, 365),
            "past_performance": np.random.uniform(0.8, 1.0),          # high performance
            "experience_years": np.random.randint(1, 40),
            "regional_infrastructure_quality": np.random.randint(1, 11),
            "traffic_density": np.random.uniform(0, 1),
            "environmental_impact_score": np.random.randint(1, 11),
            "regulatory_complexity": np.random.randint(1, 11),
            "construction_complexity": np.random.randint(1, 4),     # very low complexity (1-3)
            "budget_variance": np.random.uniform(0, 0.2),
            "maintenance_history": np.random.randint(1, 6)
        }
    else:
        # For non-feasible, intentionally break one rule.
        choices = {}
        condition_break = np.random.choice(["cost", "quality", "performance", "complexity"])
        if condition_break == "cost":
            choices["proposal_cost"] = np.random.uniform(560000, 700000)  # Above threshold
        else:
            choices["proposal_cost"] = np.random.normal(loc=500000, scale=150000)
        if condition_break == "quality":
            choices["material_quality"] = np.random.randint(1, 6)  # Low quality (≤5)
        else:
            choices["material_quality"] = np.random.randint(1, 11)
        if condition_break == "performance":
            choices["past_performance"] = np.random.uniform(0, 0.4)  # Low performance
        else:
            choices["past_performance"] = np.random.uniform(0, 1)
        if condition_break == "complexity":
            choices["construction_complexity"] = np.random.randint(8, 12)  # High complexity (≥8)
        else:
            choices["construction_complexity"] = np.random.randint(1, 11)
        
        # Fill in the remaining features.
        choices["road_length"] = np.random.normal(loc=50, scale=20)
        choices["contract_duration"] = np.random.randint(30, 365)
        choices["experience_years"] = np.random.randint(1, 40)
        choices["regional_infrastructure_quality"] = np.random.randint(1, 11)
        choices["traffic_density"] = np.random.uniform(0, 1)
        choices["environmental_impact_score"] = np.random.randint(1, 11)
        choices["regulatory_complexity"] = np.random.randint(1, 11)
        choices["budget_variance"] = np.random.uniform(0, 0.2)
        choices["maintenance_history"] = np.random.randint(1, 6)
        return choices

def create_pdf(data_dict, filename):
    """Create a PDF file with key-value pairs from data_dict (with unit labels)."""
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
    Generate n_pdfs PDF files using the given feature generator function.
    folder: Directory to store PDFs.
    feature_gen_func: Function that returns a dictionary of features.
    """
    for i in range(n_pdfs):
        data = feature_gen_func()
        filename = os.path.join(folder, f"proposal_{i+1}.pdf")
        create_pdf(data, filename)
    print(f"{n_pdfs} PDF files have been generated in '{folder}'.")

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
    Given text with lines of the form 'key: value unit',
    parse and return a dictionary of features (unit is ignored).
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
    """Iterate through all PDFs in the folder, parse the features, and return a DataFrame."""
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

def compute_target(df):
    """
    Compute the target variable 'feasible' using the synthetic rule:
      Feasible if:
         - proposal_cost < 550000,
         - material_quality > 5,
         - past_performance > 0.5,
         - construction_complexity < 8.
    """
    df["feasible"] = ((df["proposal_cost"] < 550000) &
                      (df["material_quality"] > 5) &
                      (df["past_performance"] > 0.5) &
                      (df["construction_complexity"] < 8)).astype(int)
    return df

def train_model_from_pdf_data():
    """Load training PDFs, compute the target, and train a Random Forest model."""
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
