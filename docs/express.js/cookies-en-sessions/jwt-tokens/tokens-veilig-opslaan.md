# Tokens veilig opslaan

JSON web tokens kunnen vrij gedeeld worden. Dat biedt veel gebruiksgemak, maar het zorgt er ook voor dat we ze met enige voorzichtigheid moeten opslaan: als een aanvaller een JWT kan stelen, kan die zich ook voordoen als het slachtoffer.

### Local storage

[Local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) is, eenvoudig gesteld, opslagruimte in de browser die bij een bepaalde website hoort. Dit lijkt een goede plaats om een JWT op te slaan (en dit wordt ook vaak gedaan). Het risico bestaat echter dat een externe partij JavaScriptcode kan "injecteren" in onze applicatie en dan local storage kan uitlezen. Dit komt omdat alle JavaScriptcode op onze website toegang heeft tot local storage, of we ze nu zelf geschreven hebben of niet. Dit type aanval heet een "cross-site scripting attack", omdat er een script wordt uitgevoerd dat niet van onze eigen site afkomstig is.

Het is niet gegarandeerd dat iemand er in zou slagen JavaScriptcode te injecteren (dat hangt af van hoe veel vrijheid de gebruikers hebben om informatie naar de site te sturen), maar het is niet eenvoudig alles dicht te timmeren.

### Cookies (aangeraden oplossing)

Cookies zijn iets lastiger in het gebruik dan local storage, maar ze bieden ook persistentie. Ze bieden ook een "HTTP-only" optie aan, zodat ze niet door JavaScriptcode gelezen kunnen worden, maar wel met HTTP-requests naar onze site worden verstuurd. Dit maakt een cross-site scripting attack onmogelijk.

Ze kunnen ook geconfigureerd worden zodat ze enkel over HTTPS verstuurd worden. Gewoon HTTP-verkeer is leesbaar op elke tussenstop, maar HTTPS is dat niet. Dus het is niet erg dat cookies gewone tekstbestanden zijn.

Ten slotte kunnen we cookies zo instellen dat ze **enkel** naar de bronsite worden verstuurd. Dit is belangrijk om een ander type aanval te voorkomen, namelijk de "Cross Site Request Forgery". Dit is een techniek waarbij een aanvaller het slachtoffer informatie naar de verkeerde website doet sturen (bijvoorbeeld door deze te overtuigen op een bepaalde link te klikken).

### Implementatie in Express

Om een JWT token in te stellen in een Express applicatie, kan je volgende code gebruiken:

```typescript
// token is een eerder aangemaakt JWT token
// "jwt" is hier een identifier voor je cookie
// de exacte betekenis van de waarden vind je op https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: true });
```
