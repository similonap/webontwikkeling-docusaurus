# Input lezen

## Readline Sync

Soms is het handig om input te kunnen lezen van de gebruiker om interactie te hebben met de gebruiker. Bijvoorbeeld om de naam van de gebruiker te vragen, zijn leeftijd, ... In NodeJS kan je dit doen aan de hand van de `readline-sync` module. Deze module is standaard niet geïnstalleerd dus moet je deze eerst installeren.

```typescript
npm install readline-sync
```

We moeten ook nog de types installeren van deze module. Deze zijn niet standaard meegeleverd met de module. Je kan deze installeren aan de hand van het volgende commando:

```typescript
npm install --save-dev @types/readline-sync
```

Je moet deze module elke keer dat je deze nodig hebt importeren in je code:

```typescript
import * as readline from 'readline-sync';
```

Nu kan je de `question` functie gebruiken om een vraag te stellen aan de gebruiker. Deze functie heeft 1 parameter, namelijk de vraag die je wil stellen. Deze functie geeft een string terug met het antwoord van de gebruiker.

```typescript
let name = readline.question("What's your name? ");
console.log(`Hello ${name}!`);
```

### Een getal lezen

Als je een getal wil lezen van de gebruiker dan moet je de `question` functie gebruiken in combinatie met de `Number` functie. De `Number` functie zet een string om naar een getal. De `question` functie geeft een string terug dus moeten we deze omzetten naar een getal.

```typescript
let age : number = Number(readline.question("What's your age? "));
console.log(`You are ${age} years old.`);
```

Je bent hier ook niet zeker dat de gebruiker wel een getal zal ingeven. Als de gebruiker geen getal ingeeft dan zal de `Number` functie een `NaN` teruggeven. Dit is een speciale waarde die staat voor "Not a Number". Als je deze waarde probeert te gebruiken in een berekening dan zal je een `NaN` terugkrijgen. Wil je dit vermijden dan kan je best eerst nakijken of de waarde wel een getal is.

```typescript
import * as readline from 'readline-sync';

let age : number | undefined = undefined;
do {
    age = Number(readline.question("What's your age? "));
    if (isNaN(age)) {
        console.log("Input valid number, please.");
    }
} while (isNaN(age))
console.log(`You are ${age} years old.`);
```

Je kan ook de `questionInt` functie gebruiken. Deze functie doet hetzelfde als de `question` functie maar zet het antwoord van de gebruiker automatisch om naar een getal. Ook als de gebruiker geen getal ingeeft zal deze functie een foutmelding geven.

```typescript
let age : number = readline.questionInt("What's your age? ");
console.log(`You are ${age} years old.`);
```

Zo verkrijg je dezelfde output als hierboven maar met minder code.

```
What's your age? Test
Input valid number, please.
What's your age? 3
You are 3 years old.
```

Wil je de error message aanpassen dan kan je een tweede parameter meegeven aan de `questionInt` functie.

```typescript
let age : number = readline.questionInt("What's your age? ", {limitMessage: "I only like numbers!"});
console.log(`You are ${age} years old.`);
```

Wil je een kommagetal lezen dan kan je de `questionFloat` functie gebruiken. Deze functie doet hetzelfde als de `questionInt` functie maar zet het antwoord van de gebruiker automatisch om naar een kommagetal.

```typescript
let price : number = readline.questionFloat("What's the price? ");
console.log(`The price is ${price} euro.`);
```

### Een boolean lezen

Soms wil je een vraag stellen aan de gebruiker waar hij alleen Yes of No kan op antwoorden. Het resultaat is dan een boolean. Je kan dit doen aan de hand van de `keyInYNStrict` functie. Deze functie geeft een boolean terug.

```typescript
let answer : boolean = readline.keyInYNStrict("Do you like TypeScript? ");

if (answer) {
    console.log("Me too!");
} else {
    console.log("Too bad!");
}
```

### Menu tonen

Soms wil je een menu tonen aan de gebruiker waar hij een keuze kan maken. Je kan dit doen aan de hand van de `keyInSelect` functie. Deze functie heeft 2 parameters. De eerste parameter is een array met de verschillende keuzes die de gebruiker kan maken. De tweede parameter is een optionele parameter met de vraag die je wil stellen aan de gebruiker. Deze functie geeft een getal terug met de index van de keuze die de gebruiker heeft gemaakt.

```typescript
let choices : string[] = ["TypeScript", "JavaScript", "Python", "Java", "C#"];

let index : number = readline.keyInSelect(choices, "What's your favorite programming language? ");
console.log(`You chose ${choices[index]}.`);
```

Dit ziet er als volgt uit:

```
[1] TypeScript
[2] JavaScript
[3] Python
[4] Java
[5] C#
[0] CANCEL

What's your favorite programming language? [1...5 / 0]: 
```
