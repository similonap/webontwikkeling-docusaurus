---
hide_table_of_contents: true
---

# Array.map()

De `map` functie stelt je in staat om elk item in een lijst (array) te pakken, er iets mee te doen, en de resultaten in een nieuwe lijst te stoppen. In plaats van een ouderwetse for-loop te schrijven waarbij je handmatig een nieuwe lijst moet bijhouden, doet `map()` al het zware werk voor je. Het houdt je code kort, leesbaar en "clean".

import InteractiveMap from '@site/src/components/InteractiveMap';
import InteractiveMapStudents from '@site/src/components/InteractiveMapStudents';
import InteractiveMapIndex from '@site/src/components/InteractiveMapIndex';

<InteractiveMap />

De map functie wordt ook vaak gebruikt om een array van objecten om te zetten naar een array van 1 van zijn properties. Bijvoorbeeld als je een array van studenten hebt en je wil alleen een array van de namen van de studenten hebben:

<InteractiveMapStudents />

Soms heb je aan alleen het item zelf niet genoeg en wil je ook weten op welke plek in de lijst je bent. De callback-functie van map() geeft je standaard een tweede parameter mee: de index.

De index is het rangnummer van het item waar je op dat moment bent, beginnend bij 0. Dit is bijvoorbeeld ideaal voor het nummeren van een lijst of wanneer je om de beurt een andere styling wilt toepassen.

```typescript
const taken = ["Afwassen", "Stofzuigen", "Gras maaien"];

const genummerdeTaken = taken.map((taak, index) => {
  return `Taak ${index + 1}: ${taak}`;
});

console.log(genummerdeTaken.join("\n"));
// Output: ["Taak 1: Afwassen", "Taak 2: Stofzuigen", "Taak 3: Gras maaien"]
```

<InteractiveMapIndex />