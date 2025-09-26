import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
    });

    it("should return true for correct password", async () => {
        const result1 = await checkPasswordHash(password1, hash1);
        const result2 = await checkPasswordHash(password2, hash1);
        
        expect(result1).toBe(true);
        expect(result2).toBe(false);
    });
});



describe("JWT Tokens", () => {
    const userID1 = "user_1";
    const userID2 = "user_2";
    const secret = "secret_phrase";
    let jwt1: string;
    let jwt2: string;
    let jwt3: string;

    beforeAll(async () => {
        jwt1 = makeJWT(userID1, 10000, secret);
        jwt2 = makeJWT(userID2, 10000, secret);
        jwt3 = makeJWT(userID2, 0, secret);
    });

    it("should return true for correct JWT", async () => {
        const result1 = validateJWT(jwt1, secret);
        expect(result1).toBe("user_1");
        expect(() => validateJWT(jwt2, "not_the_secret")).toThrowError('invalid signature');
        expect(() => validateJWT(jwt3, secret)).toThrowError('jwt expired');
    });
});

