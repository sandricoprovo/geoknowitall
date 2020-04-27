// Takes in the raw region array of objects and returns newly formatted object with only desired information.
let createCountryObjs = (regionArr) => {
  let formatedJson = regionArr.map(country => {
    return {
      name: country.name.toLowerCase(),
      nameAbbr: country.alpha3Code.toLowerCase(),
      capital: country.capital.toLowerCase(),
      region: country.subregion.toLowerCase(),
      bordering: country.borders.map(border => {
        return border.toLowerCase();
      }),
      flag: country.flag,
    };
  });

  return formatedJson;
};

// Exports
export { createCountryObjs };