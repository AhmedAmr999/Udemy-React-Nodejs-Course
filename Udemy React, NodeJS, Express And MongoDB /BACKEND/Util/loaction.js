const API_KEY = "";
const axios = require("axios");
const HttpError = require("../models/http-error");

function getCoordsForAdd(address) {
  return {
    lat: 40.7484405,
    lng: -73.9878531, //dummy dataa
  };
}

//law api
//async function getCoordsForAdd(address){
// const response=await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
// const data=response.data
// if(!data|| data.status==="ZERO_RESULTS"){
//     const error=new HttpError("Coulf not find specific adddress",422)
//     throw error
// }
// const coordinates=data.results[0].geometry.location
//return coordinates
//}

module.exports = getCoordsForAdd;
