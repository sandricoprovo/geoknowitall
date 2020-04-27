import { createCountryObjs as objectFormatter } from "./jsonFormatter.js";

(function () {
  let submitRegionBtn = document.querySelector('.submit__regionbtn');
  let nextConuntryBtn = document.querySelector('.game__nextbtn');
  let checkAnswersBtn = document.querySelector('.game__checkanswers');
  let displayedFlag = document.querySelector('.country__flag');
  let remainingCountries = document.querySelector('.remaining');
  let scoreTally = document.querySelector('.score__current');
  // Input Labels
  let pickedRegion = document.querySelector('[name="region-selected"]');
  let nameLabel = document.querySelector('[for="countryName"]');
  let capitalLabel = document.querySelector('[for="capital"]');
  let regionLabel = document.querySelector('[for="region"]');
  let borderingLabel = document.querySelector('[for="borderingCountry"]');
  let currentRegionData = [];
  let currentCountry = {};
  let correctAnswers = 0;
  let totalScore = 0;

  // Get API Data, format it and return it from the function
  let getRegionData = async (enteredRegion = "americas") => {
    let apiCall = await fetch(`https://restcountries.eu/rest/v2/region/${enteredRegion}`);
    let apiData = await apiCall.json();

    // Cloning data to global variable and passes to the next function
    currentRegionData = [...objectFormatter(apiData)];
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
  };

  // Display next country
  let displayNextCountry = (regionArr) => {
    let regionObjArr = regionArr;
    if (regionObjArr.length > 1) {
      // Removes the current country from the coutries array
      let currentCountryIndex = regionObjArr.indexOf(currentCountry);
      regionObjArr.splice(currentCountryIndex, 1);
      // Displays the next country to the display;
      let nextCountry = getRandomArrItem(currentRegionData);
      currentCountry = nextCountry;
      setFlagData(nextCountry); // sets flag to page
      setCorrectAnswers("refresh");
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
      submitRegionBtn.style.color = "rgba(106, 14, 22)"
    }
  };

  // checks the answers of all the input fields against the current country properties
  let checkAnswers = () => {
    let nameAnswer = document.querySelector('[name="countryName"]');
    let capitalAnswer = document.querySelector('[name="capital"]');
    let regionAnswer = document.querySelector('[name="region"]');
    let borderingAnswer = document.querySelector('[name="borderingCountry"]');

    console.log(currentCountry)

    // Checking Answers
    answerCheckerUtil(nameLabel, nameAnswer, "name");
    answerCheckerUtil(capitalLabel, capitalAnswer, "capital");
    answerCheckerUtil(regionLabel, regionAnswer, "region");
    answerCheckerUtil(borderingLabel, borderingAnswer, "bordering");
    scoreTally.textContent = `Current Score: ${correctAnswers} / ${totalScore}`;
    setCorrectAnswers("fill");
  }

  // Adds Classes to Show Correct or Incorrect answers
  let answerCheckerUtil = (label, answer, propertyToCheck) => {
    let answerToCheck = answer.value.toLowerCase();
    // Check Answers 
    if (propertyToCheck === "bordering") {
      let answerIndex = currentCountry.bordering.findIndex(country => `${answerToCheck}` === country);
      if (currentCountry.bordering.length === 0 && answerToCheck === "") {
        label.classList.add("input__field--correct");
        correctAnswers += 1;
      } else if (answerIndex >= 0) {
        label.classList.add("input__field--correct");
        correctAnswers += 1;
      } else {
        label.classList.add("input__field--incorrect");
      }
    } else if (answerToCheck === currentCountry[propertyToCheck]) {
      label.classList.add("input__field--correct");
      correctAnswers += 1;
    } else {
      label.classList.add("input__field--incorrect");
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
      correctBordersAnswer.textContent = `Correct Answers: ${currentCountry.bordering}`;
    } else if (state === "refresh") {
      correctNameAnswer.textContent = `Correct Answer:`;
      correctCapitalAnswer.textContent = `Correct Answer:`;
      correctRegionAnswer.textContent = `Correct Answer:`;
      correctBordersAnswer.textContent = `Correct Answers:`;
    }
  };




  // Event Listeners +++++++++++++++++++++++++++++++++++++++++++

  // Get the user entered region on click
  submitRegionBtn.addEventListener('click', () => {
    let selectedRegion = pickedRegion.value;
    getRegionData(selectedRegion.toLowerCase());
    totalScore = 0;
    correctAnswers = 0

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
    removeInputClasses(nameLabel);
    removeInputClasses(capitalLabel);
    removeInputClasses(regionLabel);
    removeInputClasses(borderingLabel);
  });

  // Checking the users answers on click
  checkAnswersBtn.addEventListener('click', () => {
    checkAnswers();
  })


})();