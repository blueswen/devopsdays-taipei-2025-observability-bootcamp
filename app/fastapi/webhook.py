import os
import uvicorn
import json
from fastapi import FastAPI, Request
import logging

APP_NAME = os.environ.get("APP_NAME", "app")
EXPOSE_PORT = os.environ.get("EXPOSE_PORT", 8000)

app = FastAPI()


@app.get("/")
async def root(request: Request):
    logging.error("Received request at root endpoint")
    return {"return": "Hello World"}


@app.post("/webhook")
async def request(request: Request):
    logging.info("Received webhook request")
    data = await request.json()
    logging.info("Webhook data:")
    logging.info(json.dumps(data, indent=2))
    return {"return": "copy that"}


if __name__ == "__main__":
    fmt = "%(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d] - %(message)s"
    log_config = uvicorn.config.LOGGING_CONFIG
    log_config["formatters"]["access"]["fmt"] = fmt
    log_config["formatters"]["default"]["fmt"] = fmt
    logging.basicConfig(
        level=logging.INFO,
        format=fmt,
        force=True,
    )
    uvicorn.run(app, host="0.0.0.0", port=int(EXPOSE_PORT), log_config=log_config)
