# Extra voorbeelden

Dit onderdeel bevat een aantal extra voorbeelden van asynchroon programmeren in TypeScript. Deze voorbeelden zijn niet noodzakelijk om te kennen, maar kunnen je wel helpen om een beter inzicht te krijgen in asynchroon programmeren en het omgaan met complexere situaties.

## fetch met paging

We gaan nu een iets complexer voorbeeld bekijken. We gaan deze keer eens de `https://reqres.in/api/users` API gebruiken. Als je naar de response kijkt, dan zie je dat deze geen array teruggeeft, maar een object. Dit object bevat een array met de key `data` en ook een andere properties zoals `page`, `per_page`, `total` en `total_pages`. Het data object bevat een array van gebruikers. 

Hier kan je de volgende interface voor gebruiken:

```typescript
interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
}

interface RootObject {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: User[];
}
```

We gaan nu de gebruikers ophalen en de gebruikers te loggen naar de console. 

```typescript
async function main() {
    try {
        const response = await fetch('https://reqres.in/api/users');
        if (!response.ok) throw new Error(response.statusText);
        const users : RootObject = await response.json();
        for (const user of users.data) {
            console.log(user.first_name);
        }
    } catch (error: any) {
        console.log(error);
    }
};
main();
```

Merk op dat we hier wel geen rekening hebben gehouden met de pagina's. Als je naar de response kijkt zie je dat hier een `page` property in zit. Deze property geeft aan op welke pagina je zit. Als je naar de URL kijkt, dan zie je dat er een `page` query parameter in zit. Deze parameter geeft aan op welke pagina je zit. Als je deze parameter aanpast, dan krijg je een andere pagina terug. Je zou hier dus een loop kunnen maken die alle pagina's afgaat. 

```typescript
async function main() {
    try {
        let page : number = 1;
        let total_pages : number = 1;

        while (page <= total_pages) {
            const response = await fetch("https://reqres.in/api/users?page=" + page);
            if (!response.ok) throw new Error(response.statusText);
            const root : RootObject = await response.json();
            total_pages = root.total_pages;
            console.log("Page " + page);
            for (const user of root.data) {
                console.log(user.first_name);
            }
            page++;
        }
    } catch (error: any) {
        console.log(error);
    }
};
main();
```

Let wel op dat elk paging systeem anders is. Je moet dus altijd controleren hoe het paging systeem werkt.