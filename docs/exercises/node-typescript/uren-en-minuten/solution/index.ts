import readline from 'readline-sync';

let minutes : number = readline.questionInt('Geef het aantal minuten in: ');

let hours : number = Math.floor(minutes / 60);
let remainingMinutes : number = minutes % 60;

console.log(`Dit is ${hours} uur en ${remainingMinutes} minuten`);

export {}