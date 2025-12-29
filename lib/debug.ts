export class Timer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
  }

  end(status?: string) {
    const duration = Date.now() - this.startTime;
    logger.info(this.label, `Completed in ${duration}ms`, { status });
  }
}

export const logger = {
  info: (source: string, message: string, data?: any) => {
    console.log(`[INFO] ${source}: ${message}`, data || '');
  },
  warn: (source: string, message: string, data?: any) => {
    console.warn(`[WARN] ${source}: ${message}`, data || '');
  },
  error: (source: string, message: string, data?: any) => {
    console.error(`[ERROR] ${source}: ${message}`, data || '');
  }
};