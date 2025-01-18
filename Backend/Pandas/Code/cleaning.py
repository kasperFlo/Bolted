import pandas as pd
import json
from category import get_website_info
from productive import isProductive

# File paths
input_file_path = "/Users/arnav/Desktop/Hackathon 2025/Bolted/Backend/Pandas/Data/data.json"
output_file_path = "/Users/arnav/Desktop/Hackathon 2025/Bolted/Backend/Pandas/Data/output.csv"

def load_data(input_file_path):
    """Load JSON data from the input file."""
    with open(input_file_path, "r") as file:
        return json.load(file)

def clean_data(df):
    """Clean the dataframe by dropping rows with null 'site' and calculating session time."""
    df = df.dropna(subset=["site"])
    df["session_time"] = df["end"] - df["start"]
    return df

def get_website_info_for_sites(df):
    """Map domain, category, and description for each site."""
    site_info = {site: get_website_info(site) for site in df["site"].unique()}
    df["domain"], df["category"], df["description"] = zip(*df["site"].map(lambda site: site_info.get(site, [None, None, None])))
    return df

def calculate_productivity(df):
    """Add productivity status to each website."""
    df["is_productive"] = df.apply(
        lambda row: isProductive(row["domain"], row["category"], row["description"]), axis=1
    )
    return df

def process_data(input_file_path):
    """Process the data: load, clean, add website info, and calculate productivity."""
    # Load and clean data
    data = load_data(input_file_path)
    df = pd.DataFrame(data)
    df = clean_data(df)

    # Add website info and calculate productivity
    df = get_website_info_for_sites(df)
    df = calculate_productivity(df)

    # Group by site to calculate total time and sessions
    result = df.groupby(["site", "domain", "category", "description", "is_productive"]).agg(
        total_time=("session_time", "sum"),
        total_sessions=("site", "count")
    ).reset_index()

    # Calculate total time spent on productive and non-productive websites
    total_productive_time = df[df["is_productive"] == True]["session_time"].sum()
    total_non_productive_time = df[df["is_productive"] == False]["session_time"].sum()

    # Add these totals to the result
    result.loc[len(result)] = [
        "Total Productive", "-", "-", "-", True, 
        total_productive_time, len(df[df["is_productive"] == True])
    ]
    result.loc[len(result)] = [
        "Total Non-Productive", "-", "-", "-", False, 
        total_non_productive_time, len(df[df["is_productive"] == False])
    ]

    return result

def save_result(result, output_file_path):
    """Save the final result to a CSV file."""
    result.to_csv(output_file_path, index=False)
    print(f"Results saved to {output_file_path}")

# Main execution flow
result = process_data(input_file_path)
save_result(result, output_file_path)
