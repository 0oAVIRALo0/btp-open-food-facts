from elasticsearch import Elasticsearch, helpers
import pandas as pd

# Step 1: Set up Elasticsearch connection
es = Elasticsearch("http://localhost:9200")  # Adjust if necessary

# Step 2: Define the mapping for the index
mapping = {
    "mappings": {
        "properties": {
            "code": { "type": "keyword" },
            "url": { "type": "text" },
            "creator": { "type": "text" },
            "created_t": { "type": "long" },
            "created_datetime": { "type": "date" },
            "last_modified_t": { "type": "long" },
            "last_modified_datetime": { "type": "date" },
            "last_modified_by": { "type": "text" },
            "last_updated_t": { "type": "long" },
            "last_updated_datetime": { "type": "date" },
            "product_name": { "type": "text" },
            "abbreviated_product_name": { "type": "text" },
            "generic_name": { "type": "text" },
            "quantity": { "type": "text" },
            "packaging": { "type": "text" },
            "packaging_tags": { "type": "text" },
            "packaging_en": { "type": "text" },
            "packaging_text": { "type": "text" },
            "brands": { "type": "text" },
            "brands_tags": { "type": "text" },
            "categories_tags": { "type": "text" },
            "categories_en": { "type": "text" },
            "categories": { "type": "text" },
            "origins": { "type": "text" },
            "origins_tags": { "type": "text" },
            "origins_en": { "type": "text" },
            "manufacturing_places": { "type": "text" },
            "manufacturing_places_tags": { "type": "text" },
            "labels": { "type": "text" },
            "labels_tags": { "type": "text" },
            "labels_en": { "type": "text" },
            "emb_codes": { "type": "text" },
            "emb_codes_tags": { "type": "text" },
            "first_packaging_code_geo": { "type": "text" },
            "cities": { "type": "text" },
            "cities_tags": { "type": "text" },
            "purchase_places": { "type": "text" },
            "stores": { "type": "text" },
            "countries": { "type": "text" },
            "countries_tags": { "type": "text" },
            "countries_en": { "type": "text" },
            "ingredients_text": { "type": "text" },
            "ingredients_tags": { "type": "text" },
            "ingredients_analysis_tags": { "type": "text" },
            "allergens": { "type": "text" },
            "allergens_en": { "type": "text" },
            "traces": { "type": "text" },
            "traces_tags": { "type": "text" },
            "traces_en": { "type": "text" },
            "serving_size": { "type": "text" },
            "serving_quantity": { "type": "integer" },
            "no_nutrition_data": { "type": "boolean" },
            "additives_n": { "type": "integer" },
            "additives": { "type": "text" },
            "additives_tags": { "type": "text" },
            "additives_en": { "type": "text" },
            "nutriscore_score": { "type": "integer" },
            "nutriscore_grade": { "type": "keyword" },
            "nova_group": { "type": "integer" },
            "pnns_groups_1": { "type": "text" },
            "pnns_groups_2": { "type": "text" },
            "food_groups": { "type": "text" },
            "food_groups_tags": { "type": "text" },
            "food_groups_en": { "type": "text" },
            "states": { "type": "text" },
            "states_tags": { "type": "text" },
            "states_en": { "type": "text" },
            "brand_owner": { "type": "text" },
            "ecoscore_score": { "type": "float" },
            "ecoscore_grade": { "type": "keyword" },
            "nutrient_levels_tags": { "type": "text" },
            "product_quantity": { "type": "text" },
            "owner": { "type": "text" },
            "data_quality_errors_tags": { "type": "text" },
            "unique_scans_n": { "type": "integer" },
            "popularity_tags": { "type": "text" },
            "completeness": { "type": "float" },
            "last_image_t": { "type": "long" },
            "last_image_datetime": { "type": "date" },
            "main_category": { "type": "text" },
            "main_category_en": { "type": "text" },
            "image_url": { "type": "text" },
            "image_small_url": { "type": "text" },
            "image_ingredients_url": { "type": "text" },
            "image_ingredients_small_url": { "type": "text" },
            "image_nutrition_url": { "type": "text" },
            "image_nutrition_small_url": { "type": "text" },
            "energy-kcal_100g": { "type": "float" },
            "fat_100g": { "type": "float" },
            "saturated-fat_100g": { "type": "float" },
            "butyric-acid_100g": { "type": "float" },
            "caproic-acid_100g": { "type": "float" },
            "caprylic-acid_100g": { "type": "float" },
            "capric-acid_100g": { "type": "float" },
            "lauric-acid_100g": { "type": "float" },
            "myristic-acid_100g": { "type": "float" },
            "palmitic-acid_100g": { "type": "float" },
            "stearic-acid_100g": { "type": "float" },
            "monounsaturated-fat_100g": { "type": "float" },
            "polyunsaturated-fat_100g": { "type": "float" },
            "alpha-linolenic-acid_100g": { "type": "float" },
            "eicosapentaenoic-acid_100g": { "type": "float" },
            "docosahexaenoic-acid_100g": { "type": "float" },
            "linoleic-acid_100g": { "type": "float" },
            "arachidonic-acid_100g": { "type": "float" },
            "oleic-acid_100g": { "type": "float" },
            "erucic-acid_100g": { "type": "float" },
            "cholesterol_100g": { "type": "float" },
            "carbohydrates_100g": { "type": "float" },
            "sugars_100g": { "type": "float" },
            "fiber_100g": { "type": "float" },
            "proteins_100g": { "type": "float" },
            "sodium_100g": { "type": "float" },
            "alcohol_100g": { "type": "float" },
            "beta-carotene_100g": { "type": "float" },
            "vitamin-d_100g": { "type": "float" },
            "vitamin-c_100g": { "type": "float" },
            "vitamin-b6_100g": { "type": "float" },
            "folates_100g": { "type": "float" },
            "vitamin-b12_100g": { "type": "float" },
            "potassium_100g": { "type": "float" },
            "calcium_100g": { "type": "float" },
            "phosphorus_100g": { "type": "float" },
            "iron_100g": { "type": "float" },
            "magnesium_100g": { "type": "float" },
            "zinc_100g": { "type": "float" },
            "copper_100g": { "type": "float" },
            "selenium_100g": { "type": "float" },
            "caffeine_100g": { "type": "float" },
            "ph_100g": { "type": "float" },
            "fruits-vegetables-nuts_100g": { "type": "float" },
            "fruits-vegetables-nuts-dried_100g": { "type": "float" },
            "fruits-vegetables-nuts-estimate_100g": { "type": "float" },
            "fruits-vegetables-nuts-estimate-from-ingredients_100g": { "type": "float" },
            "collagen-meat-protein-ratio_100g": { "type": "float" },
            "chlorophyl_100g": { "type": "float" },
            "carbon-footprint_100g": { "type": "float" },
            "carbon-footprint-from-meat-or-fish_100g": { "type": "float" },
            "nutrition-score-fr_100g": { "type": "float" },
            "nutrition-score-uk_100g": { "type": "float" },
            "choline_100g": { "type": "float" },
            "phylloquinone_100g": { "type": "float" },
            # Add other fields if necessary
        }
    }
}

# Step 3: Create the index with the mapping
if not es.indices.exists(index='products'):
    es.indices.create(index='products', body=mapping)
    print("Index created successfully.")

# Load CSV file
csv_file_path = "yourfile.csv"  # Replace with your CSV file path
df = pd.read_csv(csv_file_path)

# Function to generate actions for bulk indexing
def generate_actions(df):
    for _, row in df.iterrows():
        yield {
            "_index": "products",
            "_source": {
                "code": row.get('code', None),
                "url": row.get('url', None),
                "creator": row.get('creator', None),
                "created_t": row.get('created_t', None),
                "created_datetime": row.get('created_datetime', None),
                "last_modified_t": row.get('last_modified_t', None),
                "last_modified_datetime": row.get('last_modified_datetime', None),
                "last_modified_by": row.get('last_modified_by', None),
                "last_updated_t": row.get('last_updated_t', None),
                "last_updated_datetime": row.get('last_updated_datetime', None),
                "product_name": row.get('product_name', None),
                "abbreviated_product_name": row.get('abbreviated_product_name', None),
                "generic_name": row.get('generic_name', None),
                "quantity": row.get('quantity', None),
                "packaging": row.get('packaging', None),
                "packaging_tags": row.get('packaging_tags', None),
                "packaging_en": row.get('packaging_en', None),
                "packaging_text": row.get('packaging_text', None),
                "brands": row.get('brands', None),
                "brands_tags": row.get('brands_tags', None),
                "categories_tags": row.get('categories_tags', None),
                "categories_en": row.get('categories_en', None),
                "categories": row.get('categories', None),
                "origins": row.get('origins', None),
                "origins_tags": row.get('origins_tags', None),
                "origins_en": row.get('origins_en', None),
                "manufacturing_places": row.get('manufacturing_places', None),
                "manufacturing_places_tags": row.get('manufacturing_places_tags', None),
                "labels": row.get('labels', None),
                "labels_tags": row.get('labels_tags', None),
                "labels_en": row.get('labels_en', None),
                "emb_codes": row.get('emb_codes', None),
                "emb_codes_tags": row.get('emb_codes_tags', None),
                "first_packaging_code_geo": row.get('first_packaging_code_geo', None),
                "cities": row.get('cities', None),
                "cities_tags": row.get('cities_tags', None),
                "purchase_places": row.get('purchase_places', None),
                "stores": row.get('stores', None),
                "countries": row.get('countries', None),
                "countries_tags": row.get('countries_tags', None),
                "countries_en": row.get('countries_en', None),
                "ingredients_text": row.get('ingredients_text', None),
                "ingredients_tags": row.get('ingredients_tags', None),
                "ingredients_analysis_tags": row.get('ingredients_analysis_tags', None),
                "allergens": row.get('allergens', None),
                "allergens_en": row.get('allergens_en', None),
                "traces": row.get('traces', None),
                "traces_tags": row.get('traces_tags', None),
                "traces_en": row.get('traces_en', None),
                "serving_size": row.get('serving_size', None),
                "serving_quantity": row.get('serving_quantity', None),
                "no_nutrition_data": row.get('no_nutrition_data', None),
                "additives_n": row.get('additives_n', None),
                "additives": row.get('additives', None),
                "additives_tags": row.get('additives_tags', None),
                "additives_en": row.get('additives_en', None),
                "nutriscore_score": row.get('nutriscore_score', None),
                "nutriscore_grade": row.get('nutriscore_grade', None),
                "nova_group": row.get('nova_group', None),
                "pnns_groups_1": row.get('pnns_groups_1', None),
                "pnns_groups_2": row.get('pnns_groups_2', None),
                "food_groups": row.get('food_groups', None),
                "food_groups_tags": row.get('food_groups_tags', None),
                "food_groups_en": row.get('food_groups_en', None),
                "states": row.get('states', None),
                "states_tags": row.get('states_tags', None),
                "states_en": row.get('states_en', None),
                "brand_owner": row.get('brand_owner', None),
                "ecoscore_score": row.get('ecoscore_score', None),
                "ecoscore_grade": row.get('ecoscore_grade', None),
                "nutrient_levels_tags": row.get('nutrient_levels_tags', None),
                "product_quantity": row.get('product_quantity', None),
                "owner": row.get('owner', None),
                "data_quality_errors_tags": row.get('data_quality_errors_tags', None),
                "unique_scans_n": row.get('unique_scans_n', None),
                "popularity_tags": row.get('popularity_tags', None),
                "completeness": row.get('completeness', None),
                "last_image_t": row.get('last_image_t', None),
                "last_image_datetime": row.get('last_image_datetime', None),
                "main_category": row.get('main_category', None),
                "main_category_en": row.get('main_category_en', None),
                "image_url": row.get('image_url', None),
                "image_small_url": row.get('image_small_url', None),
                "image_ingredients_url": row.get('image_ingredients_url', None),
                "image_ingredients_small_url": row.get('image_ingredients_small_url', None),
                "image_nutrition_url": row.get('image_nutrition_url', None),
                "image_nutrition_small_url": row.get('image_nutrition_small_url', None),
                "energy-kcal_100g": row.get('energy-kcal_100g', None),
                "fat_100g": row.get('fat_100g', None),
                "saturated-fat_100g": row.get('saturated-fat_100g', None),
                "butyric-acid_100g": row.get('butyric-acid_100g', None),
                "caproic-acid_100g": row.get('caproic-acid_100g', None),
                "caprylic-acid_100g": row.get('caprylic-acid_100g', None),
                "capric-acid_100g": row.get('capric-acid_100g', None),
                "lauric-acid_100g": row.get('lauric-acid_100g', None),
                "myristic-acid_100g": row.get('myristic-acid_100g', None),
                "palmitic-acid_100g": row.get('palmitic-acid_100g', None),
                "stearic-acid_100g": row.get('stearic-acid_100g', None),
                "monounsaturated-fat_100g": row.get('monounsaturated-fat_100g', None),
                "polyunsaturated-fat_100g": row.get('polyunsaturated-fat_100g', None),
                "alpha-linolenic-acid_100g": row.get('alpha-linolenic-acid_100g', None),
                "eicosapentaenoic-acid_100g": row.get('eicosapentaenoic-acid_100g', None),
                "docosahexaenoic-acid_100g": row.get('docosahexaenoic-acid_100g', None),
                "linoleic-acid_100g": row.get('linoleic-acid_100g', None),
                "arachidonic-acid_100g": row.get('arachidonic-acid_100g', None),
                "oleic-acid_100g": row.get('oleic-acid_100g', None),
                "erucic-acid_100g": row.get('erucic-acid_100g', None),
                "cholesterol_100g": row.get('cholesterol_100g', None),
                "carbohydrates_100g": row.get('carbohydrates_100g', None),
                "sugars_100g": row.get('sugars_100g', None),
                "fiber_100g": row.get('fiber_100g', None),
                "proteins_100g": row.get('proteins_100g', None),
                "sodium_100g": row.get('sodium_100g', None),
                "alcohol_100g": row.get('alcohol_100g', None),
                "beta-carotene_100g": row.get('beta-carotene_100g', None),
                "vitamin-d_100g": row.get('vitamin-d_100g', None),
                "vitamin-c_100g": row.get('vitamin-c_100g', None),
                "vitamin-b6_100g": row.get('vitamin-b6_100g', None),
                "folates_100g": row.get('folates_100g', None),
                "vitamin-b12_100g": row.get('vitamin-b12_100g', None),
                "potassium_100g": row.get('potassium_100g', None),
                "calcium_100g": row.get('calcium_100g', None),
                "phosphorus_100g": row.get('phosphorus_100g', None),
                "iron_100g": row.get('iron_100g', None),
                "magnesium_100g": row.get('magnesium_100g', None),
                "zinc_100g": row.get('zinc_100g', None),
                "copper_100g": row.get('copper_100g', None),
                "selenium_100g": row.get('selenium_100g', None),
                "caffeine_100g": row.get('caffeine_100g', None),
                "ph_100g": row.get('ph_100g', None),
                "fruits-vegetables-nuts_100g": row.get('fruits-vegetables-nuts_100g', None),
                "fruits-vegetables-nuts-dried_100g": row.get('fruits-vegetables-nuts-dried_100g', None),
                "fruits-vegetables-nuts-estimate_100g": row.get('fruits-vegetables-nuts-estimate_100g', None),
                "fruits-vegetables-nuts-estimate-from-ingredients_100g": row.get('fruits-vegetables-nuts-estimate-from-ingredients_100g', None),
                "collagen-meat-protein-ratio_100g": row.get('collagen-meat-protein-ratio_100g', None),
                "chlorophyl_100g": row.get('chlorophyl_100g', None),
                "carbon-footprint_100g": row.get('carbon-footprint_100g', None),
                "carbon-footprint-from-meat-or-fish_100g": row.get('carbon-footprint-from-meat-or-fish_100g', None),
                "nutrition-score-fr_100g": row.get('nutrition-score-fr_100g', None),
                "nutrition-score-uk_100g": row.get('nutrition-score-uk_100g', None),
                "choline_100g": row.get('choline_100g', None),
                "phylloquinone_100g": row.get('phylloquinone_100g', None),
            }
        }

# Step 4: Bulk index the data
helpers.bulk(es, generate_actions(df))
print("Data indexed successfully.")
