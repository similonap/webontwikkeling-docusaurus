import express from "express";

function assertNotEmpty(value: string, errorMessage: string) {
    if (value === "") {
        throw new Error(errorMessage);
    }
}

function assertTrue(value: boolean, errorMessage: string) {
    if (!value) {
        throw new Error(errorMessage);
    }
}

export function contactRouter() {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("contact/contact", {
            success: undefined,
            error: undefined,
            firstname: "",
            lastname: "",
            email: "",
            message: ""
        });
    });
    
    router.post("/", (req, res) => {
        let agree: boolean = req.body.agree === "agree";
        let firstname: string = req.body.firstname;
        let lastname: string = req.body.lastname;
        let email: string = req.body.email;
        let message: string = req.body.message;
    
        try {
            assertTrue(agree, "You must agree to the terms and conditions");
            assertNotEmpty(firstname, "First name cannot be empty!");
            assertNotEmpty(lastname, "Last name cannot be empty!");
            assertNotEmpty(email, "Email cannot be empty!");
            assertNotEmpty(message, "Message cannot be empty!");
    
            res.render("contact/contact", {
                success: `Thank you for contacting us, ${firstname}! We will get back to you on the following email: ${email}`,
                error: undefined,
                firstname: "",
                lastname: "",
                email: "",
                message: ""
            });
        } catch (e: any) {
            res.render("contact", {
                success: undefined,
                error: e.message,
                firstname: firstname,
                lastname: lastname,
                email: email,
                message: message
            });
        
        } 
    });
    
    return router;
}