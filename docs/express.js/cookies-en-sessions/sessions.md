# Sessions

#### Wat zijn Sessions in Express?

Een sessie in Express is een manier om gegevens op te slaan die uniek zijn voor een bepaalde gebruiker en toegankelijk zijn over verschillende verzoeken heen. Dit wordt mogelijk gemaakt door sessie-identificatoren, meestal opgeslagen in cookies aan de clientzijde. Aan de serverzijde wordt de sessie-informatie zelf opgeslagen. Wanneer een verzoek met een sessie-ID de server bereikt, zoekt de server in zijn geheugen of databank naar de bijbehorende sessie en laadt de relevante gegevens.

#### Session Cookies

Session cookies bevatten een uniek sessie-ID waarmee de server de sessiegegevens van de gebruiker kan ophalen voor elk verzoek. Deze cookies zijn essentieel voor functionaliteiten zoals authenticatie, winkelwagentjes in e-commerce, en gepersonaliseerde gebruikerservaringen.

#### OWASP en Session Management

Volgens OWASP-richtlijnen is goed sessiebeheer cruciaal voor de beveiliging van webapplicaties. Het beschermt tegen aanvallen zoals sessie-hijacking en Cross-Site Request Forgery (CSRF). Goede praktijken omvatten het gebruik van sterke sessie-identificatoren, HTTPS voor het verzenden van cookies, en het instellen van vervaldata voor sessiecookies.

#### Voorbeeld in TypeScript

Laten we kijken naar een eenvoudig voorbeeld van het implementeren van sessies in een Express-applicatie met TypeScript:

#### 1. Installatie van benodigdheden:

Eerst moeten we de nodige pakketten installeren: `npm i --save express-session --save-dev @types/express-session`

#### 2. Sessie configureren

In Express moeten we de sessie configureren:

```typescript
import express from 'express';
import session from 'express-session';

const app = express();

app.use(session({
  secret: 'uw geheime sleutel',
  resave: false, // hangt af van de situatie, hover over de parameter voor details
  saveUninitialized: false, // zelfde opmerking
  cookie: { secure: false } // zelfde opmerking
}));

app.listen(3000, () => {
  console.log('Server draait op poort 3000');
});

```

#### Sessie gebruiken

Eens de sessie geconfigureerd is, kunnen we properties instellen en uitlezen via `req.session`. In TypeScript vereist dit wel dat we extra properties toevoegen aan de interface van een sessie.

```typescript
declare module 'express-session' {
  export interface SessionData {
    // ENKEL VOOR DIT VOORBEELD - gebruik naam en datatype naar keuze
    // session properties mogen bv. ook objecten zijn
    userId: string
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // zelf doen: gebruiker verifiëren via database request
  if (gebruikerIsValid) {
    req.session.userId = gebruikersId;
    res.send('Succesvol ingelogd');
  } else {
    res.send('Login mislukt');
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.userId) {
    res.send('Welkom op uw dashboard');
  } else {
    res.redirect('/login');
  }
});
```

### Sessies manueel opslaan

Normaal gezien wordt een sessie vanzelf bijgewerkt wanneer je een `Response` terugstuurt, maar hier zijn uitzonderingen op, onder meer in het geval van redirects. Wanneer je een sessie manueel wil opslaan, roep je `req.session.save` op, met als argument een callback die uitgevoerd wordt na het saven.

Bijvoorbeeld:



```typescript
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // zelf doen: gebruiker verifiëren via database request
  if (gebruikerIsValid) {
    req.session.userId = gebruikersId;
    req.session.save(() => res.redirect("/"));
  } else {
    res.send('Login mislukt');
  }
});
```

### Session stores

De inhoud van de sessie wordt langs de serverzijde opgeslagen. Dit impliceert dat, met bovenstaande code, sessies geen herstart van de server kunnen overleven, want er is nergens een opslagmechanisme vermeld.

Het defaultmechanisme van `express-session` is een "in-memory store", dus tijdelijke opslag. Voor ontwikkeling en debugging kan dit handig zijn. In productie gebruik je een "session store". Allerlei databanken, onder meer MySQL, MongoDB, Neo4j, Redis,... kunnen deze taak vervullen. Je vindt [hier](https://www.npmjs.com/package/express-session#compatible-session-stores) een lijst met compatibele session stores. Op de pagina van elke store staan ook instructies om die store te koppelen.

### Session hijacking

Session hijacking is een vorm van cyberaanval waarbij een aanvaller de sessie van een gebruiker overneemt om ongeautoriseerde toegang tot een webapplicatie of website te krijgen. Dit wordt meestal gedaan door de sessie-ID (session token) te stelen, die wordt gebruikt om de gebruiker tijdens een sessie te authenticeren.

In een typische webapplicatie worden gebruikers geauthenticeerd bij het inloggen, waarna een unieke sessie-ID wordt gecreëerd en opgeslagen in een cookie in de browser van de gebruiker. Deze ID wordt bij elk verzoek aan de server meegestuurd om de gebruiker te identificeren. Als een aanvaller deze sessie-ID in handen krijgt, kunnen ze zich voordoen als de legitieme gebruiker en toegang krijgen tot gevoelige informatie of functies binnen de applicatie.

Session hijacking kan op verschillende manieren plaatsvinden, waaronder:

* **Onderscheppen van onbeveiligde Communicatie:** Als de communicatie tussen de gebruiker en de website niet goed beveiligd is (bijvoorbeeld via HTTPS), kan de sessie-ID onderschept worden.
* **Cross-Site Scripting (XSS) Aanvallen:** Als een website kwetsbaar is voor XSS-aanvallen, kan kwaadaardige code worden gebruikt om de sessie-ID te stelen.
* **Phishing:** Misleidende technieken kunnen gebruikers ertoe brengen hun sessiegegevens op een frauduleuze website in te voeren.

De `HttpOnly` en `Secure` attributen op cookies bieden hier bescherming tegen. Het is ook een goed idee sessie-ID's tijdig te laten vervallen (vandaar dat je regelmatig opnieuw moet inloggen op websites waar je reeds eerder was ingelogd).
