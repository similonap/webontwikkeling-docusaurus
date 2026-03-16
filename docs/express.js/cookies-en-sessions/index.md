# Cookies en sessions

### Wat zijn Cookies?

Cookies zijn kleine stukjes data die door een webserver worden verstuurd naar de gebruikersbrowser en daar opgeslagen worden. Bij elk volgend verzoek aan dezelfde server, stuurt de browser deze cookies mee, waardoor de server de gebruiker kan herkennen of data kan herstellen van eerdere sessies. **Cookies zijn dus bedoeld om data in de browser van de gebruiker op te slaan, maar kunnen mee opgestuurd worden met een HTTP request.**

#### Gebruik van Cookies in Express

In een Express-applicatie kan je cookies gebruiken voor diverse doeleinden, zoals het bijhouden van gebruikerssessies, het opslaan van gebruikersvoorkeuren, of het tracken van gebruikersgedrag.

#### Installatie van cookie-parser

Om in Express gebruik te maken van cookies, wordt meestal de `cookie-parser` middleware gebruikt. Je installeert deze met `npm install --save cookie-parser --save-dev @types/cookie-parser`.

Toevoegen van de middleware gebeurt op de gewoonlijke manier:

```typescript
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

```

Om cookies daadwerkelijk in actie te zien, moet je ze instellen via een response en ophalen uit een request:

```typescript
app.get('/set-cookie', (req, res) => {
  res.cookie('voorbeeld', 'Hallo Wereld', { maxAge: 900000, httpOnly: true });
  res.send('Cookie is ingesteld');
});

app.get('/remove-cookie', (req, res) => {
  res.clearCookie('voorbeeld');
  res.send('Cookie is verwijderd.');
});

app.get('/get-cookie', (req, res) => {
  const cookie = req.cookies.voorbeeld;
  res.send(`Cookie ontvangen: ${cookie}`);
});

```

### Belangrijke eigenschappen van cookies

**HttpOnly**

De `HttpOnly` vlag in een cookie zorgt ervoor dat de cookie alleen via HTTP(S) verzoeken toegankelijk is, en niet via client-side scripts. Met andere woorden: een server-side framework zoals Express kan cookies wel uitlezen, maar client-side code (zoals JavaScript in `script` tags) kan dat niet. Dit verhoogt de beveiliging door het beschermen tegen cross-site scripting (XSS) aanvallen, waarbij een aanvaller op een of andere manier scripts op jouw pagina laat uitvoeren.

**SameSite**

De `SameSite` attribuut van cookies is een beveiligingsmaatregel die helpt bij het voorkomen van cross-site request forgery (CSRF) aanvallen. Dit zijn aanvallen waarbij de aanvaller er in slaagt requests om te leiden naar een andere site.

Het `SameSite` attribuut kan de volgende waarden hebben:

* `Strict`: De cookie wordt alleen gestuurd naar de website waar het is gecreëerd.
* `Lax`: Vergelijkbaar met `Strict`, maar staat het sturen van cookies toe bij navigerende verzoeken. Dit is bijvoorbeeld het geval wanneer je via een externe link naar de site in kwestie gaat eerder dan rechtstreeks.
* `None`: Cookies worden altijd gestuurd, ook bij verzoeken naar andere sites. Dit is alleen toegelaten over HTTPS, niet over HTTP.

**Voorbeeld: Instellen van HttpOnly en SameSite Cookies**

```typescript
app.get('/set-secure-cookie', (req, res) => {
  res.cookie('veilig', 'Beveiligde Data', { httpOnly: true, sameSite: 'strict' });
  res.send('Veilige cookie is ingesteld');
});

```

