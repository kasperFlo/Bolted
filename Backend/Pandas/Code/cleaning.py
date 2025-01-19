import json
from urllib.parse import urlparse
import pandas as pd
from category import get_video_details
from productive import isProductive, isProductiveYoutube

# File paths
input_file_path = "Backend/Pandas/Data/data.json"
output_file_path = "Backend/Pandas/Data/output.csv"


def load_data(input_file_path):
    """Load JSON data from the input file."""
    with open(input_file_path, "r") as file:
        return json.load(file)


def clean_data(df):
    """Clean the dataframe by dropping rows with null 'site' and calculating session time."""
    df = df.dropna(subset=["site"])
    df["session_time"] = df["end"] - df["start"]
    return df

def is_youtube_url(url):
    """Check if a URL belongs to YouTube."""
    parsed_url = urlparse(url)
    return "youtube.com" in parsed_url.netloc


def calculate_productivity(df):
    """Add productivity status to each website."""
    def check_productivity(site):
        if is_youtube_url(site):
            # Fetch video details (title and tags) for YouTube URLs
            video_details = get_video_details(site)
            title = video_details.get("title", "")
            tags = video_details.get("tags", [])
            # Use isProductiveYoutube for YouTube-specific logic
            return isProductiveYoutube(title, tags)
        # Use isProductive for other websites
        return isProductive(site)

    df["is_productive"] = df["site"].apply(check_productivity)
    return df


def process_data(input_file_path):
    """Process the data: load, clean, and calculate productivity."""
    # Load and clean data
    data = load_data(input_file_path)
    df = pd.DataFrame(data)
    df = clean_data(df)
    # Calculate productivity
    df = calculate_productivity(df)
    # Group by site to calculate total time and sessions
    result = (
        df.groupby(["site", "is_productive"])
        .agg(total_time=("session_time", "sum"), total_sessions=("site", "count"))
        .reset_index()
    )
    # Calculate total time spent on productive and non-productive websites
    total_productive_time = df[df["is_productive"] == True]["session_time"].sum()
    total_non_productive_time = df[df["is_productive"] == False]["session_time"].sum()
    # Add these totals to the result
    result.loc[len(result)] = [
        "Total Productive",
        True,
        total_productive_time,
        len(df[df["is_productive"] == True]),
    ]
    result.loc[len(result)] = [
        "Total Non-Productive",
        False,
        total_non_productive_time,
        len(df[df["is_productive"] == False]),
    ]
    return result


def save_result(result, output_file_path):
    """Save the final result to a CSV file."""
    result.to_csv(output_file_path, index=False)
    print(f"Results saved to {output_file_path}")


# Main execution flow
result = process_data(input_file_path)
save_result(result, output_file_path)
