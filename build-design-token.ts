// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require('glob-concat');
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { minify } from 'csso';
const outputDir = './bundles';

const generatedTokenPath = './styles/';
const filesList = glob.sync([
  `${generatedTokenPath}/primitives/{/*.css,/**/*.css}`,
  `${generatedTokenPath}/themes/{/*.css,/**/*.css}`,
  `${generatedTokenPath}/components-token.css`,
]);

const css = filesList.reduce((acc: string, val: string) => acc + readFileSync(val, 'utf8'), '');
const minifiedCss = minify(css).css;

const themeFolderPath = `${generatedTokenPath}/themes`;
const fileNames = readdirSync(themeFolderPath).map((file) => file.split('.')[0]);
const themeNames = `"${fileNames.join(`","`)}"\n`;

const primitiveFolderPath = `${generatedTokenPath}/primitives`;
const primitiveFileNames = readdirSync(primitiveFolderPath).map((file) => file.split('.')[0]);
const primitiveNames = `"${primitiveFileNames.join(`","`)}"\n`;

const themeNamesJson = `{ "THEME_NAMES": [ ${themeNames} ]}`;
const primitiveNamesJson = `{ "PRIMITIVE_NAMES": [ ${primitiveNames} ]}`;

if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}
writeFileSync('./bundles/generated-token.css', minifiedCss);
writeFileSync('./bundles/theme-name-list.json', themeNamesJson);
writeFileSync('./bundles/primitive-name-list.json', primitiveNamesJson);
