import { transform } from '@babel/standalone';
import Editor from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

class SecureTranspiler {
  private static readonly DANGEROUS_PATTERNS = [
    /eval\s*\(/g,
    /Function\s*\(/g,
    /document\.(write|createElement)/g,
    /innerHTML\s*=/g,
    /outerHTML\s*=/g,
    /window\./g,
    /global\./g,
    /process\./g,
    /__dirname|__filename/g,
    /require\s*\(/g, // Prevent Node.js requires
    /import\s*\(/g, // Prevent dynamic imports
  ];

  static validateCode(code: string): void {
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(code)) {
        throw new Error(`Potentially unsafe code detected: ${pattern.source}`);
      }
    }

    // Additional AST-based validation could go here
    if (code.length > 50000) {
      // Prevent excessively large components
      throw new Error('Component code exceeds maximum size limit');
    }
  }

  static transpile(sourceCode: string): string {
    this.validateCode(sourceCode);

    try {
      const result = transform(sourceCode, {
        presets: ['react'],
        plugins: ['transform-runtime'],
        sourceMaps: false, // TODO: Disable for production
        compact: true,
      });

      if (!result.code) {
        throw new Error('Transpilation produced no output');
      }

      // Wrap in IIFE that returns the component
      return `
          (function(React) {
            "use strict";
            ${result.code}
            
            // Auto-detect component export
            if (typeof Component !== 'undefined') return Component;
            if (typeof MyComponent !== 'undefined') return MyComponent;
            
            throw new Error('No valid React component found');
          })
        `;
    } catch (error: any) {
      throw new Error(`Transpilation failed: ${error.message}`);
    }
  }
}

interface ComponentPlaygroundProps {
  initialCode?: string;
  componentName: string;
  onCodeChange: (data: string) => void;
}

const ComponentPlayground = ({
  onCodeChange,
  componentName,
}: ComponentPlaygroundProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((value?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value) {
        try {
          onCodeChange(SecureTranspiler.transpile(value));
        } catch (error) {
          console.error('Transpilation error:', error);
        }
      }
      timeoutRef.current = null;
    }, 300); 
  }, [onCodeChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const defaultCode = `function ${componentName}(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
    </div>
  );
}`;
  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      value={defaultCode}
      onChange={handleChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
      }}
    />
  );
};

export { ComponentPlayground };
