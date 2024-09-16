"use client";

import React, { useState, useEffect } from "react";
import { fetchCountryData } from "../../app/_actions/covidData";
import { CountryCovidData, GlobalCovidData } from "../../types";
import CountryFilter from "../country-filter";
import InfoBox from "../info-box";
import { prettyPrintStat } from "../map-utils";
import MapComponent from "../map";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CovidTable from "../covid-table";

function isCountryCovidData(
  data: GlobalCovidData | CountryCovidData
): data is CountryCovidData {
  return "count" in data; // Check if the 'count' property exists
}

type Props = {
  globalData: GlobalCovidData;
  countriesData: CountryCovidData[];
};

const HomeShell = ({ globalData, countriesData }: Props) => {
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState<
    GlobalCovidData | CountryCovidData
  >(globalData);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({ lat: 8.7832, lng: 34.5085 });
  const [casesType, setCasesType] = useState<"cases" | "recovered" | "deaths">(
    "cases"
  );

  const countries = countriesData.map((ps) => ({
    name: ps.country,
    value: ps.countryInfo.iso2,
  }));

  // Initialize countryInfo based on selected country
  useEffect(() => {
    const initializeCountryInfo = async () => {
      if (country !== "worldwide") {
        const countryData = countriesData.find(
          (cd) => cd.countryInfo.iso2 === country
        );
        if (countryData) {
          setCountryInfo(countryData);
          setMapCenter({
            lat: countryData.countryInfo.lat,
            lng: countryData.countryInfo.long,
          });
          setMapZoom(4);
        } else {
          const data = await fetchCountryData(country);
          setCountryInfo(data);
          if (isCountryCovidData(data)) {
            setMapCenter({
              lat: data.countryInfo.lat,
              lng: data.countryInfo.long,
            });
            setMapZoom(4);
          }
        }
      } else {
        setCountryInfo(globalData);
        setMapCenter({ lat: 8.7832, lng: 34.5085 });
        setMapZoom(3);
      }
    };

    initializeCountryInfo();
  }, [country, countriesData, globalData]);

  // Handle country selection and data fetching
  function onCountryChange(value: string) {
    setCountry(value);
  }

  return (
    <div className="grid grid-cols-1 gap-4 max-w-7xl mx-4 lg:mx-8 xl:mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex justify-between gap-3 lg:col-span-2">
          <InfoBox
            isRed
            active={casesType === "cases"}
            clickFxn={() => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(globalData.todayCases)}
            total={prettyPrintStat(globalData.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            clickFxn={() => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(globalData.todayRecovered)}
            total={prettyPrintStat(globalData.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            clickFxn={() => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(globalData.todayDeaths)}
            total={prettyPrintStat(globalData.deaths)}
          />
        </div>
        <CountryFilter
          countries={countries}
          onCountryChange={onCountryChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MapComponent
            caseType={casesType}
            countries={countriesData}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Live Cases By Country</CardTitle>
          </CardHeader>
          <CardContent>
            <CovidTable countries={countriesData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeShell;
