import google.generativeai as genai

genai.configure(api_key="AIzaSyDQJmpb6-EFeNBVFYR2kLfDjyQJ8sGQvbY")
model = genai.GenerativeModel("gemini-1.5-flash")

def isProductive(domain, category, description):
    prompt = f"""
    You are a productivity assistant. Your job is to determine if a website is productive or not based on its domain, category, and description.

    Domain: '{domain}'
    Category: '{category}'
    Description: '{description}'

    A website is considered productive if it is focused on enhancing learning, work-related tasks, or self-improvement. Examples include websites for educational courses, professional tools, research, or productivity hacks. On the other hand, a website is non-productive if it is primarily for entertainment, social media, or leisure purposes.

    Given the information above, respond with "True" if the website is productive or "False" if it is non-productive.
    """
    
    # Send the prompt to the AI model
    response = model.generate_content(prompt)

    # Interpret the response and return True or False
    return response.text.strip().lower() == "true"
