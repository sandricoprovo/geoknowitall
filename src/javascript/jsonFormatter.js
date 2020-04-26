// Takes in the raw region array of objects and returns newly formatted object with only desired information.
let createCountryObjs = (regionArr) => {
  let formatedJson = regionArr.map(country => {
    return {
      name: country.name,
      capital: country.capital,
      region: country.region,
      bordering: country.borders,
      langs: country.languages.map(lang => {
        return lang.name;
      }),
      flag: country.flag,
      regionalBloc: country.regionalBlocs.map(bloc => {
        return {
          acronym: bloc.acronym,
          name: bloc.name
        }
      })
    };
  });

  return formatedJson;
};

// Exports
export { createCountryObjs };