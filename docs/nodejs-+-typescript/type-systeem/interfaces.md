# Interfaces

Er bestaan een aantal datatypes in TypeScript die we "primitieve" of "eenvoudige" datatypes noemen. Dit is omdat de waarden altijd maar uit 1 enkel ding bestaat. In het hoofdstuk over arrays heb je gezien dat er ook nog een ander soort datatypes bestaat: de complexe datatypes. Deze worden opgebouwd uit meerdere primitieve datatypes. 

Een object is een ander voorbeeld van een complex datatype. In JavaScript en TypeScript kom je objecten haast overal tegen. Daarom is het belangrijk om deze te begrijpen en deze te kunnen gebruiken. 

## Type van een object

We kunnen een object beschrijven aan de hand van een interface . Deze interface beschrijft welke properties een object bevat en kan bevatten. We maken een eigen soort type dat we later kunnen gebruiken bij het declareren van onze variabelen.

Stel dat je het volgende object in JavaScript hebt:

```typescript
let andie = {
  name: "Andie",
  age: 40
}
```

Dit object heeft twee properties: `name` en `age`. De waarde van `name` is een string en de waarde van `age` is een number. Als we nu een tweede object willen aanmaken en perongeluk een typfout maken, dan zal TypeScript ons niet waarschuwen van deze fout:

```typescript
let debbie = {
  naem: "Debbie",
  age: 30
}
```

TypeScript zal dit als twee verschillende objecten zien. Dit is niet wat we willen. We willen dat TypeScript ons waarschuwt als we een typfout maken. We willen dus een type declareren dat zegt dat een object een `name` en een `age` property moet hebben. Dit kunnen we doen aan de hand van een interface:

```typescript
interface Person {
  name: string;
  age: number;
}
```

We hebben nu een interface gemaakt die we `Person` noemen. Deze interface beschrijft een object dat een `name` en een `age` property moet hebben. We kunnen nu een variabele declareren van het type `Person`:

```typescript
let andie: Person = {
  name: "Andie",
  age: 40
}
```

Als we nu een typfout maken, dan zal TypeScript ons waarschuwen:

```typescript
let debbie: Person = {
  naem: "Debbie",
  age: 30
} // Error: Property 'naem' does not exist on type 'Person'
```

Ook is het niet mogelijk om een property toe te voegen die niet in de interface staat:

```typescript
let debbie: Person = {
    name: "Debbie",
    age: 30,
    isAdmin: true
} // Error: Object literal may only specify known properties, and 'isAdmin' does not exist in type 'Person'
```

Ook het weglaten van bepaalde properties zal een foutmelding geven:

```typescript
let debbie: Person = {
    name: "Debbie"
} // Error: Property 'age' is missing in type '{ name: string; }' but required in type 'Person'
```

Uiteraard moet je ook de data types van de properties respecteren:

```typescript
let debbie: Person = {
    name: "Debbie",
    age: "30"
} // Error: Type 'string' is not assignable to type 'number'
```

## Objecten in objecten

Het is ook mogelijk om objecten in andere objecten te gaan steken. Bijvoorbeeld voor ons User object zouden we kunnen kiezen om ook een adres toe te voegen. We zouden deze als aparte eigenschappen kunnen opgeven van het user object maar het is beter om dit in een apart object te steken.

We passen dus de User interface hiervoor aan:

```typescript
interface User {
    name: string,
    age?: number,
    address: Address
}
```

Het type `Address` moeten we dan ook nog aanmaken aan de hand van een nieuwe interface.

```typescript
interface Address {
    street: string,
    number: number,
    city: string
}
```

Nu kunnen we een User object aanmaken gebruik makende van deze interface.

```typescript
let user : User = {
  name: "Andie",
  age: 30,
  address: {
    street: "Fakestreet",
    number: 133,
    city: "Fakegem"
  }
}
```

Wil je dan bijvoorbeeld de straat van deze gebruiker op het scherm tonen dan kan je dit doen aan de hand van de dot notatie:

```typescript
console.log(user.address.street);
```

Als we `address` zouden niet verplicht maken (optioneel):

```typescript
interface User {
    name: string,
    age?: number,
    address?: Address
}
```

dan moet je wel eerst nakijken of `address` wel is opgegeven:

```typescript
if (user.address) {
    console.log(user.address.street);
}
```

anders krijg je deze error:

```typescript
console.log(user.address.street); // Error: Object is possibly 'undefined'
```

## Record type

Een record type is een object waarvan we de properties niet kennen. We weten niet welke properties het object zal hebben. We kunnen dit aangeven aan de hand van de `Record` type. Dit type heeft twee type parameters: het eerste type parameter is het type van de keys en het tweede type parameter is het type van de values.

### Voorbeeld

Stel je voor dat je namen van gebruikers wilt bijhouden en bij elke naam een telefoonnummer wilt opslaan. Je wil dus een object hebben in de vorm van:

```typescript
{
  "Andie": "+32 123 45 67 89",
  "Debbie": "+32 987 65 43 21"
}
```

Je zou hier een interface van kunnen maken:

```typescript
interface PhoneBook {
  "Andie": string,
  "Debbie": string
}

const phoneBook: PhoneBook = {
  "Andie": "+32 123 45 67 89",
  "Debbie": "+32 987 65 43 21"
}
```

wil je nu een toevoegen:

```
phoneBook["Charlie"] = "+32 123 45 67 89";
```

dan gaat dit niet werken. Je moet de interface aanpassen:

```typescript
interface PhoneBook {
  "Andie": string,
  "Debbie": string,
  "Charlie": string
}
```

Dit is uiteraard niet handig als je niet op voorhand weet welke namen er in het telefoonboek zullen staan. Je kan dit oplossen aan de hand van de `Record` type:

```typescript
let phoneBook: Record<string, string> = {
  "Andie": "+32 123 45 67 89",
  "Debbie": "+32 987 65 43 21"
}
```

### Occurences tellen

Stel dat we een object willen gebruiken om bij te houden hoeveel keer een bepaalde waarde voorkomt in een array. We kunnen onmogelijk op voorhand weten welke waarden er in de array zullen zitten dus we kunnen niet op voorhand zeggen welke properties het object zal hebben. We kunnen dit oplossen aan de hand van de `Record` type:

```typescript
let count: Record<string, number> = {};

let values = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5];

for (let value of values) {
  if (count[value]) {
    count[value]++;
  } else {
    count[value] = 1;
  }
}

console.log(count); // { '1': 3, '2': 3, '3': 3, '4': 3, '5': 3 }
```

## JSON bestand inlezen

### import statement

Je kan aan de hand van het `import` statement in TypeScript een JSON bestand inlezen. Dit is handig als je bijvoorbeeld een configuratie bestand hebt dat je wil inlezen of dat je een lijst van objecten wil inlezen vanuit een bestand.

Stel dat je een JSON bestand `users.json` hebt met de volgende inhoud:

```json
[
  {
    "name": "Andie",
    "age": 30,
    "address": {
      "street": "Fakestreet",
      "number": 133,
      "city": "Fakegem"
    }
  },
  {
    "name": "Debbie",
    "age": 25,
    "address": {
      "street": "Fakestreet",
      "number": 133,
      "city": "Fakegem"
    }
  }
]
```

Dan kan je dit bestand inlezen aan de hand van het `import` statement:

```typescript
import data from "./users.json";
```

Je moet hier wel op letten dat je in je `tsconfig.json` bestand de volgende optie hebt aangezet:

```json
{
  "compilerOptions": {
    ...
    "resolveJsonModule": true
    ...
  }
}
```

Je moet dan nog wel de inhoud van `usersJson` in een variabele of constante steken:

```typescript
const users: User[] = data as User[]
```

Je merkt hier op dat we het `as` statement gebruiken om TypeScript te vertellen dat `data` het type `User[]` heeft. Dit is nodig omdat TypeScript niet weet welk type `data` heeft omdat dit afkomstig is van een JSON bestand. Dit is een zogenaamde type assertion. 

Het is niet altijd mogelijk om een bestand in te lezen aan de hand van het `import` statement. Als je bijvoorbeeld een bestand wil inlezen dat niet in je project zit en ergens anders op je computer staat dan kan je dit niet inlezen aan de hand van het `import` statement. In dat geval kan je gebruik maken van de `fs` module.

## Interessante operators

### De .? (of optionele chaining) operator

De optionele chaining operator is een nieuwe operator die sinds TypeScript 3.7 beschikbaar is. Deze operator is zeer handig als je objecten in objecten hebt. Stel dat je een object hebt met een aantal properties en je wil een property van een property opvragen. Als je niet zeker bent of de property wel bestaat dan kan je de optionele chaining operator gebruiken.

```typescript
interface User {
    name: string,
    age: number,
    address?: Address
}

let user : User = {
  name: "Andie",
  age: 30
}

console.log(user.address.street); // Error: Object is possibly 'undefined'
```

We hebben hierboven gezien dat we dit kunnen voorkomen door eerst na te kijken of de property wel bestaat aan de hand van een if statement. Dit is echter niet zo handig. Je kan dit nu oplossen aan de hand van de optionele chaining operator:

```typescript
console.log(user.address?.street); // undefined
```

Als address nu undefined is dan zal de optionele chaining operator undefined teruggeven. Als address wel bestaat dan zal de optionele chaining operator de waarde van street teruggeven.

Zo kunnen we heel diepe objecten gaan opvragen zonder dat we eerst moeten nakijken of de properties wel bestaan:

```typescript
console.log(user.address?.street?.number?.toString()); // undefined
```

### De ! (of non-null assertion) operator

In TypeScript wordt de ! (non-null assertion) operator gebruikt om aan te geven dat een waarde zeker niet null of undefined zal zijn op het punt waar de operator wordt gebruikt, zelfs als de typechecker dat niet kan garanderen. Dit kan handig zijn in situaties waar je meer weet over de waarde dan TypeScript kan afleiden.

Stel dat je een functie hebt die een default user aanmaakt en returned:

```typescript
function getDefaultUser() : User {
    return {
        name: "Default",
        age: 0,
        address: {
            street: "Defaultstreet",
            number: 0,
            city: "Defaultcity"
        }
    }
}
```

Als we deze functie nu gebruiken en we willen de straat van de default user opvragen dan krijgen we een foutmelding:

```typescript
let defaultUser = getDefaultUser();
console.log(defaultUser.address.street); // Error: Object is possibly 'undefined'
```

Nochtans weten we met zekerheid dat de default user een adres heeft. We kunnen dit aangeven aan de hand van de ! operator:

```typescript
console.log(defaultUser.address!.street); // Defaultstreet
```

Let op dat je deze operator niet begint te gebruiken om fouten te verbergen. Je moet er zeker van zijn dat de waarde niet undefined of null kan zijn. Anders zal je een foutmelding krijgen op runtime. Gebruik hem dus niet om de compiler de mond te snoeren.

### Het `as` keyword

Het `as` keyword wordt gebruikt om TypeScript te vertellen dat een waarde een bepaald type heeft. Dit is nodig omdat TypeScript niet altijd weet welk type een waarde heeft. Dit is een zogenaamde type assertion. Opgelet: dit is geen type casting. Het verandert het type van de waarde niet. Het verandert alleen het type dat TypeScript denkt dat de waarde heeft.

```typescript
let data = "Hello World";
let data2 = data as string;
```

Dit is soms wel gevaarlijk om te gebruiken. Je moet er zeker van zijn dat de waarde wel degelijk het type heeft dat je aangeeft. Anders zal je een foutmelding krijgen op runtime.

```typescript
let data = "Hello World";
let data2 = data as number;

console.log(data2.toFixed(2)); 
```

Dit is gevaarlijk omdat we TypeScript vertellen dat `data2` het type `number` heeft, terwijl het in werkelijkheid het type `string` heeft. Als we nu een methode zouden gebruiken die alleen voor `number` beschikbaar is, dan krijgen we een foutmelding op runtime.


