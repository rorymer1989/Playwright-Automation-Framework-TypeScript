import { retry } from "./retryUtil.js";
import type { Locator } from "@playwright/test";

interface SmartFillOptions {
    retries?: number;
    timeout?: number;
    delay?: number;
}

export async function smartFill(
    locator: Locator,
    value: string,
    {
        retries = 3,
        timeout = 5000,
        delay = 1000
    }: SmartFillOptions = {}
): Promise<void> {

    await retry(async () => {

        await locator.waitFor({
            state: "visible",
            timeout
        });

        await locator.clear();

        await locator.fill(value);

        const enteredValue = await locator.inputValue();

        if (enteredValue !== value) {

            throw new Error(
                `Expected "${value}" but found "${enteredValue}"`
            );

        }

    }, {

        retries,
        delay,
        actionName: "Smart Fill"

    });

}