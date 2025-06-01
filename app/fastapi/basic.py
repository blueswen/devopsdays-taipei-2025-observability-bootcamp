import asyncio
import os
import random

import httpx
import uvicorn
from fastapi import FastAPI, Request
from prometheus_client import (
    Counter,
    Gauge,
    Histogram,
    disable_created_metrics,
    make_asgi_app,
)

APP_NAME = os.environ.get("APP_NAME", "app")
EXPOSE_PORT = os.environ.get("EXPOSE_PORT", 8000)

app = FastAPI()
app.mount("/metrics", make_asgi_app())

# Disable unused created series for counters, histograms, and summaries Ref: https://prometheus.github.io/client_python/instrumenting/#disabling-_created-metrics
disable_created_metrics()

REQUEST_TIME = Histogram("request_processing_seconds", "Time spent processing request")
REQUEST_IN_PROCESSING = Gauge("request_in_processing", "Requests in progress")
REQUEST_COUNT = Counter("requests_count", "Total count of requests")


@app.get("/")
async def root(request: Request):
    REQUEST_IN_PROCESSING.inc()
    REQUEST_COUNT.inc()
    with REQUEST_TIME.time():
        await random_sleep()
    REQUEST_IN_PROCESSING.dec()
    return {"Hello": "World"}


@app.get("/request")
async def request(request: Request):
    httpx.get("https://httpstat.us/200")
    httpx.post("https://httpstat.us/404?sleep=3000")
    httpx.post("https://httpstat.us/500?sleep=1500")
    return {"request": "completed"}


async def random_sleep():
    await asyncio.sleep(random.randint(0, 5))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=EXPOSE_PORT)
