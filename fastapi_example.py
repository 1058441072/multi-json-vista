"""
FastAPI example for serving the Multi-JSON Visual Editor

Install dependencies:
    pip install fastapi uvicorn jinja2

Run the server:
    uvicorn fastapi_example:app --reload

Then open: http://localhost:8000
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI(title="Multi-JSON Visual Editor")
templates = Jinja2Templates(directory="templates")


# Sample JSON data that will be passed to the template
sample_backend_data = [
    {
        "name": "User Data",
        "data": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "roles": ["admin", "user"],
            "settings": {
                "theme": "dark",
                "notifications": True
            }
        }
    },
    {
        "name": "Product Info",
        "data": {
            "id": 101,
            "title": "Sample Product",
            "price": 29.99,
            "inStock": True,
            "tags": ["electronics", "gadgets"],
            "specs": {
                "weight": "500g",
                "dimensions": "10x5x2 cm"
            }
        }
    }
]


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """
    Main page - renders the JSON editor with optional backend data
    
    You can pass any JSON data via the backend_data parameter
    """
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "backend_data": sample_backend_data  # Pass your data here
        }
    )


@app.get("/api/jsons")
async def get_jsons():
    """
    API endpoint for loading JSON data dynamically
    
    This endpoint is called when users click "Load from Backend" button
    """
    return [
        {
            "name": "Dynamic Data 1",
            "data": {
                "timestamp": "2025-01-01T12:00:00",
                "status": "active",
                "count": 42
            }
        },
        {
            "name": "Dynamic Data 2",
            "data": {
                "items": ["apple", "banana", "orange"],
                "total": 3,
                "category": "fruits"
            }
        }
    ]


# Optional: Add more endpoints for dynamic data loading
@app.get("/no-data", response_class=HTMLResponse)
async def read_empty(request: Request):
    """
    Example: Render editor without initial data
    """
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "backend_data": []  # Empty - user can upload/paste manually
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
