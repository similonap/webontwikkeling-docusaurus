### Utility Middleware

Maak een nieuw project aan met de naam `utility-middleware` en installeer de `express` en de `ejs` module.

Schrijf een middleware die een aantal handige functies bevat. De middleware moet de volgende functies bevatten:
- `caesar`: een functie die een string en een shift meekrijgt en de string versleuteld met de Caesar cipher. De shift is een getal dat aangeeft hoeveel plaatsen de letters in het alfabet verschoven moeten worden. Bijvoorbeeld: `caesar('abc', 1)` geeft `'bcd'`.
- `reverse`: een functie die een string meekrijgt en de string omdraait. Bijvoorbeeld: `reverse('abc')` geeft `'cba'`.
- `shorten`: een functie die een string en een lengte meekrijgt en de string inkort tot de lengte. Als de string langer is dan de lengte, moet er een `...` achter de string geplaatst worden. Bijvoorbeeld: `shorten('abcde', 3)` geeft `'abc...'`.

Zorg dat deze middleware beschikbaar is voor alle routes van de applicatie en test de functies uit in je ejs bestanden.