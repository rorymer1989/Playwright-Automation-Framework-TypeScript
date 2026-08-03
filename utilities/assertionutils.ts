import { expect, Locator, Page, APIResponse } from '@playwright/test';

export class Assertion {
  /* ==========================
       Element Assertions
    ========================== */

  static async assertVisible(
    locator: Locator,
    message = 'Element should be visible'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeVisible();
  }

  static async assertHidden(
    locator: Locator,
    message = 'Element should be hidden'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeHidden();
  }

  static async assertEnabled(
    locator: Locator,
    message = 'Element should be enabled'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeEnabled();
  }

  static async assertDisabled(
    locator: Locator,
    message = 'Element should be disabled'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeDisabled();
  }

  static async assertEditable(
    locator: Locator,
    message = 'Element should be editable'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeEditable();
  }

  static async assertChecked(
    locator: Locator,
    message = 'Checkbox should be checked'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeChecked();
  }

  static async assertFocused(
    locator: Locator,
    message = 'Element should be focused'
  ): Promise<void> {
    console.log(`${message}`);
    await expect(locator).toBeFocused();
  }

  /* ==========================
       Text Assertions
    ========================== */

  static async assertText(
    locator: Locator,
    expectedText: string | RegExp
  ): Promise<void> {
    console.log(`Validating text: ${expectedText}`);
    await expect(locator).toHaveText(expectedText);
  }

  static async assertContainsText(
    locator: Locator,
    expectedText: string | RegExp
  ): Promise<void> {
    console.log(`Validating partial text: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
  }

  static async assertValue(
    locator: Locator,
    expectedValue: string
  ): Promise<void> {
    console.log('🔍 Validating input value');
    await expect(locator).toHaveValue(expectedValue);
  }

  static async assertPlaceholder(
    locator: Locator,
    placeholder: string
  ): Promise<void> {
    console.log('Validating placeholder');
    await expect(locator).toHaveAttribute('placeholder', placeholder);
  }

  /* ==========================
       Page Assertions
    ========================== */

  static async assertTitle(
    page: Page,
    title: string | RegExp
  ): Promise<void> {
    console.log('Validating page title');
    await expect(page).toHaveTitle(title);
  }

  static async assertTitleContains(
    page: Page,
    title: string
  ): Promise<void> {
    console.log('Validating page title');
    await expect(page).toHaveTitle(new RegExp(title));
  }

  static async assertURL(
    page: Page,
    url: string | RegExp
  ): Promise<void> {
    console.log('🔍 Validating URL');
    await expect(page).toHaveURL(url);
  }

  static async assertURLContains(
    page: Page,
    text: string
  ): Promise<void> {
    console.log(`🔍 Validating URL contains ${text}`);
    await expect(page).toHaveURL(new RegExp(text));
  }

  /* ==========================
       Count Assertions
    ========================== */

  static async assertCount(
    locator: Locator,
    expectedCount: number
  ): Promise<void> {
    console.log('🔍 Validating locator count');
    await expect(locator).toHaveCount(expectedCount);
  }

  /* ==========================
       Attribute Assertions
    ========================== */

  static async assertAttribute(
    locator: Locator,
    attribute: string,
    value: string
  ): Promise<void> {
    console.log(`🔍 Validating attribute ${attribute}`);
    await expect(locator).toHaveAttribute(attribute, value);
  }

  static async assertClass(
    locator: Locator,
    className: string | RegExp
  ): Promise<void> {
    console.log('🔍 Validating class');
    await expect(locator).toHaveClass(className);
  }

  /* ==========================
       Generic Assertions
    ========================== */

  static assertTrue(value: boolean, message = 'Expected value to be true'): void {
    expect(value, message).toBeTruthy();
  }

  static assertFalse(value: boolean, message = 'Expected value to be false'): void {
    expect(value, message).toBeFalsy();
  }

  static assertEqual<T>(actual: T, expected: T): void {
    expect(actual).toBe(expected);
  }

  static assertNotEqual<T>(actual: T, expected: T): void {
    expect(actual).not.toBe(expected);
  }

  static assertContains(actual: string, expected: string): void {
    expect(actual).toContain(expected);
  }

  static assertNotContains(actual: string, expected: string): void {
    expect(actual).not.toContain(expected);
  }

  static assertGreaterThan(actual: number, expected: number): void {
    expect(actual).toBeGreaterThan(expected);
  }

  static assertLessThan(actual: number, expected: number): void {
    expect(actual).toBeLessThan(expected);
  }

  /* ==========================
       API Assertions
    ========================== */

  static assertStatus(
    response: APIResponse,
    expectedStatus: number
  ): void {
    expect(response.status()).toBe(expectedStatus);
  }

  static async assertJsonValue<T extends Record<string, unknown>>(
    response: APIResponse,
    key: keyof T,
    expectedValue: T[keyof T]
  ): Promise<void> {
    const body = (await response.json()) as T;
    expect(body[key]).toBe(expectedValue);
  }
}