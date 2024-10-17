import pandas as pd
import csv

# List of columns to extract
selected_columns = [
    "code", "url", "created_datetime", "last_updated_datetime", "product_name", 
    "generic_name", "quantity", "packaging_en", "nova_group", "brands", 
    "categories_en", "origins_en", "manufacturing_places", "labels_en", 
    "purchase_places", "stores", "countries_en", "ingredients_text", 
    "ingredients_analysis_tags", "traces_en", "serving_size", 
    "additives_n", "additives_en", "nutrition-score-fr_100g", 
    "nutrition-score-uk_100g", "nutriscore_grade", "pnns_groups_1", 
    "pnns_groups_2", "food_groups_en", "ecoscore_score", "ecoscore_grade", 
    "nutrient_levels_tags", "data_quality_errors_tags", "unique_scans_n", 
    "completeness", "last_image_datetime", "main_category_en", 
    "image_url", "image_small_url", "image_ingredients_url", 
    "image_ingredients_small_url", "image_nutrition_url", 
    "image_nutrition_small_url"
]

# Define input and output file paths
input_csv = "/Users/aviralchauhan/btp/open-food-facts/server/datasets/Open Food Facts Products.csv"  # Replace with your input file path
output_csv = "filtered_data.csv"  # Output file for extracted data

# Helper function to clean rows and align with the header
def clean_row(row, expected_length):
    """Trim spaces and pad rows to match the expected length."""
    cleaned = [value.strip() if isinstance(value, str) else value for value in row]
    if len(cleaned) < expected_length:
        cleaned.extend(["N/A"] * (expected_length - len(cleaned)) )  # Pad with 'N/A'
    return cleaned[:expected_length]  # Truncate if row is too long

try:
    cleaned_data = []
    with open(input_csv, "r", encoding="utf-8") as file:
        reader = csv.reader(file, quotechar='"', delimiter=",", skipinitialspace=True)
        
        # Read the header and clean it
        header = next(reader)
        cleaned_header = clean_row(header, len(header))

        # Process only the first 100 rows
        for i, row in enumerate(reader):
            if i >= 100:
                break  # Stop after 100 rows
            
            cleaned_row = clean_row(row, len(cleaned_header))
            cleaned_data.append(cleaned_row)

    # Convert cleaned data to DataFrame and filter relevant columns
    df = pd.DataFrame(cleaned_data, columns=cleaned_header)

    # Select only the specified columns (if they exist)
    filtered_df = df[selected_columns].copy()

    # Handle missing values by filling with 'N/A'
    filtered_df.fillna("N/A", inplace=True)

    # Save the filtered data to a new CSV file
    filtered_df.to_csv(output_csv, index=False, encoding="utf-8")

    print(f"Data successfully extracted and saved to {output_csv}")

except FileNotFoundError:
    print(f"Error: The file '{input_csv}' was not found. Please check the file path.")
except pd.errors.EmptyDataError:
    print("Error: The input CSV file is empty.")
except KeyError as e:
    print(f"Error: Column not found - {e}. Please check the column names.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
