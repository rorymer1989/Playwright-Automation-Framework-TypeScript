import { test, expect } from "@playwright/test";
import { escapeRegExp } from "../../utilities/assertionUtil";

test.describe("assertionUtil.escapeRegExp", () => {
    test("treats URL metacharacters literally", () => {
        const re = new RegExp(escapeRegExp("/inventory-item.html?id="));
        expect(re.test("https://shop/inventory-item.html?id=4")).toBeTruthy();
        expect(re.test("https://shop/inventory-itemXhtmlid=4")).toBeFalsy(); // '.' and '?' are not wildcards
    });

    test("escapes every special character", () => {
        const special = ".*+?^${}()|[]\\";
        expect(new RegExp(escapeRegExp(special)).test(special)).toBeTruthy();
    });
});
