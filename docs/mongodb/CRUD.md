# CRUD

Een veel voorkomende vorm van web applicatie is een CRUD applicatie. CRUD staat voor Create, Read, Update en Delete. Dit zijn de vier basis operaties die je kan uitvoeren op een database. Eigenlijk is elke eenvoudige admin dashboard een CRUD applicatie. In dit artikel gaan we een eenvoudige CRUD applicatie maken met MongoDB en Express. De initiele data is afkomstig van `https://jsonplaceholder.typicode.com/users` wat een lijst van gebruikers bevat. We willen dus een applicatie maken waar we gebruikers kunnen toevoegen, verwijderen, updaten en bekijken.

We gaan geen rekening houden met error afhandeling in dit deel van de cursus. We gaan er vanuit dat alles goed gaat. In een productie omgeving is het belangrijk om error afhandeling te voorzien.

## Inladen van de JSON data

We gaan eerst de JSON data vanuit de API inladen in onze MongoDB database. We plaatsen de volgende code in een nieuw bestand `database.ts`.

```typescript
import &#123; Collection, MongoClient &#125; from "mongodb";
import dotenv from "dotenv";
import &#123; User &#125; from "./types";
dotenv.config();

export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

export const collection : Collection&lt;User> = client.db("exercises").collection&lt;User>("users");

export async function getUsers() &#123;
    return await collection.find(&#123;&#125;).toArray();
&#125;

async function exit() &#123;
    try &#123;
        await client.close();
        console.log("Disconnected from database");
    &#125; catch (error) &#123;
        console.error(error);
    &#125;
    process.exit(0);
&#125;

export async function loadUsersFromApi() &#123;
    const users : User[] = await getUsers();
    if (users.length == 0) &#123;
        console.log("Database is empty, loading users from API")
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users : User[] = await response.json();
        await collection.insertMany(users);
    &#125;
&#125;

export async function connect() &#123;
    try &#123;
        await client.connect();
        await loadUsersFromApi();   
        console.log("Connected to database");
        process.on("SIGINT", exit);
    &#125; catch (error) &#123;
        console.error(error);
    &#125;
&#125;
```

En we roepen de `connect` functie aan in ons `index.ts` bestand.

```typescript
import &#123; connect &#125; from "./database";

app.listen(3000, async () => &#123;
    await connect();
    console.log("Server is running on port 3000");
&#125;);
```

Bij het opstarten van de server gaan we de connectie maken met de database en de data inladen vanuit de API. We gaan de data enkel inladen als de database leeg is. We gaan de data inladen in de `users` collectie van de `exercises` database.

## Lezen van de data (READ)

We gaan nu de data lezen vanuit de database en tonen op de webpagina. We gaan de volgende code toevoegen aan ons `index.ts` bestand. Eerst importeren we de `getUser` functie vanuit de `database.ts` bestand.

```typescript
import &#123; connect, getUsers &#125; from "./database";
```

```typescript
app.get("/users", async(req, res) => &#123;
    let users : User[] = await getUsers();
    res.render("users/index", &#123;
        users: users
    &#125;);
&#125;);
```

en maken we een `index.ejs` bestand aan in de `views/users` map. We zorgen ook voor een `partials` map in de `views` map en maken een `header.ejs` en `footer.ejs` bestand aan.

```html
&lt;%- include("../partials/header") %>
    &lt;section>
        &lt;header>
            <h1>Manage Users</h1>
        &lt;/header>
        &lt;% for (let user of users) &#123; %>
            &lt;article>
                &lt;header>
                    <h2>&lt;%= user.name %></h2>
                    <p><strong>Username:</strong> &lt;%= user.username %></p>
                &lt;/header>
                <p><strong>Email:</strong> &lt;%= user.email %></p>
                &lt;address>
                    <strong>Address:</strong> &lt;%= user.address.street %>, &lt;%= user.address.suite %>, &lt;%= user.address.city %>, &lt;%= user.address.zipcode %>
                &lt;/address>
                <p><strong>Phone:</strong> &lt;%= user.phone %></p>
                <p><strong>Website:</strong> <a href="http://&lt;%= user.website %>">&lt;%= user.website %></a></p>
                <p><strong>Company:</strong> &lt;%= user.company.name %></p>
            &lt;/article>
        &lt;% &#125; %>
    &lt;/section>
&lt;%- include("../partials/footer") %>
```

We tonen de gebruikers in een lijst op de webpagina. We tonen de naam, gebruikersnaam, email, adres, telefoonnummer, website en bedrijfsnaam van de gebruiker.

## Toevoegen van data (CREATE)

We maken nu een nieuw formulier aan om een gebruiker toe te voegen en plaatsen deze code in een nieuw bestand `views/users/create.ejs`.

```html
&lt;%- include("../partials/header") %>
&lt;section>
    &lt;header>
        <h1>Create User</h1>
    &lt;/header>
    &lt;form action="/users/create" method="POST">
        <div>
            &lt;label for="name">Name:&lt;/label>
            &lt;input type="text" id="name" name="name" required>
        </div>
        <div>
            &lt;label for="username">Username:&lt;/label>
            &lt;input type="text" id="username" name="username" required>
        </div>
        <div>
            &lt;label for="email">Email:&lt;/label>
            &lt;input type="email" id="email" name="email" required>
        </div>
        &lt;fieldset>
            &lt;legend>Address&lt;/legend>
            <div>
                &lt;label for="street">Street:&lt;/label>
                &lt;input type="text" id="street" name="address[street]" required>
            </div>
            <div>
                &lt;label for="suite">Suite:&lt;/label>
                &lt;input type="text" id="suite" name="address[suite]">
            </div>
            <div>
                &lt;label for="city">City:&lt;/label>
                &lt;input type="text" id="city" name="address[city]" required>
            </div>
            <div>
                &lt;label for="zipcode">Zipcode:&lt;/label>
                &lt;input type="text" id="zipcode" name="address[zipcode]" required>
            </div>
        &lt;/fieldset>
        <div>
            &lt;label for="phone">Phone:&lt;/label>
            &lt;input type="text" id="phone" name="phone" required>
        </div>
        <div>
            &lt;label for="website">Website:&lt;/label>
            &lt;input type="text" id="website" name="website">
        </div>
        &lt;fieldset>
            &lt;legend>Company&lt;/legend>
            <div>
                &lt;label for="companyName">Company Name:&lt;/label>
                &lt;input type="text" id="companyName" name="company[name]" required>
            </div>
            <div>
                &lt;label for="catchPhrase">Catch Phrase:&lt;/label>
                &lt;input type="text" id="catchPhrase" name="company[catchPhrase]">
            </div>
            <div>
                &lt;label for="bs">BS:&lt;/label>
                &lt;input type="text" id="bs" name="company[bs]">
            </div>
        &lt;/fieldset>
        &lt;button type="submit">Create User&lt;/button>
    &lt;/form>
&lt;/section>
&lt;%- include("../partials/footer") %>
```

We voorzien hier voor elk veld een input veld. We gebruiken een `fieldset` element om de adres en bedrijfsgegevens te groeperen. Door de naam van de input velden te voorzien van `address[street]` en `company[name]` kunnen we deze gegevens later makkelijk groeperen in een object. Als je dan de body van de request bekijkt in de Express server, dan zie je dat de `address` en `company` gegevens in een object komen te staan. We gaan nu twee routes aanmaken om de data te verwerken: een GET route om het formulier te tonen en een POST route om de data te verwerken.

```typescript
app.get("/users/create", async(req, res) => &#123;
    res.render("users/create");
&#125;);

app.post("/users/create", async(req, res) => &#123;
    let user : User = req.body;
    await createUser(user);
    res.redirect("/users");
&#125;);
```

We doen op het einde van de POST route een redirect naar de gebruikerslijst. Dit zorgt ervoor dat de gebruiker na het toevoegen van een gebruiker terug naar de gebruikerslijst gaat. We voorzien hier nog geen error afhandeling.

We gaan nu de `createUser` functie toevoegen aan ons `database.ts` bestand.

```typescript
export async function getNextId() &#123;
    let users : User[] = await collection.find(&#123;&#125;).sort(&#123;id: -1&#125;).limit(1).toArray();
    if (users.length == 0) &#123;
        return 1;
    &#125; else &#123;
        return users[0].id + 1;
    &#125;
&#125;

export async function createUser(user: User) &#123;
    user.id = await getNextId();
    return await collection.insertOne(user);
&#125;
```

We voorzien hier ook een `getNextId` functie die het volgende id ophaalt uit de database. We sorteren de gebruikers op id in aflopende volgorde en nemen de eerste gebruiker. Als er geen gebruikers zijn dan geven we 1 terug. We voegen dan 1 toe aan het id en geven dit terug. We gaan nu de gebruiker toevoegen aan de database. Vergeet de `createUser` functie niet te importeren in het `index.ts` bestand.

```typescript
import &#123; connect, getUsers, createUser &#125; from "./database";
```

## Delete van data (DELETE)

We gaan nu een button toevoegen aan de gebruikerslijst om een gebruiker te verwijderen. We voegen de volgende code toe aan het `index.ejs` bestand.

```html
&lt;% for (let user of users) &#123; %>
...
&lt;form action="/users/&lt;%= user.id %>/delete" method="POST">
    &lt;button type="submit">Delete&lt;/button>
&lt;/form>
...
&lt;% &#125; %>
```

Er wordt dus voor elke gebruiker in de lijst een formulier aangemaakt met een button om de gebruiker te verwijderen. Dit doen we omdat we geen POST requets kunnen doen vanuit een anchor tag. Merk ook op dat we hier een POST gebruiken en geen DELETE. Dit is omdat we geen DELETE requests kunnen doen vanuit een formulier. We gaan nu de route aanmaken om de gebruiker te verwijderen.

We voorzien een nieuwe route in het `index.ts` bestand.

```typescript
app.post("/users/:id/delete", async(req, res) => &#123;
    let id : number = parseInt(req.params.id);
    await deleteUser(id);
    res.redirect("/users");
&#125;);
```

We gaan nu de `deleteUser` functie toevoegen aan ons `database.ts` bestand.

```typescript
export async function deleteUser(id: number) &#123;
    return await collection.deleteOne(&#123;id: id&#125;);
&#125;
```

We gaan nu de gebruiker verwijderen uit de database. Vergeet de `deleteUser` functie niet te importeren in het `index.ts` bestand.

```typescript
import &#123; connect, getUsers, createUser, deleteUser &#125; from "./database";
```

## Updaten van data (UPDATE)

We kunnen nu de code van het create formulier hergebruiken om een update formulier te maken. We maken een nieuw bestand `views/users/update.ejs` aan.

```html
&lt;%- include("../partials/header") %>
&lt;section>
    &lt;header>
        <h1>Update User</h1>
    &lt;/header>
    &lt;form action="/users/&lt;%= user.id %>/update" method="POST">
        <div>
            &lt;label for="name">Name:&lt;/label>
            &lt;input type="text" id="name" name="name" value="&lt;%= user.name %>" required>
        </div>
        <div>
            &lt;label for="username">Username:&lt;/label>
            &lt;input type="text" id="username" name="username" value="&lt;%= user.username %>" required>
        </div>
        <div>
            &lt;label for="email">Email:&lt;/label>
            &lt;input type="email" id="email" name="email" value="&lt;%= user.email %>" required>
        </div>
        &lt;fieldset>
            &lt;legend>Address&lt;/legend>
            <div>
                &lt;label for="street">Street:&lt;/label>
                &lt;input type="text" id="street" name="address[street]" value="&lt;%= user.address.street %>" required>
            </div>
            <div>
                &lt;label for="suite">Suite:&lt;/label>
                &lt;input type="text" id="suite" name="address[suite]" value="&lt;%= user.address.suite %>">
            </div>
            <div>
                &lt;label for="city">City:&lt;/label>
                &lt;input type="text" id="city" name="address[city]" value="&lt;%= user.address.city %>" required>
            </div>
            <div>
                &lt;label for="zipcode">Zipcode:&lt;/label>
                &lt;input type="text" id="zipcode" name="address[zipcode]" value="&lt;%= user.address.zipcode %>" required>
            </div>
        &lt;/fieldset>
        <div>
            &lt;label for="phone">Phone:&lt;/label>
            &lt;input type="text" id="phone" name="phone" value="&lt;%= user.phone %>" required>
        </div>
        <div>
            &lt;label for="website">Website:&lt;/label>
            &lt;input type="text" id="website" name="website" value="&lt;%= user.website %>">
        </div>
        &lt;fieldset>
            &lt;legend>Company&lt;/legend>
            <div>
                &lt;label for="companyName">Company Name:&lt;/label>
                &lt;input type="text" id="companyName" name="company[name]" value="&lt;%= user.company.name %>" required>
            </div>
            <div>
                &lt;label for="catchPhrase">Catch Phrase:&lt;/label>
                &lt;input type="text" id="catchPhrase" name="company[catchPhrase]" value="&lt;%= user.company.catchPhrase %>">
            </div>
            <div>
                &lt;label for="bs">BS:&lt;/label>
                &lt;input type="text" id="bs" name="company[bs]" value="&lt;%= user.company.bs %>">
            </div>
        &lt;/fieldset>
        &lt;button type="submit">Update User&lt;/button> &lt;!-- Changed the button text to `Update User` -->
    &lt;/form>
&lt;/section>
&lt;%- include("../partials/footer") %>
```

We zorgen ervoor dat de input velden gevuld zijn met de huidige waarden van de gebruiker en dat we als action de update route gebruiken. We gaan nu de route aanmaken om de gebruiker te updaten.

We voorzien weer twee routes in het `index.ts` bestand. Een GET route om het formulier te tonen en een POST route om de data te verwerken.

```typescript
app.get("/users/:id/update", async(req, res) => &#123;
    let id : number = parseInt(req.params.id);
    let user : User | null = await getUserById(id);
    res.render("users/update", &#123;
        user: user
    &#125;);
&#125;);

app.post("/users/:id/update", async(req, res) => &#123;
    let id : number = parseInt(req.params.id);
    let user : User = req.body;
    await updateUser(id, user);
    res.redirect("/users");
&#125;);
```

We redirecten ook hier op het einde van de POST route naar de gebruikerslijst. We gaan nu de `getUserById` en `updateUser` functies toevoegen aan ons `database.ts` bestand.

```typescript
export async function getUserById(id: number) &#123;
    return await collection.findOne(&#123; id: id &#125;);
&#125;

export async function updateUser(id: number, user: User) &#123;
    return await collection.updateOne(&#123; id : id &#125;, &#123; $set:  user &#125;);
&#125;
```

Vergeet de `getUserById` en `updateUser` functies niet te importeren in het `index.ts` bestand.

```typescript
import &#123; connect, getUsers, createUser, deleteUser, getUserById, updateUser &#125; from "./database";
```
