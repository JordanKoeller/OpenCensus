
import React, { useRef } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import VideoPlayer from './VideoPlayer';

export interface MarkerData {
  lat: number,
  lng: number,
  url: string
};

const videoJsOptions = {
  autoplay: true,
  controls: true,
  defaultVolume: 0.4
};

const VideoMapComponent: React.FC<{ markers?: MarkerData[] }> = ({ markers = [] }) => {
  const position = { lat: 39.826529, lng: -98.575286 };
  const zoom = 4;
  const markersProps = markers.map(mData => {
    return { pos: { lat: mData.lat, lng: mData.lng }, videoOpts: { ...videoJsOptions, sources: [{ src: mData.url, type: 'video/mp4' }] } };
  })
  return <Map id='mapId' style={{ width: 1060, height: 800 }}
    center={position}
    zoom={zoom}>
    <TileLayer
      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'>
    </TileLayer>
    {markersProps.map(markerProps => <Marker position={markerProps.pos}>
      <Popup maxWidth={320} maxHeight={310}>
        <VideoPlayer {...markerProps.videoOpts} />

      </Popup>
    </Marker>)}

  </Map>
};

export default VideoMapComponent;
