"use server";

import { CountryCovidData, GlobalCovidData } from "../../types";

export async function fetchAllCountriesCovidData(): Promise<
  CountryCovidData[]
> {
  const response = await fetch("https://disease.sh/v3/covid-19/countries");

  if (!response.ok) {
    throw new Error(`Failed to fetch COVID-19 data: ${response.statusText}`);
  }

  const data: CountryCovidData[] = await response.json();
  return data;
}

export async function fetchGlobalCovidData(): Promise<GlobalCovidData> {
  const response = await fetch("https://disease.sh/v3/covid-19/all");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch global COVID-19 data: ${response.statusText}`
    );
  }

  const data: GlobalCovidData = await response.json();
  return data;
}

export async function fetchCountryData(
  countryCode: string
): Promise<CountryCovidData | GlobalCovidData> {
  const url =
    countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch data for ${countryCode}: ${response.statusText}`
    );
  }

  const data = await response.json();

  if (countryCode === "worldwide") {
    return data as GlobalCovidData;
  } else {
    return data as CountryCovidData;
  }
}
