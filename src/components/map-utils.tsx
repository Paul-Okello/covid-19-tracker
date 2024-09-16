import numeral from "numeral";
import { CountryCovidData } from "../types";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import ReactMapboxGl, {
  Layer,
  Feature,
  Popup,
  Image,
  Marker,
} from "react-mapbox-gl";
import React from "react";

// Define color and size scaling for cases, recovered, and deaths
export const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

// Sort data based on the number of cases
export const sortData = (data: CountryCovidData[]) =>
  [...data].sort((a, b) => (a.cases > b.cases ? -1 : 1));

// Format statistics for display
export const prettyPrintStat = (stat: number) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// Function to render data on the map
export const showDataOnMap = (
  data: CountryCovidData[],
  casesType: "cases" | "recovered" | "deaths" = "cases"
) => {
  // Use an array to store Layer elements
  const layers: React.ReactNode[] = [];

  return data.forEach(
    (country) => {
      // Calculate radius based on the number of cases, recovered, or deaths
      const radius =
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier;
      const { lat, long, flag } = country.countryInfo;

      // Ensure valid coordinates are available before rendering the feature
      if (!lat || !long) return;

      // Define the MarkerIcon to show country details in the Popup
      return (
        <Marker
          longitude={long}
          latitude={lat}
          offsetLeft={-20}
          offsetTop={-10}
        >
          <Image id="flag" url={flag} />
          <Label>{country.country}</Label>
          <Badge variant="outline" className="text-yellow-400">
            Cases: {numeral(country.cases).format("0,0")}
          </Badge>
          <Badge variant="outline" className="text-emerald-400">
            Recovered: {numeral(country.recovered).format("0,0")}
          </Badge>
          <Badge variant="outline" className="text-red-400">
            Deaths: {numeral(country.deaths).format("0,0")} // Assuming you have
            `deaths` defined
          </Badge>
        </Marker>
      );
    }

    //   // Create and push the Layer element to the array
    //   layers.push(
    //     <Layer
    //       key={country.country}
    //       type="circle"
    //       paint={{
    //         "circle-color": casesTypeColors[casesType].hex,
    //         "circle-radius": radius / 500, // Adjust circle size
    //         "circle-opacity": 0.4,
    //       }}
    //     >
    //       <Feature coordinates={[long, lat]} />
    //       {MarkerIcon()}
    //       <Popup anchor="bottom" coordinates={[long, lat]} />
    //     </Layer>
    //   );
    // });

    // // Return the array of Layer elements as a single React Fragment
    // return <React.Fragment>{
    //   MarkerIcon()
    //   }</React.Fragment>;
  );
};
