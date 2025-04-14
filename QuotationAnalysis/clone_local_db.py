import pymongo
from pymongo import MongoClient

# ------------------------------
# Configuration
# ------------------------------

# --- Source URI for remote MongoDB ---
# IMPORTANT:
# If the remote MongoDB instance is running on a different computer, you should replace
# 'localhost' with the remote computer's IP address or hostname.
# For example, if the remote IP is 192.168.1.10:
# source_uri = "mongodb://192.168.1.10:27017/"
#
# If you are using port forwarding or running the script on the remote machine,
# you can use 'localhost' as shown below.
source_uri = "mongodb://192.168.210.135:27017/"

# Name of the source database to clone from the remote MongoDB.
source_db_name = "MajorProject"

# --- Target URI for your local MongoDB ---
# This connection string should point to the MongoDB instance on your own PC.
target_uri = "mongodb://localhost:27017/"

# Name of the target database to create (clone into).
# You can use the same name or a different one if you want to preserve the original.
target_db_name = "MajorProject"

# ------------------------------
# Create MongoDB client connections
# ------------------------------
source_client = MongoClient(source_uri)
target_client = MongoClient(target_uri)

# Get the source and target database objects.
source_db = source_client[source_db_name]
target_db = target_client[target_db_name]

# ------------------------------
# Function to clone the database
# ------------------------------
def clone_database():
    # List all collections in the source database.
    collections = source_db.list_collection_names()
    
    if not collections:
        print(f"No collections found in the source database '{source_db_name}'.")
        return

    for coll_name in collections:
        source_coll = source_db[coll_name]
        target_coll = target_db[coll_name]
        
        # Optional: Drop the target collection if it already exists.
        target_coll.drop()
        print(f"Dropped target collection '{coll_name}' (if it existed).")
        
        # Retrieve all documents from the source collection.
        documents = list(source_coll.find())
        if documents:
            # Insert the documents into the corresponding collection in the target database.
            target_coll.insert_many(documents)
            print(f"Cloned {len(documents)} document(s) from collection '{coll_name}'.")
        else:
            print(f"Collection '{coll_name}' is empty; nothing to clone.")

# ------------------------------
# Main execution
# ------------------------------
if __name__ == "__main__":
    print(f"Starting to clone database '{source_db_name}' from remote ({source_uri}) into '{target_db_name}' on your local MongoDB instance ({target_uri})...")
    clone_database()
    print("Database cloning completed.")
