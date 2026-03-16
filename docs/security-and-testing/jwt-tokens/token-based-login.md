# Token Based Login

We zullen ons nu baseren op de Session Based Login en deze omvormen tot een JWT Token Based Login systeem. Het eerste wat we moeten doen is uiteraard het installeren van de nodige packages. We zullen de `jsonwebtoken` package gebruiken om JWTs te maken, verifiëren en decoderen. 

```bash
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

We gaan nu niet meer gebruik maken van sessies om de user bij te houden maar gaan deze opslaan in de JWT token. We zullen de JWT token opslaan in een cookie. Dit is een veiligere manier om de token op te slaan dan in local storage. Daarom moeten we ook de `cookie-parser` package installeren.

```bash
npm install cookie-parser
npm install --save-dev @types/cookie-parser
```

## JWT Token aanmaken

We zullen nu de JWT token aanmaken wanneer de user inlogt. We zullen de token opslaan in een cookie en deze terugsturen naar de client. In plaats van deze nu in de sessie op te slagen zullen we deze in de cookie opslagen.

Uiteraard moeten we de nodige imports doen:

```typescript
import * as jwt from 'jsonwebtoken';
```

en maken we de volgende aanpassing in de POST `/login` route:

```typescript
const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
```

We geven hier aan dat de cookie enkel via http kan worden uitgelezen, dat de cookie enkel kan worden uitgelezen door de site waar deze is aangemaakt en dat de cookie enkel kan worden uitgelezen als de site via https wordt bezocht. Ook geven we aan dat de token 7 dagen geldig is (zoals in het voorbeeld van de sessie).

We moeten de `JWT_SECRET` ook toevoegen aan de `.env` file:

```
JWT_SECRET=75b1c9c99a5167b61951d3bdfb56880e156d55d3795da78235b74ea495d0a6efccac596e182dfc9a8e116b54d663d122aaded48631be87aebbb2aa9dc5e09805009f2e2e9459f1ff7d8331e1a6746dd2d19437c98000194037309b8fe53591cd930c1d14e2a97b27e3444359c3a99b1da8e53842317514e628f93863419b9022
```

Deze moet je uiteraard zelf genereren. Bijvoorbeeld via `https://jwtsecret.com/generate`. Deze moet minimum 32 karakters lang zijn.

Vergeet ook niet de User uit het `session.ts` bestand te halen want deze gaan we niet meer gebruiken.

## JWT Token verifiëren

We moeten nu ook een aanpassing doen in de `secureMiddleware.ts` file. We gaan de JWT token verifiëren in plaats van de sessie te controleren. We zullen de token uit de cookie halen en deze verifiëren met de `jsonwebtoken` package.

```typescript
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.jwt;

    if (!token) {
        console.log("No token found, redirecting to login");
        return res.redirect("/login"); // or return a 401 Unauthorized response
    }
    
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.redirect("/login");
        } else {
            console.log(user);
            res.locals.user = user;
            next();
        }
    });
};
```

Om de jwt token te kunnen uitlezen moeten we de cookie parser middleware in de `index.ts` file nog instellen.

```typescript
app.use(cookieParser());
```

## JWT Token verwijderen

We moeten ook de JWT token verwijderen wanneer de user uitlogt. Dit doen we door de cookie te verwijderen.

```typescript
router.post("/logout", secureMiddleware, async (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
});
```

Hou er rekening mee dat in principe de JWT token blijft gelden tot de expiry date is bereikt. Het verwijderen van de cookie is enkel om de user uit te loggen. De token blijft geldig tot de expiry date is bereikt. Als de gebruiker deze zou kopieren en plakken in een andere browser dan zou deze nog steeds kunnen inloggen. Het is daarom belangrijk om de expiry date van de token niet te lang te maken.