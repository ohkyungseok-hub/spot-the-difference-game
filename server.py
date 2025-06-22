from flask import Flask, send_file, jsonify
import os
import json

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
original_path = os.path.join(BASE_DIR, "original1.jpg")
modified_path = os.path.join(BASE_DIR, "game_round_modified.png")

# 직접 코드에 삽입한 정답 좌표 (JSON 없이도 동작)
HARDCODED_COORDS = {
    "coords": [
        { "x": 490, "y": 90, "radius": 40 },
        { "x": 685, "y": 110, "radius": 35 },
        { "x": 570, "y": 410, "radius": 30 },
        { "x": 600, "y": 610, "radius": 45 },
        { "x": 500, "y": 880, "radius": 40 }
    ]
}


@app.route("/")
def serve_index():
    return send_file(os.path.join(BASE_DIR, "index.html"))

@app.route("/script.js")
def serve_script():
    return send_file(os.path.join(BASE_DIR, "script.js"))

@app.route("/original")
def get_original():
    return send_file(original_path, mimetype="image/jpeg")

@app.route("/image")
def get_image():
    return send_file(modified_path, mimetype="image/png")

@app.route("/generate")
def generate():
    with open("game_round_coords.json", "r") as f:
        return jsonify(json.load(f))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)