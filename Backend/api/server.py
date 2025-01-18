from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/api/analyze", methods=["POST"])
def analyze():
    # get the json data from the request
    data = request.get_json()

    # send to other functions for whatever analysis and then return
    
    return {"message": f"Received data: {data}"}

if __name__ == "__main__":
    app.run()