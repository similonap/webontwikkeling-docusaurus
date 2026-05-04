import readline from 'readline-sync';

const amountOfNumbers : number = readline.questionInt('Hoeveel getallen wil je optellen? ');
let numbers : number[] = [];
for (let i = 0; i < amountOfNumbers; i++) {
    numbers.push(readline.questionInt(`Geef getal ${i + 1} in: `));
}

let sum : number = 0;
for (let number of numbers) {
    sum += number;
}
console.log(`De som van de getallen is ${sum}`);

export {}