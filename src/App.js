import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select} from '@material-ui/core';
import InfoBox from './InfoBox'
import './App.css';

function App()  {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        setCountries(countries);
      })
    }
    getCountriesData();
    
  }, [])
    const onCountryChange = async (event) => {
      const countryCode = event.target.value;

      console.log("Country Code: ",countryCode);
      setCountry(countryCode);
    }
    return (
      <div className="App">
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange} >
          <MenuItem value="worldwide">Worldwide</MenuItem >
            {
              countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem >))
            }
          </Select>
        </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirys Cases" cases={1234} total={2000}/>
          <InfoBox title="Recoverd" cases={675} total={3000}/>
          <InfoBox title="Deaths" cases={984} total={4000}/>
          {/* infoboxes title="Coronavirus cases" */}
          {/* infoboxes title="Coronavius recoveries"*/}
          {/* infoboxes */}
        </div>
        {/* Table */}
        {/* Graph */}
      </div>
    );
  }


export default App;