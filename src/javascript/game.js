import { createCountryObjs as objectFormatter } from "./jsonFormatter.js";

(function () {
  let submitRegionBtn = document.querySelector('.submit__regionbtn');
  let nextConuntryBtn = document.querySelector('.game__nextbtn');
  let displayedFlag = document.querySelector('.country__flag');
  let remainingCountries = document.querySelector('.remaining');
  let pickedRegion = document.querySelector('[name="region-selected"]');
  let currentRegionData = [];
  let currentCountry = {};

  // Get API Data, format it and return it from the function
  let getRegionData = async (enteredRegion = "americas") => {
    let apiCall = await fetch(`https://restcountries.eu/rest/v2/region/${enteredRegion}`);
    let apiData = await apiCall.json();

    // Cloning data to global variable and passes to the next function
    currentRegionData = [...objectFormatter(apiData)];
    displayFirstCountry(currentRegionData);
  };

  // Displays the first random country to the page.
  let displayFirstCountry = async (countryData) => {
    document.querySelector('.game__flag > h1').textContent = "Current Country's Flag";
    currentCountry = getRandomArrItem(countryData);
    setFlagData(currentCountry); // sets flag to page
    remainingCountries.textContent += countryData.length;
    submitRegionBtn.style.backgroundColor = "rgba(239, 71, 111, 1)"
    submitRegionBtn.style.color = "rgba(106, 14, 22)"
  };

  // Display next country
  let displayNextCountry = (regionArr) => {
    let regionObjArr = regionArr;
    if (regionObjArr.length !== 0) {
      // Removes the current country from the coutries array
      let currentCountryIndex = regionObjArr.indexOf(currentCountry);
      regionObjArr.splice(currentCountryIndex, 1);
      // Displays the next country to the display;
      let nextCountry = getRandomArrItem(currentRegionData);
      setFlagData(nextCountry); // sets flag to page
      remainingCountries.textContent = `Countries Remaining: ${regionObjArr.length}`;
    } else {
      displayRegionEnd(); // no more countries left to guess
      remainingCountries.textContent = `Countries Remaining: 0`;
    }
  };

  // Informs the user that there are no more countries in this region.
  let displayRegionEnd = () => {
    document.querySelector('.game__flag > h1').textContent = "That's all the countries for this region! Good job!";
    submitRegionBtn.textContent = "Play Again";
    submitRegionBtn.style.backgroundColor = "rgba(6, 214, 160, 1)";
    submitRegionBtn.style.color = "rgba(5, 95, 71, 1.0)";
  };

  // Sets current flag to page
  let setFlagData = (countryObj) => {
    displayedFlag.setAttribute('src', countryObj.flag);
    displayedFlag.setAttribute('alt', `A picture of the flag of ${countryObj.name}`);
  };



  // Get random array item 
  let getRandomArrItem = (countriesArr) => {
    return countriesArr[Math.floor(Math.random() * countriesArr.length)];
  };




  // Event Listeners +++++++++++++++++++++++++++++++++++++++++++

  // Get the user entered region on click
  submitRegionBtn.addEventListener('click', () => {
    let selectedRegion = pickedRegion.value;
    getRegionData(selectedRegion.toLowerCase());

    // Make Name Uppercase



    document.querySelector('.current__region').textContent = `Current Region: ${selectedRegion}`;
  })

  //
  pickedRegion.addEventListener('focus', () => {
    submitRegionBtn.textContent = "Submit Region";
  })

  // Display next country in array
  nextConuntryBtn.addEventListener('click', () => {
    displayNextCountry(currentRegionData);
  });

})();