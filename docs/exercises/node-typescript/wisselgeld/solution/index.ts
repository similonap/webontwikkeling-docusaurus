import readline from 'readline-sync';

let amount : number = readline.questionInt('Geef het bedrag in: ');
let remainingAmount : number = amount;
const amount500 : number = Math.floor(amount / 500);
remainingAmount = remainingAmount % 500;
const amount200 : number = Math.floor(remainingAmount / 200);
remainingAmount = remainingAmount % 200;
const amount100 : number = Math.floor(remainingAmount / 100);
remainingAmount = remainingAmount % 100;
const amount50 : number = Math.floor(remainingAmount / 50);
remainingAmount = remainingAmount % 50;
const amount20 : number = Math.floor(remainingAmount / 20);
remainingAmount = remainingAmount % 20;
const amount10 : number = Math.floor(remainingAmount / 10);
remainingAmount = remainingAmount % 10;
const amount5 : number = Math.floor(remainingAmount / 5);
remainingAmount = remainingAmount % 5;
const amount2 : number = Math.floor(remainingAmount / 2);
remainingAmount = remainingAmount % 2;
const amount1 : number = remainingAmount;

let output : string = "Dit is ";
if (amount500 > 0) {
    output += `${amount500} briefje${amount500 > 1 ? 's' : ''} van 500, `;
}
if (amount200 > 0) {
    output += `${amount200} briefje${amount200 > 1 ? 's' : ''} van 200, `;
}
if (amount100 > 0) {
    output += `${amount100} briefje${amount100 > 1 ? 's' : ''} van 100, `;
}
if (amount50 > 0) {
    output += `${amount50} briefje${amount50 > 1 ? 's' : ''} van 50, `;
}
if (amount20 > 0) {
    output += `${amount20} briefje${amount20 > 1 ? 's' : ''} van 20, `;
}
if (amount10 > 0) {
    output += `${amount10} munt${amount10 > 1 ? 'en' : ''} van 10, `;
}
if (amount5 > 0) {
    output += `${amount5} munt${amount5 > 1 ? 'en' : ''} van 5, `;
}
if (amount2 > 0) {
    output += `${amount2} munt${amount2 > 1 ? 'en' : ''} van 2, `;
}
if (amount1 > 0) {
    output += `${amount1} munt${amount1 > 1 ? 'en' : ''} van 1, `;
}
console.log(output.substring(0, output.length - 2));

export {}