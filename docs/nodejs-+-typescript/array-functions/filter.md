# filter

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
