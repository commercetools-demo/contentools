export const getIndexTs = (code: string) => `<script type="sample/ts" filename="index.ts">
          ${code}
        </script>`;

export const getIndexHtml = (
  componentName: string
) => `<script type="sample/html" filename="index.html">
          <!doctype html>
          <body>
            <${componentName}></${componentName}>
            <script type="module" src="./index.js">&lt;/script>
          </body>
        </script>`;

export const getProjectJson = () => `<script type="sample/json" filename="project.json" hidden>
         {
            "dependencies": {
              "lit": "^2.0.2"
            }
          }
            </script>`;

export const getTsconfigJson = () => `<script type="sample/json" filename="tsconfig.json" hidden>
        {
            "compilerOptions": {
              "target": "es2017",
              "module": "esNext",
              "lib": [
                "ES2017",
                "DOM"
              ],
              "declaration": true,
              "declarationMap": true,
              "sourceMap": true,
              "outDir": "./out",
              "rootDir": ".",
              "strict": true,
              "noUnusedLocals": true,
              "noUnusedParameters": true,
              "noImplicitReturns": true,
              "noFallthroughCasesInSwitch": true,
              "noImplicitAny": true,
              "noImplicitThis": true,
              "moduleResolution": "node",
              "forceConsistentCasingInFileNames": true,
              "experimentalDecorators": true
            },
            "include": [
              "*.ts",
            ],
            "exclude": [],
          }
        </script>`;
