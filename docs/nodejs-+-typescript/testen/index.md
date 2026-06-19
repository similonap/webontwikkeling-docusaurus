# Testen

Testen van applicaties gebeurt op verschillende niveaus. Hoewel niet iedereen dezelfde niveaus van elkaar onderscheidt, maakt men in het algemeen een onderscheid tussen **unit testing** en **end-to-end testing**.

Unit testing omvat het testen van individuele onderdelen van de code, zoals functies of methoden. Meestal wordt hier een white-box principe gehanteerd: de tester kent de inhoud van de unit en mag code schrijven die gebruik maakt van deze kennis. Typische frameworks voor unit testing van Express applicaties zijn Mocha en Jest.

End-to-end testing omvat het testen "zoals een gebruiker". Deze vorm volgt het black-box principe. In essentie omvat dit het automatiseren van volledige browserinteracties. Typische frameworks zijn Cypress of Selenium.

## Jest

Jest is een testframework dat origineel ontwikkeld werd door Facebook. Het is een van de meest populaire testframeworks voor JavaScript. Jest is een all-in-one oplossing die zowel de testrunner als de assertion library bevat. Jest is zeer eenvoudig in gebruik en heeft een goede documentatie.

### Installatie

Om Jest te installeren, voer je volgend commando uit:

```bash
npm i --save-dev jest ts-jest @types/jest
```

### Configuratie

Om Jest te kunnen gebruiken (met TypeScript), voer je dit commando uit:

```bash
npx ts-jest config:init
```

Om te zorgen dat je al je Jest-tests kan laten lopen met npm test, voeg je dit toe aan package.json:

```json
"scripts": {
  "test": "jest"
}
```
