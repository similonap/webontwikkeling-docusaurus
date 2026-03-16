# JWT NPM package

## jsonwebtokens NPM package

**jsonwebtoken** is een npm package die wordt gebruikt om JSON Web Tokens (JWT) te maken, verifiëren en decoderen in een nodeJS applicatie.

```
npm i jsonwebtoken
```

De types installeer je als development dependencies: `npm i --save-dev @types/jsonwebtoken`.

De jsonwebtoken package biedt een aantal functies die kunnen worden gebruikt om JWTs te maken, verifiëren en decoderen.

**De belangrijkste functies zijn:**

* `jwt.sign()`, die wordt gebruikt om een JWT te maken met behulp van een gegeven payload en een geheime sleutel;
* `jwt.verify()` wordt gebruikt om een JWT te verifiëren en te decoderen met behulp van een geheime sleutel;

#### jwt.sign()

De `jwt.sign` functie uit de jsonwebtokens package is een functie die wordt gebruikt om een JSON Web Token (JWT) te genereren. De `jwt.sign` functie neemt twee argumenten: het eerste is de informatie die je wilt opslaan in het JWT (dit wordt ook wel de "**payload**" genoemd), en het tweede is een "**geheim**" dat wordt gebruikt om de JWT te ondertekenen en te beveiligen. De functie retourneert vervolgens een JWT dat je kunt gebruiken om de opgeslagen informatie te versturen of op te halen.

Hier is een voorbeeld van hoe je de `jwt.sign` functie zou kunnen gebruiken in Typescript:

```typescript
import * as jwt from 'jsonwebtoken';

// Dit is de informatie die we willen opslaan in de JWT
const payload = {
  userId: 123,
  username: 'johndoe',
};

// Dit is het geheim dat we gebruiken om de JWT te ondertekenen en te beveiligen
const secret = 'my_secret_key';

// We gebruiken de jwt.sign functie om de JWT te genereren
const token = jwt.sign(payload, secret);

// Nu kunnen we de JWT gebruiken om de opgeslagen informatie te versturen of op te halen
console.log(token);
```

In dit voorbeeld gebruiken we de `jwt.sign` functie om een JWT te genereren met de opgegeven informatie (in dit geval de `userId` en `username` van de gebruiker) en het opgegeven geheim. De functie retourneert een JWT die we kunnen gebruiken om de opgeslagen informatie te versturen of op te halen.

#### jwt.verify()

De `jwt.verify()` functie is een functie in de **jsonwebtoken** npm package die wordt gebruikt om een JSON Web Token (JWT) te verifiëren en de bijbehorende gegevens te decoderen. De functie neemt een token en een geheime sleutel als argumenten en geeft de decodering van de token terug als een object. Hier is een voorbeeld van hoe de functie zou kunnen worden gebruikt:

```typescript
import * as jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const secret = 'my_secret_key';

jwt.verify(token, secret, (err: any, decoded: any) => {
  if (err) {
    // Er is een error opgetreden bij het verifiëren van de token
    console.error(err);
    return;
  }

  // Token is geverifieërd
  console.log(decoded);
  // Output: { sub: '1234567890', name: 'John Doe', iat: 1516239022 }
});
```

In dit voorbeeld wordt de `jwt.verify()` functie gebruikt om een JWT te verifiëren en te decoderen met behulp van de gegeven geheime sleutel. Als de verificatie en decodering succesvol is, worden de gegevens van de JWT weergegeven als een object. Als er een fout optreedt bij het verifiëren of decoderen van de token, wordt een foutmelding weergegeven.

:::warning
We hebben hierboven ondertekend en geverifieerd met een _secret_. Dit is normaal voldoende als je je tokens niet over meerdere websites wil delen. Je kan ook tekenen en verifiëren met een combinatie van een public en private key. Dat is handig wanneer de producent van het token niet de (enige) consument is.
:::
