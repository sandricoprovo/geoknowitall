// Takes in the raw region array of objects and returns newly formatted object with only desired information.
let createCountryObjs = (regionArr) => {
  let formatedJson = regionArr.map(country => {
    return {
      name: country.name,
      nameAbbr: country.alpha3Code,
      capital: country.capital,
      region: country.subregion,
      bordering: country.borders.map(border => {
        return border;
      }),
      flag: country.flag,
    };
  });

  return formatedJson;
};

// Exports
export { createCountryObjs };