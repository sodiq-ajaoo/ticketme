import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function EventMap({ event }) {
  if (!event?.location?.coordinates) return null;

  const [lng, lat] = event.location.coordinates;

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-3xl font-black">Event Location</h2>

      <div className="overflow-hidden rounded-3xl shadow-lg">
        <MapContainer
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          style={{
            height: '450px',
            width: '100%',
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={[lat, lng]}>
            <Popup>
              <strong>{event.name}</strong>
              <br />
              {event.venue}
              <br />
              {event.city}, {event.state}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default EventMap;
