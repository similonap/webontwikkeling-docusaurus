---
hide_table_of_contents: true
---

# Array.filter()

De `filter` methode zal een nieuwe array teruggeven waarbij alleen de elementen van de originele array worden behouden waarvoor de callback functie `true` teruggeeft.


import InteractiveFilter from '@site/src/components/InteractiveFilter';
import InteractiveFilterDedup from '@site/src/components/InteractiveFilterDedup';
import Quiz from '@site/src/components/Quiz';

<InteractiveFilter />

Ook hier kan je het type van `element` expliciet aangeven.

```typescript
let even : number[] = numbers.filter((element: number) => element % 2 === 0);
```

## Elementen "verwijderen" met filter

`filter` past de originele array nooit aan, maar geeft een **nieuwe** array terug. Net daarom kan je `filter` gebruiken om elementen te "verwijderen": in plaats van een element echt weg te halen, behoud je gewoon *alle elementen behalve* het element dat je niet meer wil. Je draait de voorwaarde dus om.

Wil je bijvoorbeeld het getal `3` verwijderen uit een lijst, dan behoud je alle getallen die **niet** gelijk zijn aan `3`:

```typescript
let numbers : number[] = [1, 2, 3, 4, 3, 5];

let zonderDrie : number[] = numbers.filter((n) => n !== 3);

console.log(zonderDrie); // [1, 2, 4, 5]
console.log(numbers);    // [1, 2, 3, 4, 3, 5] -> de originele array is ongewijzigd!
```

Merk op dat *alle* voorkomens van `3` verdwijnen, want voor elk element wordt de voorwaarde getest.

Omdat de originele array niet wordt aangepast, wil je het resultaat meestal terug toekennen. Als je je array met `let` hebt gedeclareerd, kan je ze gewoon overschrijven met de nieuwe (kortere) array:

```typescript
let numbers : number[] = [1, 2, 3, 4, 3, 5];

numbers = numbers.filter((n) => n !== 3);

console.log(numbers); // [1, 2, 4, 5]
```

Dit werkt natuurlijk ook met objecten. Stel dat je een gebruiker met een bepaald `id` wil verwijderen uit een lijst. Omdat je dit waarschijnlijk op meerdere plaatsen nodig hebt, steek je deze logica best in een functie. De functie krijgt de lijst en het `id` mee, en geeft een nieuwe lijst terug zonder de gebruiker met dat `id`:

```typescript
interface User {
    id: number;
    name: string;
}

function removeUser(users : User[], id : number) : User[] {
    return users.filter((user) => user.id !== id);
}

let users : User[] = [
    { id: 1, name: "Andie" },
    { id: 2, name: "Debbie" },
    { id: 3, name: "Charlie" }
];

// Verwijder de gebruiker met id 2
users = removeUser(users, 2);

console.log(users);
// [ { id: 1, name: "Andie" }, { id: 3, name: "Charlie" } ]
```

Merk op dat we het resultaat van `removeUser` terug toekennen aan `users`. De functie zelf verandert de originele array niet; ze geeft enkel een nieuwe array terug.

:::tip
Onthoud het verschil met `splice`: `splice` verandert de originele array (mutatie), terwijl `filter` een nieuwe array teruggeeft en de originele met rust laat. Het werken met nieuwe arrays in plaats van de originele aan te passen, maakt je code voorspelbaarder en minder foutgevoelig.
:::

## Dubbele elementen verwijderen

De callback-functie van `filter` krijgt naast het element zelf nog een **tweede parameter** mee: de `index`. Dat is het rangnummer van het element waar je op dat moment bent, beginnend bij `0`. Je kan deze parameter gebruiken om dubbele waarden uit een array te verwijderen.

Het idee is eenvoudig: we behouden enkel het element als zijn eigen `index` gelijk is aan de index van de **eerste** keer dat die waarde voorkomt. Die eerste positie vinden we met `indexOf`. Voor een dubbele waarde zal `indexOf` immers de positie van het eerste voorkomen teruggeven, en die is niet gelijk aan de huidige `index`.

```typescript
let numbers : number[] = [3, 1, 3, 2, 1];

let uniek : number[] = numbers.filter((value, index) => numbers.indexOf(value) === index);

console.log(uniek); // [3, 1, 2]
```

Voor het tweede getal `3` (op index 2) geeft `numbers.indexOf(3)` de waarde `0` terug (de eerste `3`). Omdat `0 !== 2` wordt deze `3` weggelaten. Zo blijven enkel de eerste voorkomens over.

In het onderstaande component kan je stap voor stap zien hoe elk element zijn `index` vergelijkt met `numbers.indexOf(value)`:

<InteractiveFilterDedup />

## Test je kennis

<Quiz url="/quizzes/filter.json" />
