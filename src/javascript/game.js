
(function() {
  let submitRegionBtn = document.querySelector('.submit__regionbtn');
  let displayedFlag = document.querySelector('.country__flag');
  
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

    // Get a random country and load its flag to screen
    let displayStarterInfo = async (countryData) => {
      let countryObjects = await countryData;
      let currentCountry = getRandomArrItem(countryObjects)

      // Setting country data to screen
      displayedFlag.setAttribute("src", currentCountry.flag);
      displayedFlag.setAttribute("alt", `A picture of the flag of ${currentCountry.countryName}.`);
    };

    // Get random array item 
    let getRandomArrItem = (countriesArr) => {
      return countriesArr[Math.floor(Math.random() * countriesArr.length)];
    };

  // Event Listeners +++++++++++++++++++++++++++++++++++++++++++

  // Get the user entered region on click
  submitRegionBtn.addEventListener('click', () => {
    let pickedRegion = document.querySelector('[name="region-selected"]').value.toLowerCase();
    let results = getRegionObjects(pickedRegion);
    displayStarterInfo(results);
  })


})();