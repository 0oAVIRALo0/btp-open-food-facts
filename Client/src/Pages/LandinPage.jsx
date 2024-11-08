import React from "react";
import { Container } from "@mui/material";

import LandingBanner from "/svg/Banner.svg";
import NOVA1 from "/svg/NOVA1.svg"
import NOVA2 from "/svg/NOVA2.svg"
import NOVA3 from "/svg/NOVA3.svg"
import NOVA4 from "/svg/NOVA4.svg"

function LandinPage() {

  const novaClasses = [
    { id: 1, image: NOVA1, heading: "Unprocessed or minimally processed foods", examples: "Examples: fresh, frozen or dried fruit, vegetables, legumes, nuts, seeds, whole grains, eggs, fresh or frozen meat, fish, shellfish, poultry, milk, yogurt, cheese, oil, vinegar, sugar, salt, herbs, spices, coffee beans, tea leaves." },
    { id: 2, image: NOVA2, heading: "Processed culinary ingredients", examples: "Examples: flour, butter, oil, sugar, honey, maple syrup, salt, pepper, herbs, spices, baking powder, baking soda, chocolate, pasta, rice, bread, tofu, tempeh, miso, canned tomatoes, tomato paste, canned coconut milk, canned beans, unsweetened plant-based milk." },
    { id: 3, image: NOVA3, heading: "Processed foods", examples: "Examples: bread, crackers, cheese, yogurt, canned beans, canned fish, canned tomatoes, frozen fruits, frozen vegetables, tofu, tempeh, miso, hummus, nut butter, seed butter, fruit preserves, pickles, sauerkraut, pasta sauce, salad dressing, mayonnaise, ketchup, mustard, hot sauce, salsa, tortillas, pasta," },
    { id: 4, image: NOVA4, heading: "Ultra-processed food and drink products", examples: "Examples: packaged snacks, sugary cereals, sweetened yogurt, candy, soda, sports drinks, energy drinks, sweetened iced tea, sweetened lemonade, sweetened iced coffee, sweetened juice drinks, frozen meals, fast food, instant noodles, instant soup, instant mac and cheese" },
  ]
  return (
    <Container maxWidth="lg">
      <div className="content">
      <div className="banner" style={{backgroundImage: `url(${LandingBanner})`}}>
        <div className="overlay-text">
          <h2>What&apos;s My Food ?</h2>
          <p>Your guide to NOVA food classification and the eco-score. Search for any food to learn more.</p>
        </div>
      </div>
      <div className="processing_info">
        <h2 className="heading">Food Processing and Health</h2>
        <p>
          While unprocessed or minimally processed foods are essential for good health, 
          the regular consumption of processed and ultra-processed foods has been linked to negative health effects. 
          These include obesity, type 2 diabetes, cardiovascular disease, high blood pressure, and certain types of cancer. 
          This is due to the high content of unhealthy fats, sugars, and salt in these products. 
          In addition, ultra-processed foods often contain additives and preservatives that are not present in unprocessed or minimally processed foods. 
          As a result, the NOVA classification system can help consumers make healthier food choices by encouraging them to focus on whole, fresh foods and limit their intake of processed and ultra-processed products.
        </p>
        <h2>NOVA Classes</h2>
        <div className="nova_classes">
          {novaClasses.map((novaClass) => (
          <div className="nova" key={novaClass.id}>
            <img
              width={"99%"}
              height={"auto"}
              src={novaClass.image}
              alt={`Cover for ${novaClass.heading}`}
            />
            <h3>{novaClass.heading}</h3>
            <p>{novaClass.examples}</p>
          </div>
        ))}
        </div>
      </div>
      </div>
        
    </Container>
  );
}

export default LandinPage;
