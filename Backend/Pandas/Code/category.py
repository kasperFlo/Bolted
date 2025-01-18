import requests

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