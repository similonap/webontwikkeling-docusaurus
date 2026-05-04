import { getStudents } from "./async";

describe("test for the getStudents function", () => {
    it("should return a list of students", async () => {
        const students = await getStudents(2);
        expect(students).toEqual([
            {name: "Alice", age: 20},
            {name: "Bob", age: 21}
        ]);
    });

    it("should return the exact amount of students requested", async () => {
        const students = await getStudents(3);
        expect(students.length).toBe(3);
    });

    it("should return an empty list if the limit is 0", async () => {
        const students = await getStudents(0);
        expect(students).toEqual([]);
    });

    it("should return an empty list if the limit is negative", async () => {
        try {
            await getStudents(-1);
            fail("should have thrown an error");
        } catch (error: any) {
            expect(error.message).toBe("Limit must be a positive number");
        }
    });

    it("should return a list of students after 1 second", async () => {
        const start = Date.now();
        await getStudents(2);
        const end = Date.now();
        expect(end - start).toBeGreaterThanOrEqual(1000);
    });
});
