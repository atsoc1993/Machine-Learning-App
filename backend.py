from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SomeData(BaseModel):
    x: int
    y: int


@app.post('/app/test')
def test_endpoint(some_data: SomeData):
    print(some_data)

