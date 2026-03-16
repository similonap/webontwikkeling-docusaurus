### Pet Shelter

Maak een nieuw project aan met de naam `movies-db` en installeer de `mongodb` package. 

We beginnen met de volgende array:

```typescript
const pets : Pet[] = [
    { name: "Buddy", age: 2, type: "dog", breed: "Golden Retriever" },
    { name: "Daisy", age: 3, type: "dog", breed: "Beagle" },
    { name: "Coco", age: 1, type: "dog", breed: "Poodle" },
    { name: "Charlie", age: 2, type: "cat", breed: "Siamese" },
    { name: "Luna", age: 3, type: "cat", breed: "Persian" },
    { name: "Lucy", age: 1, type: "cat", breed: "Maine Coon" },
    { name: "Max", age: 4, type: "dog", breed: "Labrador Retriever" },
    { name: "Bella", age: 2, type: "dog", breed: "French Bulldog" },
    { name: "Milo", age: 1, type: "dog", breed: "Border Collie" },
    { name: "Oliver", age: 3, type: "cat", breed: "Bengal" },
    { name: "Tiger", age: 2, type: "cat", breed: "Ragdoll" },
    { name: "Zoe", age: 3, type: "cat", breed: "Sphynx" },
    { name: "Sophie", age: 5, type: "dog", breed: "Dachshund" },
    { name: "Lily", age: 1, type: "cat", breed: "British Shorthair" },
    { name: "Oscar", age: 4, type: "dog", breed: "Boxer" },
    { name: "Ruby", age: 2, type: "dog", breed: "Siberian Husky" },
    { name: "Rosie", age: 2, type: "cat", breed: "Scottish Fold" },
    { name: "Jack", age: 3, type: "dog", breed: "Cocker Spaniel" },
    { name: "Sadie", age: 2, type: "dog", breed: "Rottweiler" },
    { name: "Maggie", age: 1, type: "dog", breed: "Shih Tzu" }
];
```

#### Functionaliteit

Zorg ervoor dat de applicatie de volgende queries uitvoert:
- Verwijder alle documenten uit de collection `pets`
- Voeg alle pets (de bovenstaande array) toe aan de collection `pets`
- Zoek alle pets in de collection van het type "dog" en toon deze in de console
- Zoek alle pets in de collection van het type "dog" of "cat" en toon deze in de console. Gebruik hiervoor de `$in` operator.
- Zoek alle pets in de collection van het type "dog" of "cat" en toon deze in de console. Gebruik hiervoor de `$or` operator.
- Zoek alle pets in de collection die tussen 2 en 4 jaar oud zijn en toon deze in de console. Gebruik hiervoor de `$gte` en `$lte` operators.
- Zoek alle pets in de collection die "Retriever" in hun ras hebben en toon deze in de console. Gebruik hiervoor de `$text` operator.
- Sorteer alle pets op leeftijd in oplopende volgorde en toon deze in de console.
- Sorteer alle pets op naam in aflopende volgorde en toon deze in de console.
- Sorteer alle pets op leeftijd in aflopende volgorde en toon enkel de oudste pet in de console.
- Sorteer alle pets op leeftijd in oplopende volgorde, sla de eerste 5 pets over en toon enkel de 6de tot 10de jongste pets in de console.

#### Voorbeeld interactie

```bash
All pets in the collection of the type 'dog': 
Buddy     dog       Golden Retriever    2                   
Daisy     dog       Beagle              3                   
Coco      dog       Poodle              1                   
Max       dog       Labrador Retriever  4                   
Bella     dog       French Bulldog      2                   
Milo      dog       Border Collie       1                   
Sophie    dog       Dachshund           5                   
Oscar     dog       Boxer               4                   
Ruby      dog       Siberian Husky      2                   
Jack      dog       Cocker Spaniel      3                   
Sadie     dog       Rottweiler          2                   
Maggie    dog       Shih Tzu            1                   
All pets in the collection of the type 'dog' or 'cat': 
Buddy     dog       Golden Retriever    2                   
Daisy     dog       Beagle              3                   
Coco      dog       Poodle              1                   
Charlie   cat       Siamese             2                   
Luna      cat       Persian             3                   
Lucy      cat       Maine Coon          1                   
Max       dog       Labrador Retriever  4                   
Bella     dog       French Bulldog      2                   
Milo      dog       Border Collie       1                   
Oliver    cat       Bengal              3                   
Tiger     cat       Ragdoll             2                   
Zoe       cat       Sphynx              3                   
Sophie    dog       Dachshund           5                   
Lily      cat       British Shorthair   1                   
Oscar     dog       Boxer               4                   
Ruby      dog       Siberian Husky      2                   
Rosie     cat       Scottish Fold       2                   
Jack      dog       Cocker Spaniel      3                   
Sadie     dog       Rottweiler          2                   
Maggie    dog       Shih Tzu            1                   
All pets in the collection of the type 'dog' or 'cat': 
Buddy     dog       Golden Retriever    2                   
Daisy     dog       Beagle              3                   
Coco      dog       Poodle              1                   
Charlie   cat       Siamese             2                   
Luna      cat       Persian             3                   
Lucy      cat       Maine Coon          1                   
Max       dog       Labrador Retriever  4                   
Bella     dog       French Bulldog      2                   
Milo      dog       Border Collie       1                   
Oliver    cat       Bengal              3                   
Tiger     cat       Ragdoll             2                   
Zoe       cat       Sphynx              3                   
Sophie    dog       Dachshund           5                   
Lily      cat       British Shorthair   1                   
Oscar     dog       Boxer               4                   
Ruby      dog       Siberian Husky      2                   
Rosie     cat       Scottish Fold       2                   
Jack      dog       Cocker Spaniel      3                   
Sadie     dog       Rottweiler          2                   
Maggie    dog       Shih Tzu            1                   
All pets in the collection that are between 2 and 4 years old: 
Buddy     dog       Golden Retriever    2                   
Daisy     dog       Beagle              3                   
Charlie   cat       Siamese             2                   
Luna      cat       Persian             3                   
Max       dog       Labrador Retriever  4                   
Bella     dog       French Bulldog      2                   
Oliver    cat       Bengal              3                   
Tiger     cat       Ragdoll             2                   
Zoe       cat       Sphynx              3                   
Oscar     dog       Boxer               4                   
Ruby      dog       Siberian Husky      2                   
Rosie     cat       Scottish Fold       2                   
Jack      dog       Cocker Spaniel      3                   
Sadie     dog       Rottweiler          2                   
All pets that have 'Retriever' in their breed: 
Max       dog       Labrador Retriever  4                   
Buddy     dog       Golden Retriever    2                   
All pets sorted by age in ascending order: 
Coco      dog       Poodle              1                   
Lucy      cat       Maine Coon          1                   
Milo      dog       Border Collie       1                   
Lily      cat       British Shorthair   1                   
Maggie    dog       Shih Tzu            1                   
Buddy     dog       Golden Retriever    2                   
Charlie   cat       Siamese             2                   
Bella     dog       French Bulldog      2                   
Tiger     cat       Ragdoll             2                   
Ruby      dog       Siberian Husky      2                   
Rosie     cat       Scottish Fold       2                   
Sadie     dog       Rottweiler          2                   
Daisy     dog       Beagle              3                   
Luna      cat       Persian             3                   
Oliver    cat       Bengal              3                   
Zoe       cat       Sphynx              3                   
Jack      dog       Cocker Spaniel      3                   
Max       dog       Labrador Retriever  4                   
Oscar     dog       Boxer               4                   
Sophie    dog       Dachshund           5                   
All pets sorted by name in descending order: 
Zoe       cat       Sphynx              3                   
Tiger     cat       Ragdoll             2                   
Sophie    dog       Dachshund           5                   
Sadie     dog       Rottweiler          2                   
Ruby      dog       Siberian Husky      2                   
Rosie     cat       Scottish Fold       2                   
Oscar     dog       Boxer               4                   
Oliver    cat       Bengal              3                   
Milo      dog       Border Collie       1                   
Max       dog       Labrador Retriever  4                   
Maggie    dog       Shih Tzu            1                   
Luna      cat       Persian             3                   
Lucy      cat       Maine Coon          1                   
Lily      cat       British Shorthair   1                   
Jack      dog       Cocker Spaniel      3                   
Daisy     dog       Beagle              3                   
Coco      dog       Poodle              1                   
Charlie   cat       Siamese             2                   
Buddy     dog       Golden Retriever    2                   
Bella     dog       French Bulldog      2                   
The oldest pet in the collection: 
Sophie    dog       Dachshund           5                   
The 6th to 10th youngest pets in the collection: 
Charlie   cat       Siamese             2                   
Bella     dog       French Bulldog      2                   
Rosie     cat       Scottish Fold       2                   
Ruby      dog       Siberian Husky      2                   
Tiger     cat       Ragdoll             2   
```