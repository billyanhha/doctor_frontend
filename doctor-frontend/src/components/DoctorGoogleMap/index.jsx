import React, { Component, useState, useEffect } from "react";
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} = require("react-google-maps");


const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const google = window.google;
      const directionsService = new google.maps.DirectionsService();

      const origin = this.props.patientAddress;
      const destination = this.props.doctorAddress;

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.props.getDirectionInfo(result?.routes?.[0]?.legs?.[0].distance.text, result?.routes?.[0]?.legs?.[0].duration.text)
            this.setState({
              directions: result
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );

    }
  })
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={new window.google.maps.LatLng(21.0277644, 105.8341598)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>

);


const MapWith = (props) => {

  const [patientAddress, setPatientAddress] = useState({});
  const [doctorAddress, setDoctorAddress] = useState({});
  const [direction, setDirection] = useState({ distance: "", time: "" });
  const [ready, setReady] = useState(false);

  const size = (obj) => {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

  useEffect(() => {
    console.log(props);
    let { lat, lng } = props.doctorAddress;
    setPatientAddress(props.patientAddress);
    setDoctorAddress({ lat, lng });

  }, []);

  useEffect(()=>{
    if(size(patientAddress)>0 && size(doctorAddress)>0)
      setReady(true);
  },[patientAddress,doctorAddress]);

  const getDirectionInfo = (distance, time) => {
    setDirection({ distance, time });
  }

  const formatTime = (value) =>{
    return  value.match(/\d+/)[0];
  }

  return (
    <div>

      <div className="direction-distance-div">Khoảng cách đến vị trí khám bệnh: <p>{direction.distance}</p></div>
      {/* <div className="direction-time-div">Thời gian đi bằng xe máy: {direction.time} </div> */}
      {ready && <MapWithADirectionsRenderer patientAddress={patientAddress} doctorAddress={doctorAddress} getDirectionInfo={getDirectionInfo} />}

    </div>
  );

}



export default MapWith;