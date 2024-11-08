from flask import Flask, request, jsonify
import pickle
import os

app = Flask(__name__)

base_dir = os.path.dirname(__file__)
nutrients_7_path = os.path.join(base_dir, '7_Nutrients/nutrients_7.pkl')
nutrients_8_path = os.path.join(base_dir, '8_Nutrients/nutrients_8.pkl')
nutrients_44_path = os.path.join(base_dir, '44_Nutrients/nutrients_44.pkl')

# Load the model when the server starts
with open(nutrients_7_path, 'rb') as f:
    model = pickle.load(f)

def modelSelection(path):
    with open(path, 'rb') as f:
      model = pickle.load(f)

    return model

@app.route('/predict', methods=['POST'])
def predict():
    nutrientLevel = request.json['nutrientLevel']
    if (nutrientLevel == '7'):
        modelSelection(nutrients_7_path)
    elif (nutrientLevel == '8'):
        modelSelection(nutrients_8_path)
    else:
        modelSelection(nutrients_44_path)

    modelInputData = request.json['modelInputData']
    prediction = model.predict([modelInputData])
    return jsonify({'Classification': float(prediction[0])})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
