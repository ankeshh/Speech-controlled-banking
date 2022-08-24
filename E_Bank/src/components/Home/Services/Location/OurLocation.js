import React from "react";
// import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import { ComponentWrapper } from "../../HomeElements";
import './OurLocationElements.js';
import { MapContainer} from "./OurLocationElements.js";
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import SideMenu from "../../modules/SideMenu";

// class OurLocation extends React.Component {
//     render() {
//       const coords = {lat: 12.921470, lng: 79.131561}
//       return (
//         <>
//           <ComponentWrapper>
//             <SideMenu/>
//             <MapContainer>
//               <Map style={{left: 0, right: 0, height: 'auto', position: 'absolute',}} 
//                    google={this.props.google} 
//                    zoom={14} 
//                    initialCenter={coords}>
//                 <Marker
//                   title={'Click and find your way to us!!'}
//                   name={'Vellore Institute of Technology, Vellore'}
//                   position={coords} />
//               </Map>
//             </MapContainer>
//           </ComponentWrapper>
//         </>
//       );
//     }
//   }
   
//   export default GoogleApiWrapper({
//     apiKey: ("AIzaSyC-9NvPpKKP7xPQZ57XpALl76KsJ12qMCQ")
//   })(OurLocation)

const containerStyle = {
  width: '2 rem',
  height: '800px'
};

const center = {
  lat: 12.921470, lng: 79.131561
};

class OurLocation extends React.Component {
  render() {
    return (
      <ComponentWrapper>
      <SideMenu/>
      <MapContainer>
      <LoadScript googleMapsApiKey="AIzaSyC-9NvPpKKP7xPQZ57XpALl76KsJ12qMCQ">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          { /* Child components, such as markers, info windows, etc. */ }
          <Marker
                  title={'Click and find your way to us!!'}
                  name={'Vellore Institute of Technology, Vellore'}
                  position={center} />
          <></>
        </GoogleMap>
        </LoadScript>
      </MapContainer>
        
     
      </ComponentWrapper>
      
    )
  }
}

export default OurLocation;