// Performance Monitoring Utility for Sub-16ms Target
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: number = 0;
  private frameCount: number = 0;
  private measurements: number[] = [];

  public constructor() {
    if (PerformanceMonitor.instance) {
      return PerformanceMonitor.instance;
    }
    PerformanceMonitor.instance = this;
    this.startTime = performance.now();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private static marks: Record<string, number> = {};

  public static startMeasure(name: string) {
    this.marks[name] = performance.now();
  }

  public static endMeasure(name: string) {
    const start = this.marks[name];
    if (start) {
      const duration = performance.now() - start;
      if (duration > 16) {
        console.warn(`⚠️ SLOW: ${name} took ${duration.toFixed(2)}ms (target: <16ms)`);
      }
      delete this.marks[name];
    }
  }

  // Measure individual operation performance
  public static measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    if (duration > 16) {
      console.warn(`⚠️ SLOW: ${name} took ${duration.toFixed(2)}ms (target: <16ms)`);
    } else {
      console.log(`✅ FAST: ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  // Start monitoring session
  public startSession() {
    this.startTime = performance.now();
    this.frameCount = 0;
    this.measurements = [];
  }

  // Record frame performance
  public recordFrame() {
    const now = performance.now();
    const frameTime = now - this.startTime;
    const fps = 1000 / frameTime;

    this.measurements.push(frameTime);
    this.frameCount++;

    // Keep only last 60 measurements for rolling average
    if (this.measurements.length > 60) {
      this.measurements = this.measurements.slice(-60);
    }

    // Check if we are meeting target
    const avgFrameTime = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
    const isFast = avgFrameTime < 16;

    if (this.frameCount % 60 === 0) {
      const avgFPS = Math.round(1000 / avgFrameTime);
      console.log(`🎯 Performance Report:
        Average Frame Time: ${avgFrameTime.toFixed(2)}ms
        Target: <16ms
        Status: ${isFast ? '✅ FAST' : '⚠️ SLOW'}
        FPS: ${avgFPS}
        Frames Sampled: ${this.frameCount}
      `);
    }
  }

  // Get current performance stats
  public getStats() {
    if (this.measurements.length === 0) {
      return { avgFrameTime: 0, isFast: true, fps: 0 };
    }

    const avgFrameTime = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
    const fps = Math.round(1000 / avgFrameTime);
    const isFast = avgFrameTime < 16;

    return {
      avgFrameTime: Math.round(avgFrameTime * 100) / 100,
      isFast,
      fps,
      sampleCount: this.measurements.length
    };
  }

  // Memory usage monitoring
  public static checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedJSHeapSize = memory.usedJSHeapSize / 1024 / 1024; // MB
      const totalJSHeapSize = memory.totalJSHeapSize / 1024 / 1024; // MB

      console.log(`💾 Memory Usage:
        Used JS Heap: ${usedJSHeapSize.toFixed(2)} MB
        Total JS Heap: ${totalJSHeapSize.toFixed(2)} MB
        Memory Pressure: ${usedJSHeapSize / totalJSHeapSize > 0.8 ? 'HIGH' : 'NORMAL'}
      `);

      return {
        used: usedJSHeapSize,
        total: totalJSHeapSize,
        pressure: usedJSHeapSize / totalJSHeapSize
      };
    }
    return null;
  }

  // Debounced function for expensive operations
  public static debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  // Throttled function for frequent updates
  public static throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        inThrottle = true;
        fn(...args);
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
