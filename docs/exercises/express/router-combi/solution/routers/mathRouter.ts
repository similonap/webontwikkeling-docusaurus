import express from "express";

function performOperation(op: string, a: number, b: number) {
    if (!["add", "min", "mult", "div"].includes(op)) {
        throw new Error("Invalid operation: " + op);
    }
    if (isNaN(a) || isNaN(b)) {
        throw new Error("Both query parameters (a,b) have to be of type number.")
    }
    switch (op) {
        case 'add':
            return a + b;
        case 'min':
            return a - b;
        case 'mult':
            return a * b;
        case 'div':
            if (b == 0) {
                throw new Error("Division by 0 is not allowed.");
            }
            return a / b;
    }
};

export function mathRouter() {
    const router = express.Router();

    router.get('/:operation', (req, res) => {
        const operation: string = req.params.operation;
        if (typeof req.query.a === "string" && typeof req.query.b === "string") {
            const a = parseFloat(req.query.a);
            const b = parseFloat(req.query.b);
            try {
                const result = performOperation(operation, a, b);
                res.json({ result });
            } catch (e: any) {
                res.json({ error: e.message });
            }
        } else {
            res.json({ error: "Both query parameters (a,b) have to be specified." });
        }
    });

    return router;
}