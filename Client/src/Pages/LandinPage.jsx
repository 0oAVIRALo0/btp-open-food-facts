import React from "react";
import { Container } from "@mui/material";
import Nutrient_Panel from "/img/Nutrient_Panel.png";

function LandinPage() {

  return (
    <Container maxWidth="lg">
      <div className="content">
        <div className="summary">
          <h2>Prediction of Food Processing Level</h2>
          <p>
            The consumption of ultra-processed food has dramatically risen in
            recent times. UPF consumption has been associated with numerous
            adverse health effects, including obesity, cardiovascular
            diseases, and metabolic disorders. Given the public health
            consequences linked to ultra-processed food consumption, it is
            highly relevant to build computational models to predict the
            processing of food products. We built a range of machine learning
            and deep learning models to predict the extent of food processing
            by integrating the FNDDS dataset of food products and their
            nutrient profiles with their reported NOVA processing level. We
            started with the full nutritional panel of 102 features to further
            implement coarse-graining of features to 65 and 13 nutrients by
            dropping flavonoids and then by considering the 13-nutrient panel
            of FDA, respectively. Our state-of-the-art machine learning models
            show superior performance when compared with a previously
            published study. We also implemented an NLP-based model, which
            exhibited the best results. We distilled nutrients critical for
            model performance using the SHAP analysis. We present a
            user-friendly web server to return the predicted processing level
            based on the nutrient panel of a food product:
            https://cosylab.iiitd.edu.in/food-processing/
          </p>
        </div>
        <div className="rec">
          <img
            width={"100%"}
            height={"auto"}
            src={Nutrient_Panel}
            alt="Cover "
          />
        </div>
      </div>
    </Container>
  );
}

export default LandinPage;
