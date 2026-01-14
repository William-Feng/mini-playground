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
    return localStorage.getItem(key) ?? defaultValue;
  }

  static setString(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getNumber(key: string, defaultValue: number = 0): number {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    const parsed = parseInt(item, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  static setNumber(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  static getBoolean(key: string, defaultValue: boolean = false): boolean {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return item === "true";
  }

  static setBoolean(key: string, value: boolean): void {
    localStorage.setItem(key, value.toString());
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}