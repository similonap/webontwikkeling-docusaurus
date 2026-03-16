# Delete

In deze sectie gaan we leren hoe we data kunnen verwijderen uit een MongoDB database.

Er zijn twee methodes om data te verwijderen: `deleteOne` en `deleteMany`. Die werken op dezelfde manier als de `updateOne` en `updateMany` methodes.

## DeleteOne

Je kan de `deleteOne` methode gebruiken om een document te verwijderen. Je moet een filter meegeven om het document te selecteren dat je wil verwijderen.

```typescript
const result = await collection.deleteOne({ name: "John" });
```

Dit zal het eerste document met de naam "John" verwijderen.

## DeleteMany

Je kan de `deleteMany` methode gebruiken om meerdere documenten te verwijderen. Je moet een filter meegeven om de documenten te selecteren die je wil verwijderen.

```typescript
const result = await collection.deleteMany({ age: { $lt: 18 } });
```

Dit zal alle documenten verwijderen waarvan de leeftijd kleiner is dan 18. Je ziet dat we hier ook gebruik maken van query operators om de filter te maken. 

Je kan ook de `deleteMany` methode gebruiken zonder filter om alle documenten in de collectie te verwijderen.

```typescript
const result = await collection.deleteMany({});
```

Dit zal alle documenten in de collectie verwijderen. Dit is handig om te gebruiken in testen, maar wees voorzichtig in productie.