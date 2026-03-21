# map

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
