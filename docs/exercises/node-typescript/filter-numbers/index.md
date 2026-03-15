### Oefening: Filter Numbers

Maak een nieuw project aan met de naam `filter-numbers`.

#### Deel 1

Schrijf een functie `filterPositive` die een array van getallen als parameter verwacht. De functie `filterPositive` moet een nieuwe array teruggeven met enkel de positieve getallen uit de array die als parameter werd meegegeven. Deze functie **MOET** aan de hand van een **`for`-loop** geschreven worden en mag **geen** gebruik maken van de **ingebouwde functie `filter` van een array**.

Roep de functie `filterPositive` aan met de volgende array als parameter:

```typescript
const numbers: number[] = [-4,-4,1,2,3,4,5];
console.log(filterPositive(numbers)); // 1,2,3,4,5
```

#### Deel 2

Schrijf een functie `filterNegative` die een array van getallen als parameter verwacht. De functie `filterNegative` moet een nieuwe array teruggeven met enkel de negatieve getallen uit de array die als parameter werd meegegeven.

Roep de functie `filterNegative` aan met de volgende array als parameter:

```typescript
const numbers: number[] = [-4,-4,1,2,3,4,5];
console.log(filterNegative(numbers)); // -4,-4
```

#### Deel 3

Schrijf een functie `filterEven` die een array van getallen als parameter verwacht. De functie `filterEven` moet een nieuwe array teruggeven met enkel de even getallen uit de array die als parameter werd meegegeven.

Roep de functie `filterEven` aan met de volgende array als parameter:

```typescript
const numbers: number[] = [-4,-4,1,2,3,4,5];
console.log(filterEven(numbers)); // -4,-4,2,4
```

#### Deel 4

Schrijf nu een functie `filter` die een array van getallen als eerste parameter verwacht en een functie als tweede parameter. De functie `filter` moet een nieuwe array teruggeven met enkel de getallen uit de array die als eerste parameter werd meegegeven waarvoor de functie die als tweede parameter werd meegegeven `true` teruggeeft.

Herschrijf de functies `filterPositive`, `filterNegative` en `filterEven` door gebruik te maken van de functie `filter`.

Voorbeeld van gebruik:

```typescript
const numbers: number[] = [-4,-4,1,2,3,4,5];
const isPositive = (number: number) => number >= 0;
console.log(filter(numbers, isPositive)); // 1,2,3,4,5
```