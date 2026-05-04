import * as jwt from "jsonwebtoken";
import { promisify } from "util";

interface User {
    id: string
    email: string
}

let user: User = {
    id: "1",
    email: "andie.similon@ap.be"
}


let jwtToken1: string = jwt.sign(user, "secret");
let jwtToken2: string = jwt.sign(user, "differentsecret");

console.log(jwtToken1);
console.log(jwtToken2);

try {
    let decoded = jwt.verify(jwtToken1, "secret");
    console.log(decoded);
} catch (e) {
    console.log("ERR");
}

jwtToken1.split(".").forEach((part, index) => {
    if (index < 2) {
        console.log(Buffer.from(part, 'base64').toString());
    }
});






export { }