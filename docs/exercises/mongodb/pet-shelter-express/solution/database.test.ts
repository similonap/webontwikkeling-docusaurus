import { collection, connect , client , exit} from "./database";

describe("database functions", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("seedDatabase performs correct operations", async () => {
        jest.spyOn(client, "connect").mockResolvedValue({} as any);
        jest.spyOn(collection, "deleteMany").mockResolvedValue({} as any);
        jest.spyOn(collection, "dropIndex").mockResolvedValue({} as any);
        jest.spyOn(collection, "createIndex").mockResolvedValue({} as any);
        jest.spyOn(collection, "insertMany").mockResolvedValue({} as any);
        await connect(); 

        expect(client.connect).toHaveBeenCalled();
        expect(collection.deleteMany).toHaveBeenCalledWith({});
        expect(collection.dropIndex).toHaveBeenCalledWith("*");
        expect(collection.createIndex).toHaveBeenCalledWith({
            breed: "text", name: "text", type: "text"
        });
        expect(collection.insertMany).toHaveBeenCalledWith(expect.any(Array));
    });


    test("exit closes connection and exits the application", async() => {
        jest.spyOn(process, "exit").mockImplementation((() => {}) as any);
        jest.spyOn(client, "close").mockResolvedValue({} as any);

        await exit();

        expect(client.close).toHaveBeenCalled();
        expect(process.exit).toHaveBeenCalledWith(0);
    });
});