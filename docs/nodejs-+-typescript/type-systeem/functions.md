# Functions

## Functies met function keyword

Functies in TypeScript worden gedeclareerd met de `function` keyword. De parameters van een functie worden gedeclareerd met hun naam en type. De return type van een functie wordt gedeclareerd na de parameters.

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

Dit is een functie die twee getallen optelt. De functie verwacht twee parameters van het type `number` en geeft een `number` terug.

Als je een functie hebt die geen return type heeft, dan kan je `void` gebruiken. `void` betekent dat de functie niets teruggeeft.

```typescript
function log(message: string): void {
    console.log(message);
}
```

Je kan ook de `void` keyword weglaten. Dit is hetzelfde als `void`.

```typescript
function log(message: string) {
    console.log(message);
}
```

Let er op dat je de types van de parameters altijd moet declareren. Als je dit niet doet, dan zal TypeScript een foutmelding geven.

```typescript
function log(message) { // Error: Parameter 'message' implicitly has an 'any' type.
    console.log(message);
}
```

### Optionele parameters

Stel dat we een multiply functie willen aanpassen dat ze ook toestaat om maar 1 argument mee te geven. Als we gewoon de 2de argument zouden weglaten krijgen we een foutmelding. Logisch ook want hij kan helemaal geen vermenigvuldiging doen met 1 getal.

```typescript
function multiply(a: number, b: number): number {
    return a * b;
}

console.log(multiply(5)); // Error: Expected 2 arguments, but got 1.
```

Willen we dit toch toestaan dan kunnen we de 2de parameter optioneel maken. Dit doen we door een `?` te plaatsen na de naam van de parameter.

```typescript
function multiply(a: number, b?: number): number {
    return a * b; // Error: Object is possibly 'undefined'.
}
```

Uiteraard krijgen we nu een foutmelding. Dit komt omdat we de parameter `b` niet altijd meegeven. Als we de functie aanroepen met 1 argument dan zal `b` `undefined` zijn. We kunnen dit oplossen door een check te doen of `b` `undefined` is.

```typescript
function multiply(a: number, b?: number): number {
    if (b === undefined) {
        return a;
    }
    return a * b;
}
```

### Default parameters

Je kan ook een default waarde meegeven aan een parameter. Dit doe je door de waarde na de declaratie van de parameter te plaatsen.

```typescript
function multiply(a: number, b: number = 1): number {
    return a * b;
}

console.log(multiply(5)); // 5
```

Nu geeft de functie 5 terug als je maar 1 argument meegeeft. Dit komt omdat `b` nu een default waarde heeft van 1.

### Rest parameters

Soms wil je een functie schrijven die een onbepaald aantal parameters kan aannemen. Dit kan je doen door een rest parameter te gebruiken. Dit is een parameter die je voorafgaat met `...`. Je kan de rest parameter een naam geven. Dit is de naam van de array waarin alle parameters worden opgeslagen.

```typescript
function sum(...numbers: number[]): number {
    let total = 0;
    for (let number of numbers) {
        total += number;
    }
    return total;
}

console.log(sum(1,2,3,4,5)); // 15
console.log(sum(1,2,3)); // 6
```

## Arrow functions

Je hebt naast de `function` keyword ook nog arrow functions. Dit zijn functies die je kan declareren met de pijl operator `=>`. Je kan een arrow function gebruiken als je een functie wil declareren die je als parameter wil meegeven aan een andere functie (een callback functie). Dit is een veel voorkomend patroon in JavaScript en TypeScript.

Stel dat je de volgende functie hebt:

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

kan je die ook schrijven als een arrow function:

```typescript
let add = (a: number, b: number): number => {
    return a + b;
}

console.log(add(1,2)); // 3
```

Merk op dat als we de functie willen kunnen aanroepen zoals hierboven, we de functie moeten declareren als een variabele. Op die manier kunnen we de functie aanroepen door de variabele aan te roepen met de nodige parameters.

De concepten van optionele parameters, default parameters en rest parameters zijn ook van toepassing op arrow functions.

```typescript
let multiply = (a: number, b: number = 1): number => {
    return a * b;
}
```

### Callback functies

Zoals we hierboven al vermeld hebben worden arrow functions vaak gebruikt als callback functies. Dit zijn functies die je als parameter meegeeft aan een andere functie. De functie die je meegeeft wordt dan uitgevoerd op een bepaald moment in de functie waar je de callback functie meegeeft.

Een ideaal voorbeeld hiervan is de `forEach` functie op een array. Deze functie zal een callback functie uitvoeren voor elk element in de array.

```typescript
let numbers = [1,2,3,4,5];

numbers.forEach((element) => {
    console.log(element);
});
```

Merk op dat we hier een arrow function meegeven aan de `forEach` functie. Deze arrow function zal uitgevoerd worden voor elk element in de array. De waarde van het element wordt meegegeven als parameter aan de arrow function. Als we een arrow function meegeven zonder deze een naam te geven, dan noemen we die ook vaak een anonieme functie.

Stel je voor dat we zelf een functie willen schrijven die een array doorloopt en een callback functie uitvoert voor elk element in de array. We kunnen dit doen door een functie te schrijven die een array en een callback functie verwacht.

```typescript
function forEach(array: number[], callback: any) {
    for (let element of array) {
        callback(element);
    }
}
```

De functie hierboven heeft twee parameters: `array`` en een` callback`functie. Je kan die op een heel gelijkaardige manier gebruiken zoals de ingebouwde`forEach\` functie.

```typescript
let numbers : number[] = [1,2,3,4,5];

forEach(numbers, (element) => {
    console.log(element);
});
```

Maar let op! De callback parameter bevat nog altijd het `any` type. Dit is niet wat we willen. We willen dat de callback functie een `number` verwacht als parameter. Dit kunnen we doen door de callback parameter te declareren met het juiste type. Hiervoor moeten we een interface maken die de callback functie beschrijft.

```typescript
interface Callback {
    (element: number): void;
}
```

We kunnen nu de callback parameter declareren met het type `Callback`.

```typescript
function forEach(array: number[], callback: Callback) {
    for (let element of array) {
        callback(element);
    }
}
```

Geef je nu een callback functie mee die een parameter verwacht van een ander type dan `number`, dan zal TypeScript een foutmelding geven.

```typescript
let numbers : string[] = ["een", "twee","drie];

forEach(numbers, (element) => {
    console.log(element);
}); // Error: Argument of type '(string: any) => void' is not assignable to parameter of type 'Callback'.
```

Hier ook nog een voorbeeld van een callback functie die een return type heeft en meer dan 1 parameter verwacht.

```typescript
interface MathFunction {
    (a: number, b: number): number;
}

function calculate(a: number, b: number, callback: MathFunction): number {
    return callback(a,b);
}
```

We kunnen nu de `calculate` functie gebruiken om een berekening uit te voeren met een callback functie. De berekening zelf wordt bepaald door de callback functie.

```typescript
let result = calculate(5, 10, (a, b) => {
    return a + b;
});

console.log(result); // 15
```

Als we nu de calculate functie willen uitvoeren maar we willen een vermenigvuldiging doen in plaats van een optelling, dan kunnen we een andere callback functie meegeven.

```typescript
let result = calculate(5, 10, (a, b) => {
    return a * b;
});

console.log(result); // 50
```

### Verkorte syntax

Wanneer je maar 1 lijn code hebt staan in jouw functie, kan je jouw schrijfwijze verkorten:

```typescript
let hello = () => { console.log("hello"); };
```

Wanneer jouw lijn code maar 1 statement uitvoert, mag je de accolades weglaten:

```typescript
let hello = () => console.log("hello");
```

Wanneer jouw lijn code een return doet, hoef je zelfs return niet meer te vermelden:

```typescript
interface MathFunction {
    (a:number, b:number):number
};

let add1: MathFunction = (a,b) => { return a + b };
let add2: MathFunction = (a,b) => a + b ;
```

Wanneer je maar 1 parameter hebt, kan je zelfs de haakjes rond de parameter weglaten:

```typescript
interface Calculation {
    (a:number):number
};

let double1: Calculation = (a) => { return 2*a };
let double2: Calculation = (a) => 2*a;
let double3: Calculation = a => 2*a;
```

De verkorte syntax is vooral handig bij het gebruik van callback functies. Je kan dan de callback functie meegeven zonder de haakjes en accolades. We grijpen terug naar het voorbeeld van de `forEach` functie.

```typescript
let numbers = [1,2,3,4,5];

numbers.forEach(element => console.log(element));
forEeach(numbers, element => console.log(element));
```

## Array methods

Je hebt al een aantal array methodes gezien zoals `forEach` en hoe je deze gebruikt met een callback functie. Er zijn nog een aantal andere handige array methodes die je kan gebruiken.

### map

De `map` methode zal een nieuwe array teruggeven waarbij elk element van de originele array is vervangen door het resultaat van de callback functie.

```typescript
let numbers : number[] = [1,2,3,4,5];

let doubled : number[] = numbers.map(element => element * 2);

console.log(doubled); // [2,4,6,8,10]
```

Het type van `element` is hetzelfde als het type van een element in de array. In dit geval is `element` van het type `number`. Je kan dit ook expliciet aangeven.

```typescript
let doubled : number[] = numbers.map((element: number) => element * 2);
```

### filter

De `filter` methode zal een nieuwe array teruggeven waarbij alleen de elementen van de originele array worden behouden waarvoor de callback functie `true` teruggeeft.

```typescript
let numbers : number[] = [1,2,3,4,5];

let even : number[] = numbers.filter(element => element % 2 === 0);

console.log(even); // [2,4]
```

Ook hier kan je het type van `element` expliciet aangeven.

```typescript
let even : number[] = numbers.filter((element: number) => element % 2 === 0);
```

### reduce

De `reduce` methode zal een enkele waarde teruggeven die het resultaat is van de callback functie. De callback functie verwacht 2 parameters: de accumulator en het huidige element. De accumulator is de waarde die wordt teruggegeven door de vorige uitvoering van de callback functie. Het huidige element is het huidige element van de array.

```typescript
let numbers : number[] = [1,2,3,4,5];

let sum : number = numbers.reduce((accumulator, element) => accumulator + element);

console.log(sum); // 15
```

[https://reduce.surge.sh/](https://reduce.surge.sh/) (visualizatie van bovenstaande code)

Het type dat de callback functie teruggeeft is hetzelfde als het type van de accumulator. In dit geval is dat `number`. Je kan dit ook expliciet aangeven.

```typescript
let sum : number = numbers.reduce((accumulator: number, element: number) => accumulator + element);
```

Het type van de accumulator is hetzelfde als het type van de initiele waarde die je meegeeft aan de `reduce` methode. Als je geen initiele waarde meegeeft, dan zal de accumulator hetzelfde type hebben als het eerste element van de array.

Soms is het zelfs nodig om het type van de accumulator expliciet aan te geven omdat het type niet kan worden afgeleid.

```typescript
let numbers : number[] = [1,2,3,4,5];

console.log(numbers.reduce((prev: number[], current: number) => [current, ...prev], []));
```

Daarom is het altijd een goed idee om de types van de parameters van de callback functie expliciet aan te geven in een `reduce` methode.

### find

De `find` methode zal het eerste element van de array teruggeven waarvoor de callback functie `true` teruggeeft.

```typescript
let numbers : number[] = [1,2,3,4,5];

let firstEven : number | undefined = numbers.find(element => element % 2 === 0);

console.log(firstEven); // 2
```

Het type van `firstEven` is `number | undefined`. Dit komt omdat de `find` methode `undefined` zal teruggeven als er geen element is gevonden waarvoor de callback functie `true` teruggeeft. Zelfs als je zeker weet dat er altijd een element zal zijn dat voldoet aan de voorwaarde, moet je nog steeds `undefined` in overweging nemen.

```typescript
let names : string[] = ["Andie", "Bert", "Cedric"];

let firstD : string | undefined = names.find(name => name.startsWith("D"));

console.log(firstD); // undefined
```
