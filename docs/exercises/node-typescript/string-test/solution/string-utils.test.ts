
import { toUpperFunction } from "./string-utils";

describe("toUpperFunction", () => {
    it("should convert a string to uppercase", () => {
        expect(toUpperFunction("hello")).toBe("HELLO");
    });

    it("should not convert a string that is already uppercase", () => {
        expect(toUpperFunction("HELLO")).toBe("HELLO");
    });

    it("should not convert a string that is not a letter", () => {
        expect(toUpperFunction("123")).toBe("123");
    });

    it("should convert a string with mixed characters to uppercase", () => {
        expect(toUpperFunction("Hello123")).toBe("HELLO123");
    });

    it("should convert a string containing spaces to uppercase", () => {
        expect(toUpperFunction("hello world")).toBe("HELLO WORLD");
    });

    it("should convert characters like umlauts to uppercase", () => {
        expect(toUpperFunction("äöü")).toBe("ÄÖÜ");
    });
});