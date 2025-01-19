import google.generativeai as genai
from dotenv import load_dotenv
import os
import openai

load_dotenv()
key = (os.environ['GOOGLE_API_KEY'])
api_key = (os.environ['GOOGLE_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-flash")


openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Model = "gpt-4o-mini"


def isProductive(URL):

    prompt = f"""
     You are a productivity assistant. Your job is to determine if a website is productive or not based on its URL.

     URL: '{URL}'

     A website is considered productive if it is focused on enhancing learning, work-related tasks, or self-improvement. Examples include websites for educational courses, professional tools, research, or productivity hacks. On the other hand, a website is non-productive if it is primarily for entertainment, social media, or leisure purposes.

     Given the information above, respond with "True" if the website is productive or "False" if it is non-productive.
     """


    try:
        # Send the prompt to the OpenAI GPT model
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        # Extract the text response
        answer = response['choices'][0]['message']['content'].strip()
        # Return True if the response is "True", otherwise False
        return answer.lower() == "true"
    except Exception as e:
        print(f"Error: {e}")
        return False


# def isProductive(domain, category, description):
#     prompt = f"""
#     You are a productivity assistant. Your job is to determine if a website is productive or not based on its domain, category, and description.

#     Domain: '{domain}'
#     Category: '{category}'
#     Description: '{description}'

#     A website is considered productive if it is focused on enhancing learning, work-related tasks, or self-improvement. Examples include websites for educational courses, professional tools, research, or productivity hacks. On the other hand, a website is non-productive if it is primarily for entertainment, social media, or leisure purposes.

#     Given the information above, respond with "True" if the website is productive or "False" if it is non-productive.
#     """
    
#     # Send the prompt to the AI model
#     response = model.generate_content(prompt)

#     # Interpret the response and return True or False
#     return response.text.strip().lower() == "true"

def isProductiveYoutube(title, tags):
    prompt = f"""
    You are a productivity assistant. Your job is to determine if a YouTube video is productive or not based on its title and tags.

    Title: '{title}'
    Tags: {tags}

    A video is considered productive if it is focused on enhancing learning, work-related tasks, or self-improvement. Examples include videos for educational courses, professional tools, research, or productivity hacks. On the other hand, a video is non-productive if it is primarily for entertainment, social media, or leisure purposes.

    Given the information above, respond with "True" if the video is productive or "False" if it is non-productive.
    """

    # Send the prompt to the AI model
    response = model.generate_content(prompt)

    # Interpret the response and return True or False
    return response.text.strip().lower() == "true"

print(isProductive("https://slate.sheridancollege.ca/d2l/le/content/1335525/Home"))