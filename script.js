const axios = require("axios");
const uploadImage = require("./src/utils/cloudinary/uploadImage");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: `${__dirname}/src/config/.env` });
require("./src/config/database");
const LocalStorage = require("node-localstorage").LocalStorage;

const Incident = require("./src/models/incident.model");
const Event = require("./src/models/event.model");
const { findOneAndUpdate } = require("./src/models/event.model");
localStorage = new LocalStorage("./scratch");

exports.getCotripIncidentsData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const apiKey = process.env.COTRIP_API_KEY;
      const requestResponse = await axios.get(
        `https://data.cotrip.org/api/v1/incidents?apiKey=${apiKey}`
      );
      resolve(requestResponse.data);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getStaticMapImage = (latitude, longitude) => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = process.env.GOOGLE_MAPS_KEY;
      const requestResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/staticmap?size=600x600&markers=color:red|${latitude},${longitude}&zoom=13&key=${key}`,
        {
          responseType: "arraybuffer",
        }
      );
      console.log("requestResponse", requestResponse.data);
      fs.writeFile(
        `./uploads/${latitude}_${longitude}.jpg`,
        requestResponse.data,
        async function (err) {
          if (err) reject(error);
          else {
            console.log("The file was saved!");
            const uploadedImage = await uploadImage(
              `./uploads/${latitude}_${longitude}.jpg`
            );
            let result = uploadedImage ? uploadedImage.url : "";
            resolve(result);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

exports.createFacebookPagePost = (name, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const access_token = process.env.FACEBOOK_PAGE_API_KEY;
      const requestResponse = await axios.post(
        `https://graph.facebook.com/112071708065669/photos?url=${url}&name=${name}&access_token=${access_token}`
      );
      resolve(requestResponse.data);
    } catch (error) {
      reject(error);
    }
  });
};

const generatePostText = (incident) => {
  const properties = incident.properties;
  let text = "";
  text += `Incident: ${properties.type} on ${properties.routeName} \n`;
  text += `Updated: ${properties.lastUpdated} \n`;
  text += `Description: ${properties.travelerInformationMessage} \n`;
  return text;
};

const main = async () => {
  let locallyStoredIncidents = localStorage.getItem("incidents");
  let incidents = await this.getCotripIncidentsData();

  // Store the incidents in local storage
  localStorage.setItem("incidents", JSON.stringify(incidents.features));

  // Compare the incidents with the ones we just fetched.
  for (let incident of incidents.features) {
    const incidentExists = await Incident.exists({
      "properties.id": incident.properties.id,
    });

    if (!incidentExists) {
      await new Incident(incident).save();
    }

    for (localIncident of JSON.parse(locallyStoredIncidents)) {
      // If this localIncident is not within incidents.features, set to deleted
      let unavailable = !incidents.features.some((i) => {
        return i.properties.id === localIncident.properties.id;
      });

      if (unavailable) {
        const expiredIncident = await Incident.findOne({
          "properties.id": localIncident.properties.id,
        });

        await Event.findOneAndUpdate(
          { incident: expiredIncident._id },
          { isDeleted: true }
        );
      }
    }
  }
};

main();

var CronJob = require("cron").CronJob;
var job = new CronJob(
  "0 */2 * * * *",
  function () {
    console.log("You will see this message every 2 minutes");
    main();
  },
  null,
  false,
  "America/Los_Angeles"
);

module.exports = job;
