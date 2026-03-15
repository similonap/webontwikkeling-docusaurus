### Redirect Form

Maak een nieuw project aan met de naam `redirect-form` en installeer de `express` en de `ejs` module.

Maak een nieuwe route aan op `/` van de applicatie die een `GET` request afhandelt. De route rendert een EJS template met een formulier. Het formulier bevat een input veld met de naam `url`. Het formulier bevat ook een submit knop. Als het formulier wordt ingediend, wordt een `POST` request naar dezelfde route gestuurd.

Als de gebruiker een URL invult en het formulier indient, wordt de gebruiker geredirect naar de ingevulde URL (aan de hand van `res.redirect`). Als de gebruiker geen URL invult wordt de gebruiker naar een zelf te kiezen URL geredirect (bv google.com).

![reddit](urlform.png)

Probeer hetzelfde te doen met een url die je kiest uit een dropdown list (bv. google.com, reddit.com, microsoft.com, ...).

![alt text](select.png)