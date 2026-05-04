import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { addCredits, buySong, getCurrentUser, getSongById, getSongs } from "./data";
import { Song, User } from "./types";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || /* istanbul ignore next */ 3000);

app.post("/buy", async(req,res) => {
    res.render("billing");
})

app.get("/billing", async(req,res) => {
    res.render("billing");
})

app.post("/billing", async(req,res) => {
    res.render("billing");
});

app.get("/", (req,res) => {
    res.redirect("/songs");
})

app.get("/songs", async(req, res) => {
    res.render("songs")
});

app.get("/songs/:id", async(req, res) => {
    res.render("song")
})

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});


export { app };