import json

from flask import Flask, request
from Pandas.Code.cleaning import process_data

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/api/analyze", methods=["POST"])
def analyze():
    # get the json data from the request
    data = request.get_json()
    with open("Backend/Pandas/Data/data.json", "w") as f:
        json.dump(data, f)
    # send to other functions for whatever analysis and then return

    return {"message": process_data("Backend/Pandas/Data/data.json")}


if __name__ == "__main__":
    # app.run(port=5001)
    process_data("Backend/Pandas/Data/data.json")
