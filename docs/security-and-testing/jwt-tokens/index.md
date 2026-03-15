# JWT Tokens

### Wat zijn JSON Web Tokens?

JSON web tokens (JWT) zijn een manier om informatie op een veilige en standaardiserende manier op te slaan en te verzenden tussen verschillende partijen. Deze tokens bestaan uit drie delen: een header, een payload en een signature. De header bevat informatie over hoe het token is opgebouwd, zoals het type en de hashing algoritme. De payload bevat de informatie die opgeslagen en verzonden moet worden, zoals gebruikersgegevens en toegangsrechten. De signature is een cryptografische hash die gebruikt wordt om de integriteit en authenticiteit van het token te verifiëren. JWT's zijn vaak gebruikt in authenticatie- en autorisatieprocessen in webapplicaties.

#### Waarvoor worden JWT's gebruikt en waarom is het nodig?

JWT's zijn een handige manier om informatie op te slaan en te verzenden tussen verschillende partijen zonder deze informatie op te slaan in een database. Dit betekent dat JWT's een efficiëntere manier zijn om gebruikers te authenticaten en autoriseren, omdat het verificatieproces op de client-side kan plaatsvinden. JWT's zijn ook veilig, omdat de informatie die opgeslagen is in het token niet makkelijk te lezen is zonder de juiste decoderingstechnieken. Bovendien kan de signature gebruikt worden om te verifiëren dat het token niet is gemanipuleerd tijdens het verzenden. Dit maakt JWT's een veelgebruikt mechanisme in het ontwikkelen van webapplicaties.

**Hier zijn enkele scenario's waarin JSON Web Tokens nuttig zijn:**

* **Autorisatie**: Autorisatie met JWT's gebeurt door het opstellen van een token dat de toegangsrechten van een gebruiker bevat. De token in kwestie wordt dan verzonden naar de server, die de token kan verifiëren en decoderen om te bepalen of de gebruiker toegang heeft tot bepaalde functionaliteiten of gegevens. Dit kan bijvoorbeeld gebruikt worden om te bepalen of een gebruiker toegang heeft tot een bepaalde pagina of API-endpoint. De toegangsrechten die opgeslagen kunnen worden in een JWT variëren en kunnen bijvoorbeeld het recht geven op lezen, schrijven of verwijderen van gegevens.
* **Informatie-uitwisseling**: Informatie-uitwisseling met JWT's gebeurt door het opstellen van een token dat de benodigde informatie bevat. De token wordt dan verzonden naar de ontvanger, die de token kan verifiëren en decoderen om de bijbehorende informatie te gebruiken. De informatie die opgeslagen kan worden in een JWT varieert en kan bijvoorbeeld gebruikersgegevens, toegangsrechten of andere relevante informatie bevatten.

Je vraagt je misschien af waarom de authenticatie server de informatie niet gewoon als een `JSON`-object kan verzenden en waarom deze moet worden omgezet in een ondertekende "**token**".

Als de authenticatie server het als een gewoon `JSON`-object verzendt, kan de client niet controleren of de inhoud dat ze ontvangt correct is. Een kwaadwillende aanvaller zou bijvoorbeeld de gebruikers-ID kunnen wijzigen vooraleer het bij de client terechtkomt. De client zou dat op geen enkele manier te weten kunnen komen.

Vanwege dit beveiligingsprobleem moet de authenticatie server deze informatie verzenden op een manier die kan worden geverifieerd door de client, en hier komt het concept van een ondertekende "**token**" in beeld.

Simpel gezegd, een token is een string die bepaalde informatie bevat die veilig kan worden geverifieerd. Het kan een willekeurige set alfanumerieke tekens zijn die naar een ID in de database verwijzen, of het kan een gecodeerde JSON zijn die door de client zelf kan worden geverifieerd.

#### Wat is de JSON Web Token-structuur?

In zijn compacte vorm bestaan JSON Web Tokens uit drie delen gescheiden door punten (.), namelijk:

1. **Header**, Bestaat uit twee delen:
   1. Het ondertekeningsalgoritme dat wordt gebruikt. Dit bepaalt onder andere of je met één secret werkt of met een public-private key pair;
   2. Het type token, dat in dit geval "`JWT`" is;
2. **Payload**:
   1. De payload bevat de claims of het JSON-object;
3. **Signature**:
   1. Een tekenreeks die wordt gegenereerd via een cryptografisch algoritme dat kan worden gebruikt om de integriteit van de JSON-payload te verifiëren;

Een JWT er meestal als volgt uit.

```json
header.payload.signature
```

<figure><img src="/assets/wat-is-jwt (1).png" alt="" /><figcaption><p>Bron: SuperTokens</p></figcaption></figure>



<figure><img src="/assets/wat-is-jwt-2 (1).png" alt="" /><figcaption><p>Analyse van een JWT token via jwt.io</p></figcaption></figure>

Laten we de verschillende onderdelen opsplitsen.

**Header**

De header van een JWT bevat informatie over hoe de token is opgebouwd, zoals het type en de hashing algoritme. Dit is belangrijk om te weten om de token te kunnen decoderen en verifiëren.

De header bestaat doorgaans uit twee delen:

1. Het type token, dat `JWT` is;
2. Het ondertekeningsalgoritme dat wordt gebruikt, zoals `HMAC` `SHA256` of `RSA`;

Bijvoorbeeld:

```json
&#123;
  "alg": "HS256",
  "typ": "JWT"
&#125;
```

Vervolgens is deze JSON Base64Url-gecodeerd om het eerste deel van de JWT te vormen.

**Payload**

Het tweede deel van de token is de payload, die de claims bevat. Claims zijn uitspraken over een entiteit (meestal de gebruiker) en aanvullende gegevens.

De payload bevat de informatie die opgeslagen en verzonden moet worden in de token, zoals gebruikersgegevens en toegangsrechten. Deze informatie wordt gecodeerd in de token zodat het niet makkelijk te lezen is zonder de juiste decoderingstechniëken.

Een JWT kan bijvoorbeeld een claim met de naam `name` bevatten die beweert dat de naam van de gebruiker "AP user" is. In een JWT wordt een claim weergegeven als een **key/value-pair** waarbij de key altijd een tekenreeks is en de value een JSON-waarde kan zijn. Het volgende JSON-object bevat bijvoorbeeld drie claims (`sub`, `name`, `iat`):

```json
&#123;
   "sub": "1234567890",
   "name": "AP user",
   "iat": "1516239022"
&#125;
```

Vervolgens de payload ook JSON Base64Url-gecodeerd om het tweede deel van de JWT te vormen.

**Signature**

De signature wordt gebruikt om de integriteit en authenticiteit van de token te verifiëren, om te controleren of het token niet is gemanipuleerd tijdens het verzenden. Op deze manier wordt de informatie op een veilige en betrouwbare manier gewaarborgd in de JWT token.

Als je bijvoorbeeld het HMAC SHA256-algoritme wilt gebruiken, wordt de handtekening op de volgende manier gemaakt:

```json
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

De handtekening wordt gebruikt om te verifiëren dat het bericht onderweg niet is gewijzigd. Ze kan aangemaakt zijn met hetzelfde geheim dat nodig is om te handtekening te verifiëren (dan spreken we over een _secret_) of kan ondertekend zijn met een geheim stuk data (_private key_) waarvoor de decryptiesleutel (_public key_) wel algemeen gekend is.

#### Zet alles bij elkaar

De uitvoer bestaat uit drie Base64-URL-tekenreeksen gescheiden door punten die gemakkelijk kunnen worden doorgegeven in HTML- en HTTP-omgevingen.

Het volgende toont een JWT met de vorige header en payload gecodeerd en is ondertekend met een geheim:



<figure><img src="/assets/wat-is-jwt-3 (1).png" alt="" /><figcaption><p>De drie (geëncodeerde) onderdelen.</p></figcaption></figure>

:::info
Als je met JWT wilt spelen en deze concepten in de praktijk wilt brengen, kan je [jwt.io Debugger](https://jwt.io/#debugger-io) gebruiken om JWT's te decoderen, verifiëren en genereren.
:::

#### Hoe werkt het in de praktijk?

Wanneer een gebruiker zich succesvol aanmeldt met zijn inloggegevens, genereert de authenticatie-server een JWT die de identiteit van de gebruiker certificeert. De auth-server retourneert de JWT naar de USER die het vervolgens kan gebruiken om de beveiligde routes van de resource server aan te roepen. De resource server verifieert de JWT en stuurt de gewenste gegevens naar de USER.

1. Gebruiker meldt zich aan met gebruikersnaam en wachtwoord of google/facebook;
2. Authenticatie server verifieert de inloggegevens en geeft een jwt uit die is ondertekend met een "secret" of een private key;
3. De gebruiker gebruikt de JWT om toegang te krijgen tot beveiligde bronnen. De JWT wordt meegestuurd in de HTTP-authorization header;
4. De resource server verifieert vervolgens de authenticiteit van de token met behulp van de "secret" of een public key.



<figure><img src="/assets/wat-is-jwt-4 (1).png" alt="" /><figcaption></figcaption></figure>

:::info
Houd er ook mee rekening dat de informatie opgeslagen in JSON Web Tokens, hoewel beschermd tegen manipulatie, voor iedereen leesbaar is. **Plaats geen geheime informatie in de payload of header-elementen van een JWT, tenzij deze versleuteld zijn.**
:::

Telkens wanneer de gebruiker toegang wil tot een beschermde route of bron, moet de gebruiker in kwestie de JWT mee verzenden in de header van de request. De beveiligde routes van de server controleren op een geldige JWT in de Authorization-header en als deze aanwezig is, krijgt de gebruiker toegang tot beveiligde bronnen.

**Resources**

* [Wat is JWT?](https://jwt.io/introduction)
* [Waar en hoe kan je het toepassen?](https://supertokens.com/blog/what-is-jwt)
* [https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims)
* [JWT in express met jsonwebtokens, crypto en dotenv](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
