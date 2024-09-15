import React from "react";

import { Container } from "@mui/material";

function ContactUs() {
  return (
    <Container maxWidth="lg">
      <div className="contact_container">
        <div className="grey_card">
          <div className="row">
            <div className="col m5">
              <h2>Contact Us</h2>
              <p>
                Prof. Ganesh Bagler<br/>
                <a href="https://ccb.iiitd.ac.in/" className="my_link">
                  Center for Computational Biology
                </a>
                <br/>
                Indraprastha Institute of Information Technology Delhi (IIIT Delhi)<br/>
                R&D Block,<br/>
                Okhla Phase IIIT,Near Govindpuri Metro Station<br/>
                New Delhi,India 110020<br/>
                <b>Email: </b>
                <a href="mailto:bagler+FoodProcessing@iiitd.ac.in">
                bagler+FoodProcessing@iiitd.ac.in
                </a>
                <br/>
                <b>Tel:</b>
                +91-11-26907-443 (Work)
              </p>
            </div>
            <div className="col m7">
            <div className="mapouter"><div className="gmap_canvas"><iframe width="100%" height="100%" id="gmap_canvas" src="https://maps.google.com/maps?q=IIIT-Delhi R&D Building&t=&z=14&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div></div>              {/* <iframe
                style={{ minHeight: "500px", width: "100%" }}
                allowFullScreen=""
                src="https://www.google.com/maps/place/G7VC%2BHJH+IIIT-Delhi+R%26D+Building,+Delhi,+IIIT+Road,+Okhla+Phase+III,+New+Delhi,+Delhi+110020/@28.543938,77.2716197,17z/data=!4m6!3m5!1s0x390ce3e45d85d3e3:0x691393414902968e!8m2!3d28.543938!4d77.2716197!16s%2Fg%2F11gfjf4jts"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ContactUs;
