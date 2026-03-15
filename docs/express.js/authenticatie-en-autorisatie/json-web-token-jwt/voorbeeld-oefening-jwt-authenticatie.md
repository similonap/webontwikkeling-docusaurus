# Voorbeeld oefening JWT authenticatie

Stappenplan volgt nog.


```typescript
// Importeer de nodige packages
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

// Maak een express-app
const app = express();

// Zet body-parser in om het request-lichaam te parsen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(&#123; extended: true &#125;));

// Maak een JWT geheim
const JWT_SECRET = "secretkey";

// Maak een route om JWT tokens te genereren
app.post("/signup", (req, res) => &#123;
  // Haal de gebruikersgegevens op uit het request-lichaam
  const user = &#123;
    username: req.body.username,
    password: req.body.password,
  &#125;;

  // Genereer een JWT token met behulp van de gebruikersgegevens en een geheime sleutel
  const token = jwt.sign(user, JWT_SECRET);

  // Stuur de JWT token terug naar de gebruiker
  res.json(&#123; token &#125;);
&#125;);

// Maak een route om de JWT token te verifiëren en de gebruikersgegevens terug te sturen
app.get("/login", (req, res) => &#123;
  // Haal de JWT token op uit de request headers
  // De waarde van de header ziet er als volgt uit: 'Bearer JWT_TOKEN'
  // We halen de JWT_TOKEN eruit met behulp van de Array.split() methode
  const token = req.headers["authorization"].split(' ')[1];
console.log(token)
  // Controleer of het token geldig is met behulp van de geheime sleutel
  jwt.verify(token, JWT_SECRET, (err, user) => &#123;
    if (err) &#123;
      // Stuur een foutbericht als de token ongeldig is
      res.sendStatus(403);
    &#125; else &#123;
      // Stuur de gebruikersgegevens terug als het token geldig is
      res.json(user);
    &#125;
  &#125;);
&#125;);

// Start de server op poort 3000
app.listen(3000, () => console.log("Server gestart op poort 3000"));
```


### Conclusie

In dit voorbeeld wordt er een express-app aangemaakt en worden de nodige packages geïmporteerd, waaronder `express`, [`body-parser`](../../basis.md) en [`jsonwebtoken`](../../cookies-en-sessions/jwt-tokens/jwt-npm-package.md). De `body-parser` package wordt gebruikt om het request-lichaam te parsen en de `jsonwebtoken` package wordt gebruikt om JWT tokens te genereren, valideren en decoderen.

Er wordt een JWT geheim gemaakt en opgeslagen in de constante `JWT_SECRET`. Dit geheim wordt later gebruikt bij het genereren en valideren van JWT tokens.

Er wordt een route gemaakt op `/signup` voor het posten van signup-gegevens en het genereren van een JWT token. De gebruikersgegevens worden uit het request-lichaam opgehaald en gebruikt om een JWT token te genereren met behulp van het JWT geheim. De gegenereerde token wordt teruggestuurd naar de gebruiker waarmee hij vervolgens kan inloggen.

Er wordt ook een route aangemaakt voor het verifiëren van een JWT token en het terugsturen van de gebruikersgegevens op `/login`. De JWT token wordt uit de request headers gehaald en gevalideerd met behulp van het JWT geheim. Als de token geldig is, worden de gebruikersgegevens teruggestuurd naar de gebruiker. Als het token ongeldig is, wordt een foutbericht gestuurd.

###
