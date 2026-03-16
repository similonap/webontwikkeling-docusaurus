# Fetch

Net zoals in de browser is het mogelijk om in Node.js een HTTP request te doen naar een andere server. Dit doe je met de `fetch` functie. Deze functie heeft als argument een URL. De functie geeft een Promise terug die een Response object bevat. Dit object bevat de data die je terugkrijgt van de server. In TypeScript is het wel belangrijk dat je het type van de data opgeeft die je verwacht terug te krijgen. Je moet dus een interface voorzien die de data beschrijft. 

De syntax is grotendeels hetzelfde als in JavaScript. Het enige verschil is dat je het type van de data moet opgeven. 

## Interface

We gaan in dit voorbeeld gebruik maken van de [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API. Deze API bevat een aantal endpoints die je kan gebruiken om data op te halen. We gaan in dit voorbeeld gebruik maken van de `/posts` endpoint. Deze endpoint geeft een lijst van gebruikers terug. 

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  ...
  {
    "userId": 10,
    "id": 100,
    "title": "at nam consequatur ea labore ea harum",
    "body": "cupiditate quo est a modi nesciunt soluta\nipsa voluptas error itaque dicta in\nautem qui minus magnam et distinctio eum\naccusamus ratione error aut"
  }
]
```

Het eerste wat je moet doen is een interface maken die de data beschrijft die je verwacht terug te krijgen. In dit geval is dit een array van objecten. Elk object heeft een userId, id, title en body property. De userId en id property zijn van het type number. De title en body property zijn van het type string. 

```typescript
interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
```

Je kan deze interface zelf maken, maar je kan ook gebruik maken van een tool zoals [QuickType](https://app.quicktype.io/) om deze automatisch te genereren. Zorg vooral dat de interface correct is en overeenkomt met de data die je verwacht terug te krijgen.

### Fetch

Nu kunnen we de fetch functie gebruiken om de data op te halen. We geven als argument de URL van de endpoint mee. Omdat de fetch functie een Promise teruggeeft, kunnen we de then functie gebruiken om de data te gebruiken. Omdat over het algemeen de data die je terugkrijgt van een server een JSON object is, moeten we de data eerst omzetten naar een JavaScript object. Dit doen we met de `json` functie. Deze functie geeft ook een Promise terug. We kunnen dus de then functie gebruiken om de data te gebruiken. 

Stel dat we de titel van de eerste post willen loggen naar de console. We kunnen dit doen met de volgende code:

```typescript
fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((response: Post[]) => {
        console.log(response[0].title);
    }).catch((error) => {
        console.log(error);
    });
```

of met async en await:

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts : Post[] = await response.json();
        console.log(posts[0].title);
    } catch (error: any) {
        console.log(error);
    }
})();
```

Let op dat een API niet altijd een array teruggeeft. Het kan ook een object zijn dat op zijn beurt weer een array bevat. Je moet dus altijd controleren wat de data is die je terugkrijgt. 

## Error afhandelen

De catch functie is nodig om een error af te handelen. Onder een errors vallen alleen errors die veroorzaakt worden op netwerk niveau. Dus bijvoorbeeld als de server niet bereikbaar is of als de URL niet bestaat. 

Als je toch een error wil afhandelen die veroorzaakt wordt door een fout in de code van de server, dan moet je de status code van de response controleren. Als de status code 2xx is, dan is er geen error. Als de status code iets anders is, dan is er een error.

```typescript
fetch('https://jsonplaceholder.typicode.com/posts/123')
    .then(r => {
        if (!r.ok) throw new Error(r.status)
        return r.json()
    })
    .then(r => console.log(r))
    .catch(e => console.log(e));
```

We kijken hier na of de status code niet 2xx is aan de hand van de `ok` property. Deze property is `true` als de status code 2xx is. Als de status code niet 2xx is, dan gooien we een error.

Deze code is ook weer sterk te vereenvoudigen met async en await:

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/123');
        if (!response.ok) throw new Error(response.status);
        const posts : Post[] = await response.json();
        console.log(posts[0].title);
    } catch (error: any) {
        console.log(error);
    }
})();
```

Je kan ook de `status` property gebruiken om de status code op te vragen. Deze property bevat een nummer. 

```typescript
(async function () {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/123');
        
        if (response.status === 404) throw new Error('Not found');
        if (response.status === 500) throw new Error('Internal server error');

        const posts : Post[] = await response.json();
        console.log(posts[0].title);
    } catch (error: any) {
        console.log(error);
    }
})();
```