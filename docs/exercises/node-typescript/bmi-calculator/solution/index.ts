import readline from 'readline-sync';

const gewicht : number = readline.questionInt('Geef je gewicht in (in kg): ');
const lengte : number = readline.questionFloat('Geef je lengte in (in m): ');

const bmi : number = gewicht / (lengte ** 2);

console.log(`Je BMI is ${bmi.toFixed(2)}`);

export {}