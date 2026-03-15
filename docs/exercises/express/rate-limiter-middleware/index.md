### Rate Limiter

Maak een nieuw project aan met de naam `rate-limiter-middleware` en installeer de `express` en de `ejs` module.

Maak een nieuwe middleware aan die een rate limiter implementeert. Een rate limiter zorgt ervoor dat een bepaalde route maar om de zoveel tijd aangeroepen kan worden. In eerste instantie willen we dat een route maar 1 keer per seconde aangeroepen kan worden. Als dit gebeurd is, moet de gebruiker een foutmelding krijgen (bijvoorbeeld een 429 status code). Je mag gebruik maken van 1 globale variabele om de tijd bij te houden wanneer de route voor het laatst is aangeroepen.

Maak een nieuwe route aan op `/` van de applicatie die een `GET` request afhandelt. De route rendert een simpele Hello World pagina.

Gebruik de rate limiter middleware om ervoor te zorgen dat de route maar 1 keer per seconde aangeroepen kan worden.

#### Uitbreiding

Breid de rate limiter middleware uit zodat je de tijd tussen de requests kan instellen. Dit kan je bijvoorbeeld doen door een parameter mee te geven aan de middleware. Als de parameter niet wordt meegegeven, moet de standaard tijd 1 seconde zijn.

Je kan bijvoorbeeld de volgende error meegeven aan de gebruiker:

```
Too many requests. You can do only one request per 10 seconds.
```

Breid de rate limiter middleware uit zodat deze ook rekening houdt met de IP van de gebruiker. Dit kan je bijvoorbeeld doen door een object bij te houden waarin je de tijd bijhoudt wanneer de route voor het laatst is aangeroepen per IP.