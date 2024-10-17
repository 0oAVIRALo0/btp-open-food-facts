import joblib
import pickle

# Load the model from the .joblib file
model = joblib.load('/Users/aviralchauhan/btp/open-food-facts/server/ml/44_Nutrients/nutrients_44.joblib')

# Save the model to a .pkl file
with open('/Users/aviralchauhan/btp/open-food-facts/server/ml/44_Nutrients/nutrients_44.pkl', 'wb') as f:
    pickle.dump(model, f)


# with open('/Users/aviralchauhan/btp/server/final_models/8_Nutrients/nutrients_8.pkl', 'rb') as f:
#   model = pickle.load(f)

# Example input data (replace with actual data)
# sample_input = [[53.2,11.7,8.2,1.08,0.5,9.6,561.0,1.3]]  # Adjust this according to your model's expected input format

# # Use the model to make predictions
# predictions = model.predict(sample_input)

# # Print the predictions
# print(f"Classification: {float(predictions)}")


# from sklearn.preprocessing import StandardScaler
# import numpy as np

# # Example dataset
# data = np.array([[1.0, 2.0, 3.0],
#                  [4.0, 5.0, 6.0],
#                  [7.0, 8.0, 9.0]])

# # Initialize the scaler
# scaler = StandardScaler()

# # Fit the scaler to your data (calculates mean and standard deviation for scaling)
# scaler.fit(data)

# # Transform the data using the fitted scaler (standardizes the data)
# scaled_data = scaler.transform(data)

# print("Original Data:")
# print(data)
# print("\nScaled Data:")
# print(scaled_data)
