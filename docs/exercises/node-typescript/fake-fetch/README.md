### Oefening: fake fetch

Maak een nieuw project aan met de naam `fake-fetch` waarin je jouw bronbestanden voor deze oefening kan plaatsen.

Vorm de onderstaande code om zodat het gebruik maakt van promises in plaats van callbacks. Daarna kan je de code omvormen zodat het gebruik maakt van **async/await** in plaats van promises.

```typescript
interface Callback {
    (n: number): void
}

const getRandom = (callback: Callback) => {
    setTimeout(() => {
        callback(Math.floor(Math.random() * 100))
    },1000);
}

getRandom((n) => {
    console.log(`The number was ${n}`);
});
```