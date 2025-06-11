import type { Logger } from '@playwright/test';

export class CustomLogger implements Logger {
  isEnabled(name: string, severity: 'error' | 'warning' | 'info' | 'verbose'): boolean {
    return severity === 'error' || severity === 'warning';
  }

  log(name: string, severity: 'error' | 'warning' | 'info' | 'verbose', message: string): void {
    const time = new Date().toISOString();
    console.log(`[${time}] [${name}] [${severity.toUpperCase()}]: ${message}`);
  }
}
