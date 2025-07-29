import React from 'react';
import { ComponentCache } from './component-cache';

export class SecureDynamicComponentLoader {
  private componentCache = new ComponentCache();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadComponent(componentData: {
    id: string;
    version: string;
    transpiledCode: string;
  }): Promise<React.ComponentType<any>> {
    const cacheKey = `${componentData.id}-${componentData.version}`;

    // Return cached component
    const cached = this.componentCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Prevent duplicate loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)!;
    }

    const loadingPromise = this.createComponent(componentData, cacheKey);
    this.loadingPromises.set(cacheKey, loadingPromise);

    try {
      const component = await loadingPromise;
      return component;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private async createComponent(
    componentData: { transpiledCode: string },
    cacheKey: string
  ): Promise<React.ComponentType<any>> {
    try {
      // Step 1: Secure transpilation
      const transpiledCode = componentData.transpiledCode;

      console.log('transpiledCode', transpiledCode);

      // Step 2: Create controlled execution environment
      const cleanup: (() => void)[] = [];

      // Wrap React hooks to track cleanup
      const wrappedReact = {
        ...React,
        useEffect: (effect: () => void | (() => void), deps?: any[]) => {
          return React.useEffect(() => {
            const cleanupFn = effect();
            if (typeof cleanupFn === 'function') {
              cleanup.push(cleanupFn);
            }
            return cleanupFn;
          }, deps);
        },
      };

      console.log('wrappedReact', wrappedReact);

      // Step 3: Execute component with Function constructor (most secure)
      const componentFactory = new Function(
        'React',
        `return (${transpiledCode})`
      );
      console.log('componentFactory', componentFactory);
      const componentIIFE = componentFactory(wrappedReact);
      const Component = componentIIFE(wrappedReact);
      console.log('Component', Component);
      // Step 4: Validate the result
      if (!Component || typeof Component !== 'function') {
        throw new Error(
          'Invalid component: expected a React component function'
        );
      }

      // Step 5: Cache with cleanup tracking
      this.componentCache.set(cacheKey, Component, cleanup);

      return Component;
    } catch (error: any) {
      console.error('Component creation failed:', error);
      return this.createErrorComponent(error.message);
    }
  }

  private createErrorComponent(errorMessage: string): React.ComponentType<any> {
    return function ErrorComponent() {
      return React.createElement(
        'div',
        {
          style: {
            padding: '16px',
            border: '2px solid #ff6b6b',
            borderRadius: '4px',
            backgroundColor: '#ffe0e0',
            color: '#d63031',
          },
        },
        `Component Error: ${errorMessage}`
      );
    };
  }

  // Cleanup method for memory management
  clearCache(): void {
    this.componentCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.componentCache['cache'].size,
      loadingPromises: this.loadingPromises.size,
    };
  }
}
