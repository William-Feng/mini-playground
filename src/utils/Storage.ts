export class Storage {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
  }

  static getString(key: string, defaultValue: string = ""): string {
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch (error) {
      console.error(`Failed to get string from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  static setString(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to save string to localStorage: ${key}`, error);
    }
  }

  static getNumber(key: string, defaultValue: number = 0): number {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      const parsed = parseInt(item, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (error) {
      console.error(`Failed to get number from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  static setNumber(key: string, value: number): void {
    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to save number to localStorage: ${key}`, error);
    }
  }

  static getBoolean(key: string, defaultValue: boolean = false): boolean {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return item === "true";
    } catch (error) {
      console.error(`Failed to get boolean from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  static setBoolean(key: string, value: boolean): void {
    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error(`Failed to save boolean to localStorage: ${key}`, error);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage', error);
    }
  }
}