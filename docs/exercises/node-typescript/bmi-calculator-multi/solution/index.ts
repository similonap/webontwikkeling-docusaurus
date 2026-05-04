import readline from 'readline-sync';

const persons : number = readline.questionInt('Geef het aantal personen in: ');

for (let i = 1; i <= persons; i++) {
    const name : string = readline.question(`Geef de naam van persoon ${i} in: `);
    const gewicht : number = readline.questionInt(`Geef het gewicht van ${name} in (in kg): `);
    const lengte : number = readline.questionFloat(`Geef de lengte van ${name} in (in m): `);
    const bmi : number = gewicht / (lengte ** 2);
    console.log(`${name} heeft een BMI van ${bmi.toFixed(2)}`);
}

export {}