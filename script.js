const axios = require('axios');
const uploadImage = require('./src/utils/cloudinary/uploadImage');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');
require('dotenv').config({ path: `${__dirname}/src/config/.env` });
require('./src/config/database');

const Incident = require('./src/models/incident.model');

exports.getCotripIncidentsData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const apiKey = process.env.COTRIP_API_KEY;
      const requestResponse = await axios.get(
        `https://data.cotrip.org/api/v1/incidents?apiKey=${apiKey}`
      );
      console.log('requestResponse', requestResponse.data);
      resolve(requestResponse.data);
    } catch (error) {
      reject(error);
    }
  });
};

exports.getStaticMapImage = (latitude, longitude) => {
  return new Promise(async (resolve, reject) => {
    try {
      const key = process.env.STATIC_MAP_API_KEY;
      const requestResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/staticmap?size=600x600&markers=color:red|${latitude},${longitude}&zoom=13&key=${key}`,
        {
          responseType: 'arraybuffer',
        }
      );
      console.log('requestResponse', requestResponse.data);
      fs.writeFile(
        `./uploads/${latitude}_${longitude}.jpg`,
        requestResponse.data,
        async function (err) {
          if (err) reject(error);
          else {
            console.log('The file was saved!');
            const uploadedImage = await uploadImage(
              `./uploads/${latitude}_${longitude}.jpg`
            );
            let result = uploadedImage ? uploadedImage.url : '';
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
      console.log('requestResponse', requestResponse.data);
      resolve(requestResponse.data);
    } catch (error) {
      reject(error);
    }
  });
};

const generatePostText = (incident) => {
  const properties = incident.properties;
  let text = '';
  text += `Incident: ${properties.type} on ${properties.routeName} \n`;
  text += `Updated: ${properties.lastUpdated} \n`;
  text += `Description: ${properties.travelerInformationMessage} \n`;
  return text;
};

const main = async () => {
  const incidents = await this.getCotripIncidentsData();
  for (let incident of incidents.features) {
    const isIncidentExists = await Incident.exists({
      'properties.id': incident.properties.id,
    });
    if (isIncidentExists) {
      console.log('Incident already fetched!');
    } else {
      if (incident.geometry.type === 'MultiPoint') {
        let coordinates = incident.geometry.coordinates[0];
        console.log('coordinates', coordinates[1], coordinates[0]);
        let imageUrl = await this.getStaticMapImage(
          coordinates[1],
          coordinates[0]
        );
        console.log('imageUrl', imageUrl);
        const postText = generatePostText(incident);
        await this.createFacebookPagePost(postText, imageUrl);
      } else if (incident.geometry.type === 'Point') {
        let coordinates = incident.geometry.coordinates;
        console.log('coordinates', coordinates[1], coordinates[0]);
        let imageUrl = await this.getStaticMapImage(
          coordinates[1],
          coordinates[0]
        );
        console.log('imageUrl', imageUrl);
        let text = generatePostText(incident);
        await this.createFacebookPagePost(text, imageUrl);
      }
      await new Incident(incident).save();
    }
  }
};

var CronJob = require('cron').CronJob;
var job = new CronJob(
  '0 */2 * * * *',
  function () {
    console.log('You will see this message every 2 minutes');
    main();
  },
  null,
  false,
  'America/Los_Angeles'
);
job.start();
