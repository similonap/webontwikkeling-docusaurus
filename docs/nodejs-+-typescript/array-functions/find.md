---
hide_table_of_contents: true
---

# find

De `find` methode zal het eerste element van de array teruggeven waarvoor de callback functie `true` teruggeeft. Zodra een match gevonden is, stopt `find` meteen — de overige elementen worden niet meer bekeken.

import InteractiveFind from '@site/src/components/InteractiveFind';

<InteractiveFind />

Het type van `firstEven` is `number | undefined`. Dit komt omdat de `find` methode `undefined` zal teruggeven als er geen element is gevonden waarvoor de callback functie `true` teruggeeft. Zelfs als je zeker weet dat er altijd een element zal zijn dat voldoet aan de voorwaarde, moet je nog steeds `undefined` in overweging nemen.

```typescript
let names : string[] = ["Andie", "Bert", "Cedric"];

let firstD : string | undefined = names.find(name => name.startsWith("D"));

console.log(firstD); // undefined
```
