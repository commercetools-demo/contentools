import * as path from 'path';
import * as fs from 'fs';
// For Vite 6 compatibility, this file should be converted to ESM or the project should add "type": "module" to package.json

/**
 * Compiles TypeScript code to JavaScript using Vite
 * @param sourceCode The TypeScript source code
 * @returns Object containing compilation success, output text and errors if any
 */
export async function compileTypeScript(sourceCode: string) {
  // Create temporary directory for files inside src to comply with rootDir config
  const tempDir = path.join(process.cwd(), 'src', 'temp-compile');
  const tempFile = path.join(tempDir, 'component.ts');
  const outDir = path.join(tempDir, 'dist');
  
  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Set environment variable to suppress CJS warning temporarily
    // See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated
    process.env.VITE_CJS_IGNORE_WARNING = 'true';
    
    // Dynamic import of Vite - this avoids the CJS deprecation warning
    const vite = await import('vite');
    
    // Write source code and types to files
    fs.writeFileSync(tempFile, sourceCode, 'utf-8');
    
    // Create a minimal tsconfig.json for Vite with paths to lit
    const tsConfig = {
      compilerOptions: {
        target: "ES2015",
        module: "ESNext",
        moduleResolution: "node",
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        skipLibCheck: true,
        isolatedModules: true,
        baseUrl: ".",
        paths: {
          "lit": ["../../node_modules/lit"],
          "lit/*": ["../../node_modules/lit/*"]
        }
      }
    };
    fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2), 'utf-8');
    
    // Use Vite's build function directly
    try {
      await vite.build({
        configFile: false,
        root: tempDir,
        build: {
          write: true,
          outDir,
          emptyOutDir: true,
          lib: {
            entry: tempFile,
            formats: ['es'],
            fileName: () => 'component.js'
          },
          rollupOptions: {
            external: [],
            output: {
              inlineDynamicImports: true,
            }
          },
          minify: false,
          sourcemap: false,
        },
        logLevel: 'silent', // Don't output logs
        esbuild: {
          logOverride: { 'this-is-undefined-in-esm': 'silent' },
        },
        optimizeDeps: {
          // Disable dependency optimization to avoid pre-bundling issues
          disabled: true,
        },
      });

      console.log('Vite build completed');
      
      // Read the output file
      const outputPath = path.join(outDir, 'component.js');
      if (fs.existsSync(outputPath)) {
        const outputText = fs.readFileSync(outputPath, 'utf-8');
        return {
          success: true,
          outputText,
          errors: []
        };
      } else {
        return {
          success: false,
          outputText: '',
          errors: ['Vite build did not produce an output file']
        };
      }
    } catch (error: any) {
      // Handle Vite build errors
      let errorMessage = 'Error during Vite build: ';
      console.log(error);
      
      if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += String(error);
      }
      
      return {
        success: false,
        outputText: '',
        errors: [errorMessage]
      };
    }
  } catch (error: any) {
    // Handle setup errors
    let errorMessage = 'Error setting up compilation: ';
    
    if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += String(error);
    }
    
    return {
      success: false,
      outputText: '',
      errors: [errorMessage]
    };
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempDir)) {
        try {
          fs.rmSync(tempDir, { recursive: true });
        } catch (e) {
          // Fallback for older Node.js versions
          const rimraf = require('rimraf');
          rimraf.sync(tempDir);
        }
      }
    } catch (error) {
      console.error('Error cleaning up temporary files:', error);
    }
  }
}

/**
 * Attempts to find the TypeScript lib files directory
 */
function findTSLibPath(): string | null {
  try {
    // Check node_modules
    const possiblePaths = [
      path.join(process.cwd(), 'node_modules', 'typescript', 'lib'),
      path.join(process.cwd(), '..', 'node_modules', 'typescript', 'lib')
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p) && fs.existsSync(path.join(p, 'lib.d.ts'))) {
        return p;
      }
    }
    
    return null;
  } catch (e) {
    console.error('Error finding TypeScript lib files:', e);
    return null;
  }
}