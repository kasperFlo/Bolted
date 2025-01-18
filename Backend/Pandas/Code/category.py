import requests
from dotenv import load_dotenv
import os
from googleapiclient.discovery import build

load_dotenv()
os.getenv

def get_website_info(target_url):
    # Construct the full API request URL
    api_url = f"https://talosintelligence.com/cloud_intel/url_reputation?url={target_url}"
    
    try:
        # Send a GET request to the API
        response = requests.get(api_url)
        
        # Raise an exception if the request failed
        response.raise_for_status()
        
        # Parse the JSON response
        data = response.json()
        
        # Extract the domain name
        domain = data.get("url_elements", {}).get("domain", "Unknown Domain")
        
        # Extract the category description and full description
        category_info = data.get("reputation", {}).get("aup_cat", [])
        category_text = category_info[0].get("desc_short", [{}])[0].get("text", "Unknown Category") if category_info else "Unknown Category"
        description_text = category_info[0].get("desc_long", [{}])[0].get("text", "No Description Available") if category_info else "No Description Available"
        
        # Return the results
        return domain, category_text, description_text
    
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}")
        return None, None, None
    except (KeyError, IndexError) as e:
        print(f"Error parsing API response: {e}")
        return None, None, None
    
def get_video_details(video_url):
    # Extract the video ID from the URL
    video_id = video_url.split("v=")[-1].split("&")[0]

    # Build the YouTube API client
    youtube = build('youtube', 'v3', developerKey=os.environ["YOUTUBE_API_KEY"])

    # Request video details
    request = youtube.videos().list(
        part="snippet",
        id=video_id
    )
    response = request.execute()

    # Extract title and tags
    if "items" in response and len(response["items"]) > 0:
        snippet = response["items"][0]["snippet"]
        title = snippet.get("title", "No Title Found")
        tags = snippet.get("tags", [])
        return {"title": title, "tags": tags}
    else:
        return {"title": "Video not found", "tags": []}

# Example usage
# api_key = "AIzaSyDNL_irmkMMG9yCwMaxFzJR0x6cdFT0Otw"
# video_url = "https://www.youtube.com/watch?v=gGalnVpaom8&list=PLSQl0a2vh4HBnhjPgsJU2y1UhMwcYmb5u"
# video_url1 = "https://www.youtube.com/watch?v=bgNrnzGV19U"
# details = get_video_details(video_url)
# print("Title:", details["title"])
# print("Tags:", details["tags"])