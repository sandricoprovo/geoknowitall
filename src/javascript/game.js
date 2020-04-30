import { createCountryObjs as objectFormatter } from "./jsonFormatter.js";

(function () {
  // Globals
  let submitRegionBtn = document.querySelector('.submit__regionbtn');
  let nextConuntryBtn = document.querySelector('.game__nextbtn');
  let checkAnswersBtn = document.querySelector('.game__checkanswers');
  let displayedFlag = document.querySelector('.country__flag');
  let remainingCountries = document.querySelector('.remaining');
  let scoreTally = document.querySelector('.score__current');
  let pickedRegion = document.querySelector('[name="region-selected"]');
  let currentRegionData = [];
  let selectionPool = []
  let currentOptions = [];
  let currentCountry = {};
  let correctAnswers = 0;
  let totalScore = 0;

  // Get API Data, format it and return it from the function
  let getRegionData = async (enteredRegion = "americas") => {
    let apiCall = await fetch(`https://restcountries.eu/rest/v2/region/${enteredRegion}`);
    let apiData = await apiCall.json();

    // Cloning data to global variable and passes to the next function
    currentRegionData = [...objectFormatter(apiData)];
    selectionPool = [...objectFormatter(apiData)];
    totalScore = currentRegionData.length * 4;
    displayFirstCountry(currentRegionData);
  };

  // Displays the first random country to the page.
  let displayFirstCountry = async (countryData) => {
    document.querySelector('.game__flag > h1').textContent = "Current Country's Flag";
    currentCountry = getRandomArrItem(countryData);
    setFlagData(currentCountry); // sets flag to page
    remainingCountries.textContent = `Countries Remaining: ${countryData.length}`;
    scoreTally.textContent = `Current Score: ${correctAnswers} / ${totalScore}`;
    displayGameState("refresh");
    loadOptions(countryData, currentCountry);
  };

  // Display next country
  let displayNextCountry = (regionArr) => {
    let regionObjArr = regionArr;
    if (regionObjArr.length > 1) {
      document.querySelector('.game__flag > h1').textContent = "Current Country's Flag";
      // Removes the current country from the coutries array
      let currentCountryIndex = regionObjArr.indexOf(currentCountry);
      regionObjArr.splice(currentCountryIndex, 1);
      // Displays the next country to the display;
      let nextCountry = getRandomArrItem(currentRegionData);
      currentCountry = nextCountry;
      setFlagData(nextCountry); // sets flag to page
      setCorrectAnswers("refresh");
      loadOptions(selectionPool, currentCountry);
      remainingCountries.textContent = `Countries Remaining: ${regionObjArr.length}`;
    } else {
      displayGameState("end");
      remainingCountries.textContent = `Countries Remaining: 0`;
    }
  };

  // Informs the user that there are no more countries in this region.
  let displayGameState = (currentState) => {
    if (currentState === "end") {
      document.querySelector('.game__flag > h1').textContent = "That's all the countries for this region! Good job!";
      submitRegionBtn.textContent = "Play Again";
      submitRegionBtn.style.backgroundColor = "rgba(6, 214, 160, 1)";
      submitRegionBtn.style.color = "rgba(5, 95, 71, 1.0)";
    } else if (currentState === "refresh") {
      submitRegionBtn.style.backgroundColor = "rgba(239, 71, 111, 1)"
      submitRegionBtn.style.color = "rgba(47, 13, 19, 1.0)"
    }
  };

  // checks the answers of all the input fields against the current country properties
  let checkAnswers = () => {
    let nameAnswer = document.querySelector('[name="countryName"]');
    let capitalAnswer = document.querySelector('[name="capital"]');
    let regionAnswer = document.querySelector('[name="region"]');
    let borderingAnswer = document.querySelector('[name="borderingCountry"]');

    if (!nameAnswer.classList.contains("input__field--correct") && !nameAnswer.classList.contains("input__field--incorrect")) {
      // Checking Answers
      answerCheckerUtil(nameAnswer, "name");
      answerCheckerUtil(capitalAnswer, "capital");
      answerCheckerUtil(regionAnswer, "region");
      answerCheckerUtil(borderingAnswer, "bordering");
      scoreTally.textContent = `Current Score: ${correctAnswers} / ${totalScore}`;
      setCorrectAnswers("fill");
    } else {
      document.querySelector('.game__flag > h1').textContent = "You already checked those answers.";
    }
  }

  // Adds Classes to Show Correct or Incorrect answers
  let answerCheckerUtil = (answer, propertyToCheck) => {
    let answerToCheck = answer.value.toLowerCase();

    // Check Answers 
    if (propertyToCheck === "bordering") {
      if (answerToCheck === currentCountry[propertyToCheck].join("").toLowerCase()) {
        correctAnswers += 1;
        answer.classList.add("input__field--correct");
      } else {
        answer.classList.add("input__field--incorrect");
      }
    } else if (answerToCheck === currentCountry[propertyToCheck].toLowerCase()) {
      answer.classList.add("input__field--correct");
      correctAnswers += 1;
    } else {
      answer.classList.add("input__field--incorrect");
    }
  };

  // Adds Classes to Show Correct or Incorrect answers
  let removeInputClasses = (label) => {
    // removes answer classes from labels 
    label.classList.remove("input__field--correct");
    label.classList.remove("input__field--incorrect");

    // set all inputs back to empty
    document.querySelector('[name="countryName"]').value = "";
    document.querySelector('[name="capital"]').value = "";
    document.querySelector('[name="region"]').value = "";
    document.querySelector('[name="borderingCountry"]').value = "";
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

  // Load Correct Answers to screen
  let setCorrectAnswers = (state) => {
    let correctNameAnswer = document.querySelector('.correct__name');
    let correctCapitalAnswer = document.querySelector('.correct__capital');
    let correctRegionAnswer = document.querySelector('.correct__region');
    let correctBordersAnswer = document.querySelector('.correct__bordering');

    // Fills fields based on state of game
    if (state === "fill") {
      correctNameAnswer.textContent = `Correct Answer: ${currentCountry.name}`;
      correctCapitalAnswer.textContent = `Correct Answer: ${currentCountry.capital}`;
      correctRegionAnswer.textContent = `Correct Answer: ${currentCountry.region}`;
      correctBordersAnswer.textContent = `Correct Answer: ${currentCountry.bordering}`;
    } else if (state === "refresh") {
      correctNameAnswer.textContent = `Correct Answer:`;
      correctCapitalAnswer.textContent = `Correct Answer:`;
      correctRegionAnswer.textContent = `Correct Answer:`;
      correctBordersAnswer.textContent = `Correct Answer:`;
    }
  };

  // Load options to the screen answers to selection boxes
  let loadOptions = (countriesArr, curCountry) => {
    let nameAnswer = document.querySelector('[name="countryName"]');
    let capitalAnswer = document.querySelector('[name="capital"]');
    let regionAnswer = document.querySelector('[name="region"]');
    let borderingAnswer = document.querySelector('[name="borderingCountry"]');

    // refresh current selections
    currentOptions = [];
    nameAnswer.innerHTML = `<option value="" selected>Pick An Option</option>`;
    capitalAnswer.innerHTML = `<option value="" selected>Pick An Option</option>`;
    regionAnswer.innerHTML = `<option value="" selected>Pick An Option</option>`;
    borderingAnswer.innerHTML = `<option value="" selected>Pick An Option</option>`;

    // Load All options to display
    currentOptions.push(getRandomArrItem(countriesArr), getRandomArrItem(countriesArr), getRandomArrItem(countriesArr), curCountry);

    // sort the options to randomize placement of correct answer
    let sortedOptions = currentOptions.sort((obj1, obj2) => {
      if (obj1.name < obj2.name) //sort string ascending
        return -1
      if (obj1.name > obj2.name)
        return 1
      return 0 //default return value (no sorting)
    });

    // Loop through sorted options and push options to page
    sortedOptions.forEach(object => {
      nameAnswer.innerHTML += `<option value="${object.name.toLowerCase()}">${object.name}</option>`;
      capitalAnswer.innerHTML += `<option value="${object.capital.toLowerCase()}">${object.capital}</option>`;
      regionAnswer.innerHTML += `<option value="${object.region.toLowerCase()}">${object.region}</option>`;
      borderingAnswer.innerHTML += `<option value="${object.bordering.join("").toLowerCase()}">${object.bordering}</option>`;
    })
  };

  // Event Listeners +++++++++++++++++++++++++++++++++++++++++++

  // Get the user entered region on click
  submitRegionBtn.addEventListener('click', () => {
    let selectedRegion = pickedRegion.value;
    getRegionData(selectedRegion.toLowerCase());
    totalScore = 0;
    correctAnswers = 0;

    // Make First Letter Uppercase
    let formattedRegion = selectedRegion.replace(/^./, selectedRegion[0].toUpperCase())
    document.querySelector('.current__region').textContent = `Current Region: ${formattedRegion}`;
  })

  // Sets the submit region button back to submit region
  pickedRegion.addEventListener('focus', () => {
    submitRegionBtn.textContent = "Submit Region";
  })

  // Display next country in array
  nextConuntryBtn.addEventListener('click', () => {
    displayNextCountry(currentRegionData);
    // Removes input answer class
    removeInputClasses(document.querySelector('[name="countryName"]'));
    removeInputClasses(document.querySelector('[name="capital"]'));
    removeInputClasses(document.querySelector('[name="region"]'));
    removeInputClasses(document.querySelector('[name="borderingCountry"]'));
  });

  // Checking the users answers on click
  checkAnswersBtn.addEventListener('click', () => {
    checkAnswers();
  })


})();