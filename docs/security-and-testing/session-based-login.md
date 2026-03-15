# Session Based Login

In dit onderdeel gaan we een volledig werkend login systeem maken. We gaan gebruik maken van sessies om de gebruiker ingelogd te houden.

## Nieuwe express app

We beginnen deze keer met een volledig nieuwe express app met de volgende code:

```typescript
import express, &#123; Express &#125; from "express";
import dotenv from "dotenv";
import path, &#123; format &#125; from "path";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded(&#123; extended: true &#125;));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

app.get("/", async(req, res) => &#123;
    res.render("index");
&#125;);

app.listen(app.get("port"), () => &#123;
    console.log("Server started on http://localhost:" + app.get('port'));
&#125;);
```

Voor deze applicatie hebben we een aantal extra packages nodig. Voer het volgende commando uit in de terminal:

```bash
npm install express dotenv ejs
```

Zorg er ook voor dat je een `views` en `public` map hebt in de root van je project. In de `views` map zullen we onze ejs bestanden plaatsen en in de `public` map zullen we onze css en javascript bestanden plaatsen.

## User collection

We gaan mongodb gebruiken om onze gebruikers op te slaan. We gaan dus gebruik maken van de `mongodb` package. Voer het volgende commando uit in de terminal:

```bash
npm install mongodb
```

Het eerste wat we gaan doen is het aanmaken van een interface voor onze gebruikers. Maak een nieuwe file aan in de root van je project en noem deze `types.ts`. Voeg de volgende code toe aan deze file:

```typescript
import &#123; ObjectId &#125; from "mongodb";

export interface User &#123;
    _id?: ObjectId;
    email: string;
    password?: string;
    role: "ADMIN" | "USER";
&#125;
```

We maken hier dus een interface aan voor onze gebruikers. We hebben een email, een wachtwoord en een rol. De rol kan `ADMIN` of `USER` zijn. Een ADMIN kan bijvoorbeeld extra functionaliteiten hebben die een USER niet heeft.

We gaan nu een database aanmaken waarin we onze gebruikers gaan opslaan.

Maak een nieuwe file aan in de root van je project en noem deze `database.ts`. Voeg de volgende code toe aan deze file:

```typescript
import dotenv from "dotenv";
dotenv.config();
import &#123; MongoClient &#125; from "mongodb";
import &#123; User &#125; from "./types";

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";

export const client = new MongoClient(MONGODB_URI);

export const userCollection = client.db("login-express").collection&lt;User>("users");

async function exit() &#123;
    try &#123;
        await client.close();
        console.log("Disconnected from database");
    &#125; catch (error) &#123;
        console.error(error);
    &#125;
    process.exit(0);
&#125;

export async function connect() &#123;
    await client.connect();
    console.log("Connected to database");
    process.on("SIGINT", exit);
&#125;
```

Dis is een simpel bestand dat de connectie met de database opzet. We hebben een `connect` functie die de connectie opzet en een `exit` functie die de connectie sluit wanneer we de applicatie stoppen. Zorg voor een `.env` bestand in de root van je project met de volgende variabele:

```bash
MONGODB_URI=mongodb://localhost:27017
```

en we zorgen dat we de connectie opzetten in onze `index.ts` file:

```typescript
import &#123; connect &#125; from "./database";
```

```typescript
app.listen(app.get("port"), async() => &#123;
    try &#123;
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    &#125; catch (e) &#123;
        console.log(e);
        process.exit(1); 
    &#125;
&#125;);
```

Merk op dat we hier kiezen voor `process.exit(1)` zodat de applicatie stopt wanneer er een error is. Onze applicatie kan niet zonder database connectie dus we willen niet dat de server blijft draaien wanneer er een error is.

## Toevoegen van de eerste gebruiker

Omdat we nog geen registratie pagina hebben kan je best altijd een eerste gebruiker toevoegen aan de database. We willen deze niet hardcoden in onze code dus we willen deze gebruiker toevoegen via twee environment variabelen. Voeg de volgende variabelen toe aan je `.env` bestand:

```bash
ADMIN_EMAIL=dummy@ap.be
ADMIN_PASSWORD=admin
```

Merk op dat dit password nog niet gehashed is. We gaan `bcrypt` gebruiken om onze wachtwoorden te hashen. Voer het volgende commando uit in de terminal:

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

We gaan nu onze eerste gebruiker toevoegen aan de database. Voeg de volgende code toe aan je `database.ts` file:

```typescript
import bcrypt from "bcrypt";
```

en

```typescript
async function createInitialUser() &#123;
    if (await userCollection.countDocuments() > 0) &#123;
        return;
    &#125;
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) &#123;
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    &#125;
    await userCollection.insertOne(&#123;
        email: email,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    &#125;);
&#125;
```

en roep deze functie aan in je `connect` functie:

```typescript
await createInitialUser();
```

We kiezen hiervoor om de gebruiker enkel toe te voegen wanneer er nog geen gebruikers in de database zitten. Zo kan je altijd een nieuwe gebruiker toevoegen door de database te legen. Ook gebruiken we een saltRounds van 10 om ons paswoord te hashen. Vergeet deze niet te definieren bovenaan je `database.ts` file:

```typescript
const saltRounds : number = 10;
```

## Login functie

We gaan nu een login functie maken in de `database.ts` file. Voeg de volgende code toe aan deze file:

```typescript
export async function login(email: string, password: string) &#123;
    if (email === "" || password === "") &#123;
        throw new Error("Email and password required");
    &#125;
    let user : User | null = await userCollection.findOne&lt;User>(&#123;email: email&#125;);
    if (user) &#123;
        if (await bcrypt.compare(password, user.password!)) &#123;
            return user;
        &#125; else &#123;
            throw new Error("Password incorrect");
        &#125;
    &#125; else &#123;
        throw new Error("User not found");
    &#125;
&#125;
```

Deze functie zoekt een gebruiker in de database met de gegeven email. Als de gebruiker gevonden is wordt het wachtwoord gecontroleerd met de gegeven wachtwoord. Als het wachtwoord correct is wordt de gebruiker gereturned. Als de gebruiker niet gevonden is of het wachtwoord incorrect is wordt een error gegooid. We gebruiken de `bcrypt.compare` functie om het wachtwoord te controleren.

## Login pagina

Nu is alles langs de database kant klaar. We gaan nu een login pagina maken. Maak een nieuwe file aan in de `views` map en noem deze `login.ejs`. Voeg de volgende code toe aan deze file:

```html
&lt;%- include("partials/header") %>
    &lt;form action="/login" method="post">
        <div class="form-group">
            &lt;label for="email">Email:&lt;/label>
            &lt;input type="email" id="email" name="email"/>
        </div>
        <div class="form-group">
            &lt;label for="password">Password:&lt;/label>
            &lt;input type="password" id="password" name="password"/>
        </div>
        &lt;button type="submit">Login&lt;/button>
    &lt;/form>
&lt;%- include("partials/footer") %>
```

We hebben hier een simpel formulier met een email en een wachtwoord veld. We gaan nu een route maken in onze `index.ts` file om deze pagina te tonen. Voeg de volgende code toe aan deze file:

```typescript
app.get("/login", (req, res) => &#123;
    res.render("login");
&#125;);
```

## Session middleware

We gaan nu sessies gebruiken om de gebruiker ingelogd te houden. We gaan dus eerst de `express-session` package installeren. Voer het volgende commando uit in de terminal:

```bash
npm install express-session
npm install --save-dev @types/express-session
```

We zullen de sessie data bijhouden in een mongodb database. We gaan dus ook de `connect-mongodb-session` package installeren. Voer het volgende commando uit in de terminal:

```bash
npm install connect-mongodb-session
npm install --save-dev @types/connect-mongodb-session
```

We gaan nu een nieuwe file aanmaken in de root van je project en noem deze `session.ts`. Voeg de volgende code toe aan deze file:

```typescript
import &#123; MONGODB_URI &#125; from "./database";
import session, &#123; MemoryStore &#125; from "express-session";
import &#123; User &#125; from "./types";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore(&#123;
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "login-express",
&#125;);

declare module 'express-session' &#123;
    export interface SessionData &#123;
        user?: User
    &#125;
&#125;

export default session(&#123;
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: &#123;
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    &#125;
&#125;);
```

In onze session data gaan we een `User` object bijhouden. We hebben een `user` property in onze `SessionData` interface. We hebben ook een cookie die 1 week geldig is. We gaan nu deze middleware toevoegen aan onze app. Voeg de volgende code toe aan je `index.ts` file:

```typescript
import session from "./session";

app.use(session);
```

## Login POST route

We gaan nu een POST route maken om de gebruiker in te loggen. Voeg de volgende code toe aan je `index.ts` file:

```typescript
app.post("/login", async(req, res) => &#123;
    const email : string = req.body.email;
    const password : string = req.body.password;
    try &#123;
        let user : User = await login(email, password);
        delete user.password; 
        req.session.user = user;
        res.redirect("/")
    &#125; catch (e : any) &#123;
        res.redirect("/login");
    &#125;
&#125;);
```

We gaan de gebruiker inloggen en de gebruiker in de sessie data zetten. We verwijderen het wachtwoord van de gebruiker voor we deze in de sessie data zetten. Dit is een extra beveiliging zodat het gehashte wachtwoord niet in de sessie data zit of nooit tot bij de client geraakt. We gaan de gebruiker doorsturen naar de home pagina als de login gelukt is en anders terug naar de login pagina.

## Home pagina

Nu is het tijd om een home pagina te maken met bijbehorende routes. Maak een nieuwe file aan in de `views` map en noem deze `home.ejs`. Voeg de volgende code toe aan deze file:

```html
&lt;%- include("partials/header") %>
    &lt;%= user.email %> is logged in
&lt;%- include("partials/footer") %>
```

en voeg de volgende code toe aan je `index.ts` file:

```typescript
app.get("/", async(req, res) => &#123;
    res.render("index");
&#125;);
```

Op dit moment zal je applicatie crashen als je naar de home pagina gaat en je nog niet ingelogd bent. We zouden dus best een check toevoegen om te kijken of de gebruiker ingelogd is. Voeg de volgende code toe aan je `index.ts` file:

```typescript
app.get("/", async(req, res) => &#123;
    if (req.session.user) &#123;
        res.render("index", &#123;user: req.session.user&#125;);
    &#125; else &#123;
        res.redirect("/login");
    &#125;
&#125;);
```

## Secure Middleware

Het probleem bij onze aanpak hierboven is dat we voor elke route gaan moeten controleren of de gebruiker ingelogd is. Dit is veel werk en kan foutgevoelig zijn. We gaan dus een middleware maken die controleert of de gebruiker ingelogd is. Maak een nieuwe file aan en noem deze `secureMiddleware.ts`. Voeg de volgende code toe aan deze file:

```typescript
import &#123; NextFunction, Request, Response &#125; from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) &#123;
    if (req.session.user) &#123;
        res.locals.user = req.session.user;
        next();
    &#125; else &#123;
        res.redirect("/login");
    &#125;
&#125;;
```

Deze middleware controleert of de gebruiker ingelogd is. Als de gebruiker ingelogd is wordt de gebruiker toegevoegd aan de `res.locals` zodat deze beschikbaar is in de views. Als de gebruiker niet ingelogd is wordt de gebruiker doorgestuurd naar de login pagina.

Nu moeten we deze middleware toevoegen aan onze app. We gaan deze niet toevoegen aan elke route maar aan de routes die beveiligd moeten worden. We gaan deze middleware toevoegen aan de home route. Voeg de volgende code toe aan je `index.ts` file:

```typescript
import &#123; secureMiddleware &#125; from "./secureMiddleware";

app.get("/", secureMiddleware, async(req, res) => &#123;
    res.render("index", &#123; user: req.session.user &#125;);
&#125;);
```

Let op dat je deze niet aan de login route toevoegt. Anders kan je nooit inloggen.

## Logout

Voor de volledigheid gaan we ook een logout functie toevoegen. Voeg de volgende code toe aan je `index.ts` file:

```typescript
app.post("/logout", async(req, res) => &#123;
    req.session.destroy(() => &#123;
        res.redirect("/login");
    &#125;);
&#125;);
```

en voegen we een logout knop toe aan onze home pagina:

```html
&lt;%- include("partials/header") %>
    &lt;%= user.email %> is logged in.

    &lt;form action="/logout" method="post">
        &lt;button type="submit">Logout&lt;/button>
    &lt;/form>
&lt;%- include("partials/footer") %>
```

## Routers

Het is ook best om onze routes in aparte files te zetten. We gaan een `routes` map maken in de root van je project. In deze map maken we een loginRouter en een homeRouter. De reden hiervoor is dat we op deze manier de volledige homeRouter kunnen beveiligen met de secureMiddleware. Maak een nieuwe file aan in de `routes` map en noem deze `loginRouter.ts`. Voeg de volgende code toe aan deze file:

```typescript
import express from "express";

export function loginRouter() &#123;
    const router = express.Router();

    router.get("/login", async (req, res) => &#123;
        res.render("login");
    &#125;);

    router.post("/login", async (req, res) => &#123;
        const email: string = req.body.email;
        const password: string = req.body.password;
        try &#123;
            let user: User = await login(email, password);
            delete user.password; // Remove password from user object. Sounds like a good idea.
            req.session.user = user;
            res.redirect("/")
        &#125; catch (e: any) &#123;
            res.redirect("/login");
        &#125;
    &#125;);

    router.post("/logout", secureMiddleware, async (req, res) => &#123;
        req.session.destroy((err) => &#123;
            res.redirect("/login");
        &#125;);
    &#125;);

    return router;
&#125;
```

en maak een nieuwe file aan in de `routes` map en noem deze `homeRouter.ts`. Voeg de volgende code toe aan deze file:

```typescript
import express from "express";

export function homeRouter() &#123;
    const router = express.Router();

    router.get("/", async(req, res) => &#123;
        res.render("index");
    &#125;);

    return router;
&#125;
```

We gaan nu deze routers toevoegen aan onze app. Voeg de volgende code toe aan je `index.ts` file:

```typescript
import &#123; loginRouter &#125; from "./routes/loginRouter";
import &#123; homeRouter &#125; from "./routes/homeRouter";

app.use(loginRouter());
app.use(homeRouter());
```

## Flash Messages

We maken vaak gebruik van `try catch` blokken om errors op te vangen bij het inloggen en gebruiken vervolgens een `redirect` om de gebruiker terug te sturen naar de login pagina. Dit is niet ideaal. We zouden beter een error message tonen op de login pagina. We kunnen jammer genoeg geen error message meegeven met een redirect. Dus we hebben hier voor een andere oplossing nodig. Het is mogelijk om een error message mee te geven in de sessie. Eerst voorzien we een interface voor een `FlashMessage` in onze `types.ts` file:

```typescript
export interface FlashMessage &#123;
    type: "error" | "success"
    message: string;
&#125;
```

Voeg een nieuwe property toe aan je `SessionData` interface in je `session.ts` file:

```typescript
export interface SessionData &#123;
    user?: User;
    message?: FlashMessage;
&#125;
```

Een flash message is een bericht dat we maar 1 keer willen tonen, en dan verwijderen. We gaan nu een middleware maken die deze flash messages toevoegt aan de `res.locals`. Maak een nieuwe file aan en noem deze `flashMiddleware.ts`. Voeg de volgende code toe aan deze file:

```typescript
import &#123; NextFunction, Request, Response &#125; from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) &#123;
    if (req.session.message) &#123;
        res.locals.message = req.session.message;
        delete req.session.message;
    &#125; else &#123;
        res.locals.message = undefined;
    &#125;
    next();
&#125;;
```

Hier gaan we dus kijken of er een message in de sessie zit. Als deze er is voegen we deze toe aan de `res.locals` en verwijderen we deze uit de sessie. We gaan deze middleware toevoegen aan onze app. Voeg de volgende code toe aan je `index.ts` file:

```typescript
import &#123; flashMiddleware &#125; from "./flashMiddleware";

app.use(flashMiddleware);
```

Nu kunnen we heel gemakkelijk een error message toevoegen aan de sessie en deze tonen op de login pagina. Zo kunnen we de gebruiker laten weten wat er mis is gegaan. We kunnen de volgende code in de `catch` blok van onze login route toevoegen:

```typescript
req.session.message = &#123;type: "error", message: e.message&#125;;
res.redirect("/login");
```

Maar ook de volgende code bij een succesvolle login:

```typescript
req.session.message = &#123;type: "success", message: "Login successful"&#125;;
res.redirect("/");
```

Nu kunnen we de volgende code in onze `login.ejs` file toevoegen (of in een aparte partials file als je dit wil hergebruiken):

```html
&lt;% if (message) &#123; %>
    <p class="&lt;%= message.type %>">&lt;%= message.message %></p>
&lt;% &#125; %>
```

Het is mogelijk om met css animaties te werken om de messages te laten verdwijnen na een bepaalde tijd. Dit is echter niet de focus van deze cursus. Het is wel aan te raden om dit te doen in een echte applicatie.

Er bestaan ook packages op npm die voor jou de flash messages afhandelen. Je kan deze gebruiken als je dit wil. Maar het is ook goed om te weten hoe je dit zelf kan doen.
