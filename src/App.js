import React , {useEffect, useState} from 'react';
import './App.css';
import {FormControl,MenuItem,Select,Card,CardContent,} from "@mui/material";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData,prettyPrintStat } from './util.js';
 import Linegraph from './Linegraph';
 import "leaflet/dist/leaflet.css";


// https://disease.sh/v3/covid-19/countries

function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState("Worldwide")
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat:34.80746 , lng:-40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType,setCasesType] = useState("cases");


  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })

  },[])

  useEffect(()=>{
    const getCountriesData = async()=>{
    
   await fetch("https://disease.sh/v3/covid-19/countries")
   .then((response)=>response.json())
   .then((data)=>{
    const countries = data.map((country)=>({
      name: country.country,
      value: country.countryInfo.iso2,
    }));
    let sortedData = sortData(data);
    setMapCountries(data);
    setTableData(data);
    setCountries(countries);
   })

    };
    getCountriesData();
  },[])

  

  const onChangeCountry = async (e) => {
    const changeCountryCode = e.target.value;
    

    const url = changeCountryCode ==="worldwide"
     ? "https://disease.sh/v3/covid-19/all" 
     : `https://disease.sh/v3/covid-19/countries/${changeCountryCode}`
     await fetch(url)
     .then (response => response.json())
     .then (data =>{
      setCountry(changeCountryCode)
       setCountryInfo(data);

       setMapCenter([data.countryInfo.lat, data.countryInfo.long])
       setMapZoom(4);
     })
  }
  // console.log("countryinfo start",countryInfo)

  return (
    <div className="app">
       <div className='app__left'>
      <div className='app__header'>
      <h1 className='covid'> COVID19 - TRACKER </h1>
    
      <FormControl className="app__dropdown">

      <Select value={country} variant="outlined" onChange={onChangeCountry}>
        <MenuItem value={country}> Worldwide </MenuItem>

        {countries.map((country)=>(
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
    
     </Select>


      </FormControl>
      </div>
      

      <div className='app__stats'>
      <InfoBox 
      onClick={e =>setCasesType('cases')}
      title="Corona Virus cases" 
      cases={prettyPrintStat(countryInfo.todayCases)} 
      total={countryInfo.cases}/>

      <InfoBox 
      onClick={e =>setCasesType('recovered')}
      title="Recovered" 
      cases={prettyPrintStat(countryInfo.todayRecovered)} 
      total={countryInfo.Recovered}/>

      <InfoBox 
      title="Death" 
      onClick={e =>setCasesType('deaths')}
      cases={prettyPrintStat(countryInfo.todayDeaths)} 
      total={countryInfo.deaths}/>
      </div>
      <Map
      casesType={casesType}
      countries = {mapCountries}
       center={mapCenter}
       zoom={mapZoom}

      />
      </div>
      <Card className='app__right'>
        <CardContent>
         
          <h3>Live Cases by country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new cases {casesType}</h3>
          <Linegraph  casesType={casesType}/>
        </CardContent>
        

      </Card>
    </div>
  );
}

export default App;
