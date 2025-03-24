from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from api.chatbot import router
import logging
import time
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('chatbot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Log request details
    logger.debug(f"Request: {request.method} {request.url}")
    logger.debug(f"Headers: {dict(request.headers)}")
    logger.debug(f"Origin: {request.headers.get('origin')}")
    
    try:
        # Get request body if it exists
        body = await request.body()
        if body:
            logger.debug(f"Request body: {body.decode()}")
    except Exception as e:
        logger.error(f"Error reading request body: {str(e)}")

    # Process request
    response = await call_next(request)
    
    # Log response details
    process_time = time.time() - start_time
    logger.debug(f"Response status: {response.status_code}")
    logger.debug(f"Response headers: {dict(response.headers)}")
    logger.debug(f"Process time: {process_time:.2f}s")
    
    return response

# Add CORS middleware with specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Add CSP headers middleware
@app.middleware("http")
async def add_csp_headers(request, call_next):
    response = await call_next(request)
    # Allow connections to localhost:3001 and all necessary resources
    response.headers["Content-Security-Policy"] = "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;"
    return response

# Add proxy endpoint for frontend
@app.options("/api/v1/chatbot")
async def options_chatbot():
    logger.debug("Handling OPTIONS request for /api/v1/chatbot")
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "3600"
        }
    )

# Include chatbot router
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting chatbot API server...")
    uvicorn.run(app, host="0.0.0.0", port=3001) 