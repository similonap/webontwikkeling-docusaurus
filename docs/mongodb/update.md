# Update

In deze sectie gaan we dieper in op het updaten van documenten in een MongoDB database. We gaan er weer vanuit dat we een collection hebben met de naam `students`.

```typescript
const collection : Collection<Student> = client.db("school").collection<Student>("students");
```

## Update

Je kan de `updateOne` methode gebruiken om een document te updaten. Je moet een filter meegeven om het document te selecteren dat je wil updaten en een object met de nieuwe waarden. 

```typescript
const result = await collection.updateOne({ name: "John" }, { $set: { age: 20 } });
```

Dit zal het eerste document met de naam "John" updaten zodat de leeftijd 20 is. Als je meerdere documenten wil updaten, dan kan je de `updateMany` methode gebruiken. 

```typescript
const result = await collection.updateMany({ age: { $lt: 18 } }, { $set: { age: 18 } });
```

Dit zal alle documenten updaten waarvan de leeftijd kleiner is dan 18 zodat de leeftijd 18 is.

## Upsert

Soms wil je een document updaten als het bestaat, maar aanmaken als het niet bestaat. Je kan de `upsert` optie meegeven aan de `updateOne` methode om dit te doen. Upsert staat voor de combinatie van update en insert.

```typescript
const result = await collection.updateOne({ name: "John" }, { $set: { age: 20 } }, {upsert: true} );
```

Dit zal het document met de naam "John" updaten als het bestaat, maar aanmaken als het niet bestaat.