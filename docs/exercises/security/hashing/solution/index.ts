import readline from "readline-sync";
import bcrypt from "bcrypt";

interface User {
    username: string;
    password: string;
}

const users : User[] = [
    { username: "admin", password: "$2b$10$O.q/SHi69C.gUAPrejyQQOTgGhmcAWgknS.nPxpovli9c.EEOK0e6" },
    { username: "user", password: "$2b$10$CXpbsPHPNkf21OLEAUmF2eX0hv9MGoFFqIaitCq2G6II1PiVu1UmO" }
];

async function main() {

    users.push({
        username: "user2",
        password: await bcrypt.hash("password123", 10)
    });

    let username: string = readline.question("Enter a username: ");
    let password : string = readline.question("Enter a password: ");
    
    let user = users.find(u => u.username === username);

    if (user && await bcrypt.compare(password, user.password)) {
        console.log("Login successful!");
    } else {
        console.log("Invalid username or password.");
    }
}
main();

export {}