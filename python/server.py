from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/python-output")
def read_python_output():
    # Simulate Python script output
    output = "Hello from Python!"
    return JSONResponse(content={"output": output})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
