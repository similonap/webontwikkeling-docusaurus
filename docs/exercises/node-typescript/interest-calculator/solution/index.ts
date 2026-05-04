import readline from 'readline-sync';

const amount : number = readline.questionFloat("Geef het bedrag in: ");
const interest : number = readline.questionFloat("Geef het interest percentage in: ");

console.log(`Na 1 jaar heb je ${amount * (1 + interest / 100)}`);
console.log(`Na 2 jaar heb je ${amount * (1 + interest / 100) ** 2}`);
console.log(`Na 5 jaar heb je ${amount * (1 + interest / 100) ** 5}`);

export {}