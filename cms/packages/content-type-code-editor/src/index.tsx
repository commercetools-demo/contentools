import { transform } from '@babel/standalone';
import {
  EPropertyType,
  PropertySchema,
} from '@commercetools-demo/contentools-types';
import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

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

  static cleanCode(sourceCode: string): string {
    return sourceCode
      .replace(/import\s+.*?\s+from\s+['"][^'"]*['"];?\s*/g, '')
      .replace(/import\s+['"][^'"]*['"];?\s*/g, '');
  }

  static transpile(sourceCode: string, componentName: string): string {
    this.validateCode(sourceCode);
    const cleanedCode = this.cleanCode(sourceCode);

    try {
      const result = transform(cleanedCode, {
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
            if (typeof ${componentName} !== 'undefined') return ${componentName};
            
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
  propertySchema: Record<string, PropertySchema>;
  props: string;
  onCodeChange: (data: { transpiledCode: string; text: string }) => void;
}

const ComponentPlayground = ({
  onCodeChange,
  initialCode,
  componentName,
  propertySchema,
  props,
}: ComponentPlaygroundProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const comments = useMemo(() => {
    if (!propertySchema || Object.keys(propertySchema).length === 0) {
      return '';
    }
    const property: [string, PropertySchema] | undefined = Object.entries(
      propertySchema
    ).find((schema) => schema?.[1].type === EPropertyType.RICH_TEXT);
    if (!!property) {
      return `// use <div dangerouslySetInnerHTML={{__html: ${property?.[0]}}} /> to render the HTML stored in Rich text editor'`;
    }
    return '';
  }, [propertySchema]);

  const handleChange = useCallback(
    (value?: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (value) {
          try {
            onCodeChange({
              transpiledCode: SecureTranspiler.transpile(value, componentName),
              text: value,
            });
          } catch (error) {
            console.error('Transpilation error:', error);
          }
        }
        timeoutRef.current = null;
      }, 300);
    },
    [onCodeChange]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const defaultCode = `import React from 'react';
import styled from 'styled-components';
${comments}

function ${componentName}({${props}}) {
  return (
    <div>
      // TODO: Add your component code here
    </div>
  );
}`;
  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      value={initialCode || defaultCode}
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
