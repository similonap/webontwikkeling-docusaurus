import { collection, getPets } from "./database";
import request from "supertest";
import app from "./app";

describe("Endpoint tests", () => {

    const mockPets = [
        { name: "Buddy", age: 2, type: "dog", breed: "Golden Retriever" },
        { name: "Daisy", age: 3, type: "dog", breed: "Beagle" },
        { name: "Coco", age: 1, type: "dog", breed: "Poodle" },
        { name: "Charlie", age: 2, type: "cat", breed: "Siamese" },
        { name: "Luna", age: 3, type: "cat", breed: "Persian" }
    ];

    test("that /pets calls the getPets function", async () => {
        const toArrayMock = jest.fn().mockResolvedValue(mockPets);
        const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
            toArray: toArrayMock
        }) as any);
        const response = await request(app).get("/pets");
        expect(response.status).toBe(200);
        expect(findMock).toHaveBeenCalledWith({});
    });

    test("that /pets/sort returns all pets", async () => {
        const fields: string[] = ["name", "age", "type", "breed"];
        for (let field of fields) {
            const toArrayMock = jest.fn().mockResolvedValue(mockPets);
            const sortMock = jest.fn().mockImplementation(() => ({
                toArray: toArrayMock
            }));
            const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
                sort: sortMock
            }) as any);
            const response = await request(app).get("/pets/sort?field=" + field);
            expect(response.status).toBe(200);
            expect(findMock).toHaveBeenCalledWith({});
            expect(sortMock).toHaveBeenCalledWith({ [field]: 1 });
        }
    });

    test("that /pets/sort?field=invalid returns error", async () => {
        const response = await request(app).get("/pets/sort?field=invalid");
        expect(response.status).toBe(500);
    });

    test("that /pets/search calls the search function with search string", async () => {
        const toArrayMock = jest.fn().mockResolvedValue(mockPets);
        const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
            toArray: toArrayMock
        }) as any);
        const response = await request(app).get("/pets/search?q=Buddy");
        expect(response.status).toBe(200);
        expect(findMock).toHaveBeenCalledWith({ $text: { $search: "Buddy" } });
    });

    test("that /pets/ageBetween calls the getPetsWithAgeBetween function with min and max", async () => {
        const toArrayMock = jest.fn().mockResolvedValue(mockPets);
        const sortMock = jest.fn().mockImplementation(() => ({
            toArray: toArrayMock
        }));
        const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
            sort: sortMock
        }) as any);
        const response = await request(app).get("/pets/ageBetween?min=5&max=10");
        expect(response.status).toBe(200);
        expect(findMock).toHaveBeenCalledWith({ age: { $gte: 5, $lte: 10 } });
    });

    test("that /pets/search without query parameter calls a regular find function", async () => {
        const toArrayMock = jest.fn().mockResolvedValue(mockPets);
        const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
            toArray: toArrayMock
        }) as any);
        const response = await request(app).get("/pets/search");
        expect(response.status).toBe(200);
        expect(findMock).toHaveBeenCalledWith({});
    });

    test("that /pets/:type calls the getPetsByType function with type", async () => {
        const toArrayMock = jest.fn().mockResolvedValue(mockPets);
        const findMock = jest.spyOn(collection, 'find').mockImplementation(() => ({
            toArray: toArrayMock
        }) as any);
        const response = await request(app).get("/pets/dog");
        expect(response.status).toBe(200);
        expect(findMock).toHaveBeenCalledWith({ type: "dog" });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

});

export { }