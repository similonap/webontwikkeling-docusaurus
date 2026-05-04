import readline from 'readline-sync';

interface Joke {
    error: boolean;
    category: string;
    type: string;
    setup?: string;
    delivery?: string;
    joke?: string;
    safe: boolean;
    id: number;
    lang: string;
}

interface CategoriesResponse {
    categories: string[];
}

async function main() {
    let response = await fetch('https://v2.jokeapi.dev/categories');
    let categoriesResponse : CategoriesResponse = await response.json();
    let categories: string[] = categoriesResponse.categories;
    let types: string[] = ['twopart', 'single'];
    let running: boolean = true;
    do {
        let categoryIndex = readline.keyInSelect(categories, 'What category of joke do you want to see?', {cancel: false});
        let typeIndex = readline.keyInSelect(types, 'What type of joke do you want to see?', {cancel: false});

        if (typeIndex === 0) {
            let response = await fetch(`https://v2.jokeapi.dev/joke/${categories[categoryIndex]}?type=twopart`);
            let data : Joke = await response.json();

            console.log(data.setup);
            console.log(data.delivery);
        } else {
            
            let response = await fetch(`https://v2.jokeapi.dev/joke/${categories[categoryIndex]}?type=single`);
            let data : Joke = await response.json();

            console.log(data.joke);
        }

        running = readline.keyInYNStrict('Do you want to see another joke?');

    } while (running)
}

main();
export {}