import google.generativeai as genai
import json

# The model to use for analysis
# Change the model name here from "gemini-1.5-flash" to "gemini-2.5-flash"
MODEL_NAME = "gemini-2.5-flash"

def get_gemini_analysis(resume_text):
    """
    Sends resume text to the Gemini API for analysis and returns a structured response.
    """
    prompt = f"""
    You are a professional ATS (Applicant Tracking System) and career coach. Your task is to analyze a resume and provide a detailed ATS score and actionable suggestions for improvement.

    Analyze the following resume text for ATS compatibility. Provide a score out of 100 and a list of specific, actionable suggestions.
    
    The suggestions should focus on:
    1. ATS-friendly formatting and structure.
    2. Inclusion of relevant keywords.
    3. Clarity and conciseness.
    4. Quantifiable achievements.
    5. Grammar and spelling.
    
    In addition to the analysis, provide a one-page, updated version of the resume content, formatted as plain text. The content should be improved based on your suggestions.

    Output must be a single JSON object with the following keys:
    - "score": (integer) The ATS score out of 100.
    - "suggestions": (list of strings) A list of bulleted suggestions.
    - "updated_resume_text": (string) The full, updated resume content as a single block of text.

    Resume Text to Analyze:
    {resume_text}
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        
        # Clean and parse the JSON response
        clean_response = response.text.strip().lstrip('`json').rstrip('`').strip()
        return json.loads(clean_response)
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"error": f"An error occurred with the Gemini API: {e}"}