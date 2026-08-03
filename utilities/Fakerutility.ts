import { faker } from '@faker-js/faker';

export class FakerUtility {
  private static readonly LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly DIGITS = '0123456789';

  // ------------------- Name -------------------

  static getFullName(): string {
    return faker.person.fullName();
  }

  static getFirstName(): string {
    return faker.person.firstName();
  }

  static getLastName(): string {
    return faker.person.lastName();
  }

  // ------------------- Email -------------------

  static getEmail(): string {
    return faker.internet.email();
  }

  static getSafeEmail(): string {
    return faker.internet.exampleEmail();
  }

  // ------------------- Indian Mobile -------------------

  static getIndianMobile(): string {
    const firstDigit = faker.number.int({ min: 6, max: 9 });
    const remainingDigits = faker.string.numeric(9);

    return `${firstDigit}${remainingDigits}`;
  }

  // ------------------- Aadhaar -------------------

  static getAadhaarNumber(): string {
    return faker.string.numeric(12);
  }

  // ------------------- Passport -------------------

  static getIndianPassport(): string {
    const letters = faker.string.alpha({
      length: 2,
      casing: 'upper',
    });

    const digits = faker.string.numeric(7);

    return `${letters}${digits}`;
  }

  // ------------------- Address -------------------

  static getIndianStreet(): string {
    return faker.location.street();
  }

  static getFullAddress(): string {
    return faker.location.streetAddress(true);
  }

  static getCity(): string {
    return faker.location.city();
  }

  static getState(): string {
    return faker.location.state();
  }

  static getPinCode(): string {
    return faker.string.numeric(6);
  }

  // ------------------- Personal Details -------------------

  static getBloodGroup(): string {
    const groups = [
      'A+',
      'A-',
      'B+',
      'B-',
      'AB+',
      'AB-',
      'O+',
      'O-',
    ] as const;

    return faker.helpers.arrayElement(groups);
  }

  static getHeightCm(): number {
    return faker.number.int({
      min: 150,
      max: 190,
    });
  }

  static getWeightKg(): number {
    return faker.number.int({
      min: 45,
      max: 95,
    });
  }

  static getAnnualIncome(): string {
    const income = faker.number.int({
      min: 200000,
      max: 2500000,
    });

    return `₹${income}`;
  }

  // ------------------- Job -------------------

  static getJobTitle(): string {
    return faker.person.jobTitle();
  }

  // ------------------- Misc -------------------

  static getUUID(): string {
    return faker.string.uuid();
  }

  static getRandomWord(): string {
    return faker.lorem.word();
  }

  static getSentence(): string {
    return faker.lorem.sentence();
  }

  static getBoolean(): boolean {
    return faker.datatype.boolean();
  }

  // ------------------- PAN -------------------

  static generatePAN(): string {
    const randomChar = (source: string): string =>
      source.charAt(faker.number.int({ min: 0, max: source.length - 1 }));

    let pan = '';

    // First 3 letters
    for (let i = 0; i < 3; i++) {
      pan += randomChar(this.LETTERS);
    }

    // Individual
    pan += 'P';

    // Surname Initial
    pan += randomChar(this.LETTERS);

    // Four digits
    for (let i = 0; i < 4; i++) {
      pan += randomChar(this.DIGITS);
    }

    // Last alphabet
    pan += randomChar(this.LETTERS);

    return pan;
  }
}