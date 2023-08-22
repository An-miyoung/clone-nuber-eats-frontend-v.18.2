import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { useMutation, useSubscription } from "@apollo/client";
import { gql } from "../../__generated__/gql";
import {
  CookedOrdersSubscription,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../__generated__/graphql";

const COOKED_ORDERS_SUBSCRIPTION = gql(/* GraphQL */ `
  subscription cookedOrders {
    cookedOrders {
      id
      customer {
        email
      }
      driver {
        email
      }
      restaurant {
        name
      }
      totalPrice
      status
    }
  }
`);

const TAKE_ORDER_MUTATION = gql(/* GraphQL */ `
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`);

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
  const navigate = useNavigate();
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<GoogleMapReact>();

  const { data: cookedOrdersData } = useSubscription<CookedOrdersSubscription>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok && cookedOrdersData?.cookedOrders.id) {
      navigate(`/orders/${cookedOrdersData.cookedOrders.id}`);
    }
  };
  const [takeOrderMutation] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerMutation = () => {
    takeOrderMutation({
      variables: {
        input: {
          id: +cookedOrdersData?.cookedOrders.id!,
        },
      },
    });
  };

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

  const makeRoute = useCallback(() => {
    if (!map) return;
    const directionService = new google.maps.DirectionsService();
    const directionRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: "#000",
        strokeOpacity: 0.7,
        strokeWeight: 3,
      },
    });
    directionRenderer.setMap(map);
    directionService.route(
      {
        origin: {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        destination: {
          location: new google.maps.LatLng(
            driverCoords.lat + 0.05,
            driverCoords.lng + 0.05
          ),
        },
        travelMode: google.maps.TravelMode.TRANSIT,
      },
      (result) => {
        directionRenderer.setDirections(result);
      }
    );
  }, [driverCoords.lat, driverCoords.lng, map]);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrdersData, makeRoute]);

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
      // driver 의 lat, lng 를 받으면 실제 주소로 변환해주는 method를 부른다
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (result, status) => {
          // console.log(status, result);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng, map, maps]);

  return (
    <div>
      <Helmet>
        <title> 배달기사님 대쉬보드 | Nuber Eats</title>
      </Helmet>
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
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className=" text-center text-2xl font-medium">
              새로운 배달요청
            </h1>
            <h4 className=" text-center text-xl font-medium mt-2">
              빨리 수락하세요 @ {cookedOrdersData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={triggerMutation}
              className="btn w-full bg-lime-600 mt-4 text-xl font-medium"
            >
              수락 &rarr;
            </button>
          </>
        ) : (
          <h1 className=" text-center text-2xl font-medium">
            새로운 배달요청이 없습니다.
          </h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
