import joblib
import pickle

# Load the model from the .joblib file
model = joblib.load('/Users/aviralchauhan/btp/server/final_models/8_Nutrients/nutrients_8.joblib')

# Save the model to a .pkl file
with open('/Users/aviralchauhan/btp/server/final_models/8_Nutrients/nutrients_8.pkl', 'wb') as f:
    pickle.dump(model, f)


with open('/Users/aviralchauhan/btp/server/final_models/8_Nutrients/nutrients_8.pkl', 'rb') as f:
  model = pickle.load(f)

# Example input data (replace with actual data)
sample_input = [[53.2,11.7,8.2,1.08,0.5,9.6,561.0,1.3]]  # Adjust this according to your model's expected input format

# Use the model to make predictions
predictions = model.predict(sample_input)

# Print the predictions
print(f"Classification: {float(predictions)}")
