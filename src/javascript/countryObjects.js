  // Get Game Region Data
  let fetchGameObjects = async (selectedRegion) => {
    let fetchCall = await fetch(`https://restcountries.eu/rest/v2/region/${selectedRegion}`);
    let fecthData = await fetchCall.json();
    return fecthData;
  };
  
  // Get the array of country objects
  let getRegionObjects = async (enteredRegion) => {
    let countryObjects = await fetchGameObjects(enteredRegion);
    let countryInfoObjects = countryObjects.map(country => {
      // Building a new json object with desired information
      return {
        countryName: country.name,
        capitalCity: country.capital,
        subRegion: country.subregion,
        population: country.population,
        borders: country.borders,
        languages: country.languages.map(lang => {
          return lang.name;
        }),
        flag: country.flag,
        regionalblocks: country.regionalBlocs.map(block => {
          return {
            acronym: block.acronym,
            name: block.name
          }
        })[0]
      }
    });
  
    return countryInfoObjects;
  };

  export { getRegionObjects };