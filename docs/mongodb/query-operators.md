# Query Operators

We hebben tot nu toe gezien dat je een object kan meegeven aan de `find` methode om te filteren. Dit object bevat de velden die je wil filteren en de waarden waarmee je wil filteren. Op dit moment gaven we enkel exacte waarden mee.

```typescript
const result = await collection.find({ name: "John" }).toArray();
```

In MongoDB kan je ook gebruik maken van query operators. Dit zijn speciale objecten die je kan meegeven aan de `find` methode om complexere queries uit te voeren.

## Vergelijkingen

We kunnen gebruik maken van de volgende query operators om vergelijkingen uit te voeren:

| Operator | Betekenis |
| --- | --- |
| `$eq` | Is gelijk aan |
| `$ne` | Is niet gelijk aan |
| `$gt` | Is groter dan |
| `$gte` | Is groter dan of gelijk aan |
| `$lt` | Is kleiner dan |
| `$lte` | Is kleiner dan of gelijk aan |
| `$in` | Is in een array |
| `$nin` | Is niet in een array |

Het gebruik ervan ziet er soms een beetje vreemd uit, maar het is eigenlijk heel eenvoudig. Je moet een object meegeven met als key de naam van het veld en als value een object met als key de operator en als value de waarde waarmee je wil vergelijken.

```typescript
const result = await collection.find({ age: { $gt: 18 } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `age` groter is dan 18.

```typescript
const result = await collection.find({ age: { $in: [18, 19, 20] } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `age` gelijk is aan 18, 19 of 20.

## Logische operatoren

Je kan ook gebruik maken van logische operatoren om meerdere voorwaarden te combineren. De volgende logische operatoren zijn beschikbaar:

| Operator | Betekenis |
| --- | --- |
| `$and` | Logische AND |
| `$or` | Logische OR |
| `$not` | Logische NOT |

Het gebruik ervan is gelijkaardig aan de vergelijkingsoperatoren. Je moet een object meegeven met als key de operator en als value een array van objecten die je wil combineren.

```typescript
const result = await collection.find({ $or: [{ age: { $gt: 18 } }, { name: "John" }] }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `age` groter is dan 18 of waarvan het veld `name` gelijk is aan "John".

```typescript
const result = await collection.find({ $and: [{ age: { $gt: 18 } }, { age: { $lt: 25 } }] }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `age` groter is dan 18 en kleiner dan 25. Dus alle documenten waarvan het veld `age` tussen 18 en 25 ligt.

```typescript
const result = await collection.find({ age: { $not: { $gt: 18 } } }).toArray();
```

Dit geeft alle documenten terug waarvan het veld `age` niet groter is dan 18. Dus alle documenten waarvan het veld `age` kleiner of gelijk is aan 18.