"use client";

import { Card, CardContent } from "./ui/card";
import React, { useEffect, useRef, useState } from "react";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import * as turf from "@turf/turf";
import { CountryCovidData } from "../types";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxgl from "mapbox-gl";

interface Props {
  caseType: "cases" | "recovered" | "deaths";
  center: { lat: number; lng: number };
  zoom: number;
  countries: CountryCovidData[];
}

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoicGF1bG9jaGllbmciLCJhIjoiY2t2NHF2YXFmMWQ0eDJ2b3ZzazQ3NGxpOSJ9.kdTuK0eRy2HN0UTne_vC2w";

const MapComponent = (props: Props) => {
  const { lat, lng } = props.center;
  const [roundedArea, setRoundedArea] = useState<number | undefined>();
  const mapRef = useRef<any>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  // Initialize Mapbox instance once
  const Map = ReactMapboxGl({
    accessToken: MAPBOX_ACCESS_TOKEN,
  });

  // Function to update the area of the drawn polygon
  const updateArea = (e: any) => {
    const data = drawRef.current?.getAll();
    if (data && data?.features.length > 0) {
      const area = turf.area(data);
      setRoundedArea(Math.round(area * 100) / 100);
    } else {
      setRoundedArea(undefined);
      if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });

      map.addControl(drawRef.current);

      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);
    }
  }, []);

  const POSITION_CIRCLE_PAINT = {
    "circle-stroke-width": 4,
    "circle-radius": 10,
    "circle-blur": 0.15,
    "circle-color": "#7dd71d",
  };

  const layerPaint = {
    "heatmap-weight": {
      property: "priceIndicator",
      type: "exponential",
      stops: [
        [0, 0],
        [5, 2],
      ],
    },
    "heatmap-intensity": {
      stops: [
        [0, 0],
        [5, 1.2],
      ],
    },
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.25,
      "rgb(103,169,207)",
      0.5,
      "rgb(209,229,240)",
      0.8,
      "rgb(253,219,199)",
      1,
      "rgb(239,138,98)",
      2,
      "rgb(178,24,43)",
    ],
    "heatmap-radius": {
      stops: [
        [0, 1],
        [5, 50],
      ],
    },
  };

  return (
    <Card>
      <CardContent className="h-[500px] p-2">
        <Map
          style="mapbox://styles/paulochieng/ckv4r1td50bpv14odseeq92mo"
          center={[lng, lat]}
          zoom={[props.zoom]}
          containerStyle={{
            height: "490px",
            borderRadius: "20px",
            padding: "8px",
          }}
          animationOptions={{
            animate: true,
            duration: 300,
          }}
          onStyleLoad={(map: any) => {
            mapRef.current = map;
          }}
        >
          <Layer type="heatmap" paint={layerPaint}>
            {props.countries.map((cx, index) => (
              <Feature
                key={index}
                coordinates={[cx.countryInfo.long, cx.countryInfo.lat]}
              />
            ))}
          </Layer>
        </Map>
        <div
          className="calculation-box"
          style={{
            height: 75,
            width: 150,
            position: "absolute",
            bottom: 40,
            left: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: 15,
            textAlign: "center",
          }}
        >
          <p style={{ fontFamily: "Open Sans", margin: 0, fontSize: 13 }}>
            Click the map to draw a polygon.
          </p>
          <div id="calculated-area">
            {roundedArea && (
              <>
                <p style={{ fontFamily: "Open Sans", margin: 0, fontSize: 13 }}>
                  <strong>{roundedArea}</strong>
                </p>
                <p style={{ fontFamily: "Open Sans", margin: 0, fontSize: 13 }}>
                  square meters
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapComponent;
