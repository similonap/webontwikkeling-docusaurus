---
hide_table_of_contents: true
---

# filter

De `filter` methode zal een nieuwe array teruggeven waarbij alleen de elementen van de originele array worden behouden waarvoor de callback functie `true` teruggeeft.


import InteractiveFilter from '@site/src/components/InteractiveFilter';

<InteractiveFilter />

Ook hier kan je het type van `element` expliciet aangeven.

```typescript
let even : number[] = numbers.filter((element: number) => element % 2 === 0);
```
