import json

from flask import Flask, request
from flask_cors import CORS

from Pandas.Code.cleaning import process_data

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/api/analyze", methods=["POST"])
def analyze():
    # get the json data from the request
    data = request.get_json()
    with open("Pandas/Data/data.json", "w") as f:
        json.dump(data, f)
    # send to other functions for whatever analysis and then return

    result = process_data("Pandas/Data/data.json")
    return result.to_json()


if __name__ == "__main__":
    app.run(port=5001)
    # print(process_data("Pandas/Data/data.json"))
