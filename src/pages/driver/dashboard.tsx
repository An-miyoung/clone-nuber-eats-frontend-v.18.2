import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";

interface ICoords {
  lat: number;
  lng: number;
}

const defaultProps = {
  center: {
    lat: 37.505887,
    lng: 127.099999,
  },
  zoom: 14,
};

const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<GoogleMapReact>();

  // navigator.geolocation.watchPosition 을 통해 알아낸 현재 위치
  const onSuccess = (position: GeolocationPosition) => {
    setDriverCoords({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  // 맵이 최초 로드되고 나의 현재 위치를 찾았을때 최초 한번만 맵을 현재위치로 이동시켜준다.
  // 그 값을 보관해서 다시 그린다.
  const handleApiLoaded = (map: any, maps: any) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  useEffect(() => {
    // 브라우저가 제공하는 기본기능. 사용자의 현재위치를 찾아낸다.
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    //  매번 화면을 refresh 하지 않아도 driverCoords 가 변하면 map 도 같은 좌표를 같도록
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);

  return (
    <div>
      <div
        className="bg-lime-500 overflow-hidden"
        style={{ height: "50vh", width: window.innerWidth }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyDD5YnbgZtuGyXoBiBhybuImTTCa2bIOqs",
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          // driverCoords 즉, 현재 위치로 지도가 이동하도록 해준다.
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
        >
          <div className="text-2xl">🚖</div>
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default Dashboard;
