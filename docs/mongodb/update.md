# Update

In deze sectie gaan we dieper in op het updaten van documenten in een MongoDB database. We gaan er weer vanuit dat we een collection hebben met de naam `students`.

```typescript
const collection : Collection&lt;Student> = client.db("school").collection&lt;Student>("students");
```

## Update

Je kan de `updateOne` methode gebruiken om een document te updaten. Je moet een filter meegeven om het document te selecteren dat je wil updaten en een object met de nieuwe waarden. 

```typescript
const result = await collection.updateOne(&#123; name: "John" &#125;, &#123; $set: &#123; age: 20 &#125; &#125;);
```

Dit zal het eerste document met de naam "John" updaten zodat de leeftijd 20 is. Als je meerdere documenten wil updaten, dan kan je de `updateMany` methode gebruiken. 

```typescript
const result = await collection.updateMany(&#123; age: &#123; $lt: 18 &#125; &#125;, &#123; $set: &#123; age: 18 &#125; &#125;);
```

Dit zal alle documenten updaten waarvan de leeftijd kleiner is dan 18 zodat de leeftijd 18 is.

## Upsert

Soms wil je een document updaten als het bestaat, maar aanmaken als het niet bestaat. Je kan de `upsert` optie meegeven aan de `updateOne` methode om dit te doen. Upsert staat voor de combinatie van update en insert.

```typescript
const result = await collection.updateOne(&#123; name: "John" &#125;, &#123; $set: &#123; age: 20 &#125; &#125;, &#123;upsert: true&#125; );
```

Dit zal het document met de naam "John" updaten als het bestaat, maar aanmaken als het niet bestaat.