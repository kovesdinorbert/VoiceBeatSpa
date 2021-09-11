
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const styles = require('./googlemapstyle.json')

const GoogMarker = ({}: any) => <div><img alt="" src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png" draggable="false" /></div>;

const GMap = (props: any) => {
    const [center, setCenter] = useState({lat: 47.550519, lng: 19.046133 });
    const [zoom, setZoom] = useState(14.2);
    return (
        <div style={{ height: '450px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCV9jnDSFNYrVPOdqVukVUU3WpALVBTTx8' }}
          defaultCenter={center}
          defaultZoom={zoom}
          options={{styles: styles}}
        >
          <GoogMarker
            lat={47.550519}
            lng={19.046133}
          />
        </GoogleMapReact>
      </div>
    );
}

export default GMap;