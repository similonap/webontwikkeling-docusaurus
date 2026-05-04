import readline from 'readline-sync';

interface RootObject {
    drinks: Drink[];
}

interface Drink {
    idDrink: string;
    strDrink: string;
}


async function main() {
    console.log(`-------------------------------------------`);
    console.log(`| Welcome to the cocktail lookup service. |`);
    console.log(`-------------------------------------------`);

    let running: boolean = true;
    do {
        let ingredient: string = readline.question("Please provide an ingredient: ");
        if (ingredient === '') {
            running = false;
        } else {
            let response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${ingredient}`);

            let rootObject: RootObject = await response.json();

            console.log(`Cocktails with ${ingredient}:`);
            for (const drink of rootObject.drinks) {
                console.log(`- ${drink.strDrink}`);
            }
        }
    } while (running); 

}

main();


export {}