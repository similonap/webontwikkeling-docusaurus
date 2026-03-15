# Deployment

Momenteel hebben we een werkende Express.js applicatie die we lokaal kunnen draaien. Maar hoe kunnen we deze applicatie nu online zetten zodat iedereen erbij kan? We kunnen deze manueel op een server zetten, maar dit is niet altijd even eenvoudig. Gelukkig zijn er verschillende platformen die ons hierbij kunnen helpen. 

## Platform as a Service (PaaS)

Een Platform as a Service (PaaS) is een cloud computing service die een platform biedt aan ontwikkelaars om applicaties te bouwen, testen en te deployen. Het grote voordeel van een PaaS is dat je je geen zorgen hoeft te maken over de infrastructuur. Je kan je volledig focussen op het bouwen van je applicatie.

### Render 

[Render](https://render.com/) is een PaaS die ons toelaat om onze applicatie eenvoudig online te zetten. Render ondersteunt verschillende programmeertalen en frameworks waaronder Node.js en Express.js. Het heeft github integratie waardoor je eenvoudig je code kan pushen naar je repository en deze automatisch wordt gedeployed.

Hieronder een kort stappenplan om je Express.js applicatie online te zetten op Render:
- Maak een account aan op [Render](https://render.com/) 
- Vervolgens maak je een nieuwe `web service` aan
- Kies voor `Build and deploy from a git repository` zodat je rechstreeks kan verbinden met je github repository.
- Zoek je github repository en kies de branch waarop je applicatie staat en druk op `Connect`
- Hier krijg je een aantal instellingen die je kan aanpassen. Hieronder een aantal belangrijke instellingen:
    - Root Directory: De directory waarin je `package.json` staat. Als je applicatie in een subdirectory staat, kan je deze hier aanpassen.
    - Runtime: Hier kies je voor `Node.js`
    - Build command: `npm install`
    - Start command: `npm start`
    - Instance type: Free tier
    - Als je gebruik maakt van environment variables kan je deze hier ook instellen. Deze worden dan veilig opgeslagen en niet meegegeven in je code.
- Vervolgens zal je applicatie worden gebuild en gedeployed. Je krijgt een unieke URL waarop je applicatie online staat.
