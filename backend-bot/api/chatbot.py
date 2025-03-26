import os
from typing import Optional
from pydantic import BaseModel
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Request
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Get API key from environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyDrnDa39ynySrFfFDdFSQhzeP6DxtN71d8")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

# Configure the Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

# Model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str

@router.post("/api/v1/chatbot", response_model=ChatResponse)
async def chat_with_gemini(chat_message: ChatMessage, request: Request) -> dict:
    try:
        # Log incoming request
        logger.info(f"Received chat request from {request.client.host}")
        logger.debug(f"Message content: {chat_message.message}")

        # Initialize the model
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        # Start a chat session
        chat = model.start_chat(history=[])
        
        # Send message to Gemini API
        logger.info("Sending request to Gemini API")
        response = chat.send_message(
            f"""As an AI assistant integrated into, a data analytics and visualization tool, 
            help users with their data analysis questions and usage.
            User question: {chat_message.message}"""
        )
        
        # Log successful response
        logger.info("Successfully received response from Gemini API")
        
        # Return response with timestamp
        return {
            "response": response.text,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        # Log error details
        logger.error(f"Error processing chat request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat request: {str(e)}"
        ) 