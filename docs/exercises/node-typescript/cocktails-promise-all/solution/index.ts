interface Cocktail {
    idDrink: string;
    strDrink: string;
}

Promise.all([
    fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11000').then(response => response.json()),
    fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11001').then(response => response.json()),
    fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11002').then(response => response.json())
]).then((cocktails) => {
    for (const cocktail of cocktails) {
        console.log(cocktail.drinks[0].strDrink);
    }
});

export {}