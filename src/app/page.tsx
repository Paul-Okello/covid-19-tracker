import React from "react";
import {
  fetchAllCountriesCovidData,
  fetchGlobalCovidData,
} from "./_actions/covidData";
import HomeShell from "../components/home/home";

type Props = {};

const IndexPage = async (props: Props) => {
  const globalCovidData = await fetchGlobalCovidData();
  const countriesData = await fetchAllCountriesCovidData();
  return (
    <div className="bg-stone-50 min-h-screen">
      <HomeShell globalData={globalCovidData} countriesData={countriesData} />
    </div>
  );
};

export default IndexPage;
