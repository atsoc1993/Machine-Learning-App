from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"]
)

class TrainingData(BaseModel):
    x_features: list[list[int]]
    output_data: list[int | str]

class TrainingResult(BaseModel):
    success: bool
    message: str
    weights: list[float]
    biases: list[float]


def train_model_via_single_feature_linear_regression(x_feature: list, y_data: list) -> tuple[list, list, bool, str]:

    learning_rate = 0.001
    epochs = 100_000
    w = b = 0
    len_data = len(x_feature)
    if len(x_feature) != len(y_data):
        return [], [], False, "Input Data/Output Data Length Mismatch"

    for _ in range(epochs):
        dw = 0
        db = 0
        for x, y in zip(x_feature, y_data):
            y_prediction = x * w + b
            error = y_prediction - y
            dw += error * x
            db += error

        dw /= len_data
        db /= len_data

        w -= learning_rate * dw
        b -= learning_rate * db

    return [w], [b], True, "Model trained successfully!"
            
@app.post('/app/train_model')
def test_endpoint(training_data: TrainingData) -> TrainingResult:

    if len(training_data.x_features) == 1:
        weights, biases, success, message = train_model_via_single_feature_linear_regression(training_data.x_features[0], training_data.output_data)
    return TrainingResult(
        success=success,
        message=message,
        weights=weights,
        biases=biases
    )
