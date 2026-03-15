### Oefening: fake fetch

Maak een nieuw project aan met de naam `fake-fetch` waarin je jouw bronbestanden voor deze oefening kan plaatsen.

Vorm de onderstaande code om zodat het gebruik maakt van promises in plaats van callbacks. Daarna kan je de code omvormen zodat het gebruik maakt van **async/await** in plaats van promises.

```typescript
interface Callback &#123;
    (n: number): void
&#125;

const getRandom = (callback: Callback) => &#123;
    setTimeout(() => &#123;
        callback(Math.floor(Math.random() * 100))
    &#125;,1000);
&#125;

getRandom((n) => &#123;
    console.log(`The number was $&#123;n&#125;`);
&#125;);
```