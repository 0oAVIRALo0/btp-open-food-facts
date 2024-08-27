from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

nutrients_7_path = '/Users/aviralchauhan/btp/server/final_models/7_Nutrients/nutrients_7.pkl'
nutrients_8_path = '/Users/aviralchauhan/btp/server/final_models/8_Nutrients/nutrients_8.pkl'
nutrients_44_path = ''

# Load the model when the server starts
with open(nutrients_7_path, 'rb') as f:
    model = pickle.load(f)

def modelSelection(path):
    with open(path, 'rb') as f:
      model = pickle.load(f)

    return model

@app.route('/predict', methods=['POST'])
def predict():
    modelId = request.json['model']
    if (modelId == '7'):
        modelSelection(nutrients_7_path)
    elif (modelId == '8'):
        modelSelection(nutrients_8_path)
    else:
        modelSelection(nutrients_44_path)

    data = request.json['input']
    prediction = model.predict([data])
    return jsonify({'Classification': float(prediction[0])})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
