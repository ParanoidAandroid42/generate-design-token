import { Typography } from "./interface/Typography";
import { Token } from "./interface/Token";
import * as StyleDictionary from "style-dictionary";
import * as fsExtra from "fs-extra";
import {
  rmSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  existsSync,
  readFileSync,
} from "fs";
import { FormatterArguments } from "style-dictionary/types/Format";
import { TransformedToken, Dictionary } from "style-dictionary";
import { TokenType } from "./enum/TokenType";
import { BoxShadow } from "./interface/BoxShadow";
import { CategoryType } from "./enum/CategoryType";

const BASE_PRIMITIVE_TOKEN_PATH = "primitives";
const BASE_THEME_TOKEN_PATH = "themes";
const SEMANTIC_TOKEN_GROUP_NAME = "Semantic";

const CSS_PROPERTIES: { [tokenType: string]: string } = {
  [TokenType.Color]: "backgroundColor",
  [TokenType.Space]: "width",
  [TokenType.Size]: "width",
  [TokenType.BorderWidth]: "borderWidth",
  [TokenType.BorderRadius]: "borderRadius",
  [TokenType.Opacity]: "opacity",
  [TokenType.LetterSpace]: "letterSpacing",
  [TokenType.TextCase]: "textTransform",
  [TokenType.FontFamily]: "fontFamily",
  [TokenType.FontSize]: "fontSize",
  [TokenType.LineHeight]: "lineHeight",
  [TokenType.FontWeight]: "fontWeight",
  [TokenType.BoxShadow]: "boxShadow",
};

const CATEGORY_PLURAL_NAMES: { [categoryType: string]: string } = {
  [CategoryType.Color]: "Colors",
  [CategoryType.Space]: "Spaces",
  [CategoryType.Typography]: "Typographies",
  [CategoryType.Size]: "Sizes",
  [CategoryType.Border]: "Borders",
  [CategoryType.BorderRadius]: "BorderRadii",
  [CategoryType.Opacity]: "Opacities",
  [CategoryType.LetterSpacing]: "LetterSpaces",
  [CategoryType.FontFamily]: "FontFamilies",
  [CategoryType.FontSize]: "FontSizes",
  [CategoryType.LineHeight]: "LineHeights",
  [CategoryType.FontWeight]: "FontWeights",
  [CategoryType.Shadow]: "Shadows",
};

/**
 * Generate token style that figma token's output and create output data to use for design system
 *
 * Created by Asli
 * Date: 2022
 * (c) Potato-17 Team, Hamburg, Germany
 */
export class GenerateToken {
  constructor() {
    // Remove and generate json files
    this.removeTokenFiles();
    this.generateTokenJsonFiles();

    // Set formatter config
    this.baseFormatter();
    this.setBaseDesignSystemWithDetailsFormatter();

    // Generate token
    this.generatePrimitiveTokenStyle();
    this.generateThemesTokenStyle();
    this.generateDesignSystemWithDetailsToken();

    // delete unnecessary style for design system and keys
    rmSync("tokens/design-system-with-details/styles", {
      recursive: true,
      force: true,
    });
    // delete unnecessary generated JSONs
    rmSync("tokens/generated", { recursive: true, force: true });
    console.log("\nBuild completed! Ignore possible warnings.");
  }

  /**
   * Remove generated token style folders
   */
  private removeTokenFiles() {
    fsExtra.emptyDirSync("styles/");
    fsExtra.emptyDirSync("tokens/");
  }

  private addFolder(folderName: string) {
    if (!existsSync(folderName)) {
      mkdirSync(folderName);
    }
  }

  /*
   * Generate common token styles
   */
  private generatePrimitiveTokenStyle() {
    this.getPrimitiveFolderNames().map(function (primitiveName) {
      const styleDictionary = StyleDictionary.extend({
        source: [
          `tokens/generated/${BASE_PRIMITIVE_TOKEN_PATH}/${primitiveName}.json`,
        ],
        platforms: {
          css: {
            buildPath: `styles/${BASE_PRIMITIVE_TOKEN_PATH}/`,
            transformGroup: "css",
            files: [
              {
                destination: `${primitiveName}.css`,
                format: "baseFormatter",
                className: primitiveName,
                options: {
                  pathDir: BASE_PRIMITIVE_TOKEN_PATH,
                  pathName: primitiveName,
                  filterPath: BASE_PRIMITIVE_TOKEN_PATH,
                },
              },
            ],
          },
        },
      });
      styleDictionary.buildAllPlatforms();
    });
  }

  /*
   * Generate themes token with details according to theme folder's name for design system
   */
  private generateDesignSystemWithDetailsToken() {
    this.getThemesFolderNames().map(function (themeName) {
      const styleDictionary = StyleDictionary.extend({
        source: [
          `tokens/generated/${BASE_THEME_TOKEN_PATH}/${themeName}.json`,
          "tokens/generated/primitives/*.json",
        ],
        platforms: {
          css: {
            buildPath: `tokens/design-system-with-details/styles/`,
            transformGroup: "css",
            files: [
              {
                destination: `${themeName}.css`,
                format: "baseDesignSystemWithDetailsFormatter",
                className: `.${themeName}`,
                options: {
                  pathName: themeName,
                  filterPath: BASE_THEME_TOKEN_PATH,
                },
              },
            ],
          },
        },
      });
      styleDictionary.buildAllPlatforms();
    });

    this.getPrimitiveFolderNames().map(function (primitiveName) {
      const styleDictionary = StyleDictionary.extend({
        source: [
          `tokens/generated/${BASE_PRIMITIVE_TOKEN_PATH}/${primitiveName}.json`,
        ],
        platforms: {
          css: {
            buildPath: `tokens/design-system-with-details/styles/`,
            transformGroup: "css",
            files: [
              {
                destination: `${primitiveName}.css`,
                format: "baseDesignSystemWithDetailsFormatter",
                className: `.${primitiveName}`,
                options: {
                  pathName: primitiveName,
                  filterPath: BASE_PRIMITIVE_TOKEN_PATH,
                },
              },
            ],
          },
        },
      });
      styleDictionary.buildAllPlatforms();
    });
  }

  /*
   * Generate themes token styles according to theme folder's name
   */
  private generateThemesTokenStyle() {
    this.getThemesFolderNames().map(function (themeName) {
      const styleDictionary = StyleDictionary.extend({
        source: [
          `tokens/generated/${BASE_THEME_TOKEN_PATH}/${themeName}.json`,
          `tokens/generated/${BASE_PRIMITIVE_TOKEN_PATH}/*.json`,
        ],
        platforms: {
          css: {
            buildPath: `styles/${BASE_THEME_TOKEN_PATH}/`,
            transformGroup: "css",
            files: [
              {
                destination: `${themeName}.css`,
                format: "baseFormatter",
                className: themeName,
                options: {
                  pathDir: BASE_THEME_TOKEN_PATH,
                  pathName: themeName,
                  outputReferences: true,
                  filterPath: BASE_THEME_TOKEN_PATH,
                },
              },
            ],
          },
        },
      });
      styleDictionary.buildAllPlatforms();
    });
  }

  /*
   * Set base formatter for token styles
   */
  private baseFormatter() {
    StyleDictionary.registerFormat({
      name: "baseFormatter",
      formatter: (formatterArg: FormatterArguments) => {
        const tokenJson: any = {};
        const className = formatterArg.file.className;
        const filterPath = formatterArg.options.filterPath;
        const generatedStyle = `${className ? `.${className}` : ":root"} {
			${formatterArg.dictionary.allTokens
        .filter((tokenFile) => tokenFile.filePath.indexOf(filterPath) > -1)
        .map((tokenFile) => {
          const value = this.getTokenValue(tokenFile, formatterArg.dictionary);

          const category =
            CATEGORY_PLURAL_NAMES[tokenFile.attributes?.category || ""];

          if (!tokenJson[category]) {
            tokenJson[category] = [];
          }

          tokenJson[category].push(tokenFile.name);
          return `--${tokenFile.name}: ${value};`;
        })
        .join("\n")}
		}`;

        this.createDesignSystemFiles(tokenJson, filterPath, className);

        return generatedStyle;
      },
    });
  }

  private capitalizeFirstLetter(str: string) {
    return str[0].toUpperCase() + str.slice(1);
  }

  /*
   * Set base formatter for design system with detail
   */
  private setBaseDesignSystemWithDetailsFormatter() {
    StyleDictionary.registerFormat({
      name: "baseDesignSystemWithDetailsFormatter",
      formatter: (formatterArg: FormatterArguments) => {
        const filterPath = formatterArg.options.filterPath;
        const pathName = formatterArg.file.options!.pathName;
        const tokenJson: any = {};
        let tokenDatas: Token[] = [];
        formatterArg.dictionary.allTokens
          .filter((tokenFile) => tokenFile.filePath.indexOf(filterPath) > -1)
          .forEach((tokenFile) => {
            const tokenData: Token = {
              name: tokenFile.name,
              cssValue: this.getDesignSystemWithDetailsTokenCssValue(tokenFile),
              value: tokenFile.value,
            };

            const category =
              CATEGORY_PLURAL_NAMES[tokenFile.attributes?.category || ""];

            const type = this.capitalizeFirstLetter(
              tokenFile.filePath.indexOf(BASE_THEME_TOKEN_PATH) > -1
                ? SEMANTIC_TOKEN_GROUP_NAME
                : tokenFile.attributes?.type || ""
            );

            if (!tokenJson[category]) {
              tokenJson[category] = {};
            }

            if (!tokenJson[category][type]) {
              tokenJson[category][type] = {};
              tokenDatas = [];
            }

            tokenDatas.push(tokenData);
            tokenJson[category][type] =
              tokenDatas.length === 1 ? tokenDatas[0] : tokenDatas;
          });

        this.createDesignSystemFilesWithCssValue(
          tokenJson,
          filterPath,
          pathName
        );
        return "";
      },
    });
  }

  /**
   * Get design system with detail token value with css properties
   */
  private getDesignSystemWithDetailsTokenCssValue(
    transformedToken: TransformedToken
  ): {
    [key: string]: string;
  } {
    let value = transformedToken.value;
    const type = transformedToken.type;
    switch (type) {
      case TokenType.Typography:
        return this.convertToTypographyValue(value);
      case TokenType.Size:
        return this.convertToSizeValue(value);
      case TokenType.BoxShadow:
        value = this.convertToBoxShadowValue(transformedToken.value);
        break;
      case TokenType.FontFamily:
        value = `'${value}'`;
    }

    const cssProperty = CSS_PROPERTIES[transformedToken.type];
    return { [cssProperty]: value };
  }

  /**
   * Generate token json files according to output token file from figma tokens
   */
  private generateTokenJsonFiles() {
    const rawData = readFileSync("tokens.json");
    const tokensJson = JSON.parse(rawData as unknown as string);
    this.addFolder("tokens/generated");
    Object.keys(tokensJson).filter((tokenJson) => {
      const tokenPathName = tokenJson.toString();
      const parentPath =
        tokenPathName.indexOf(BASE_THEME_TOKEN_PATH) > -1
          ? `tokens/generated/${BASE_THEME_TOKEN_PATH}`
          : `tokens/generated/${BASE_PRIMITIVE_TOKEN_PATH}`;
      this.addFolder(parentPath);
      writeFileSync(
        `${parentPath}/${tokenJson}.json`,
        JSON.stringify(tokensJson[tokenJson], null, 2)
      );
    });
  }

  /*
   * Get theme folder names
   */
  private getThemesFolderNames(): string[] {
    let files = readdirSync(`tokens/generated/${BASE_THEME_TOKEN_PATH}/`);
    files = files.map((file) => file.replace(".json", ""));
    return files;
  }

  /*
   * Get primitive folder names
   */
  private getPrimitiveFolderNames(): string[] {
    let files = readdirSync(`tokens/generated/${BASE_PRIMITIVE_TOKEN_PATH}/`);
    files = files.map((file) => file.replace(".json", ""));
    return files;
  }

  /**
   * Return global value if it is not using semantic token
   */
  private getTokenValue(
    token: TransformedToken,
    dictionary?: Dictionary
  ): string {
    let value = JSON.stringify(token.value).replace(/"/g, "");

    if (token.type === TokenType.BoxShadow) {
      value = this.convertToBoxShadowValue(token.value);
    }

    if (token.value instanceof Object) {
      value = `"${value}"`;
    }

    if (dictionary?.usesReference(token.original.value)) {
      const refs = dictionary?.getReferences(token.original.value);
      refs.forEach((ref) => {
        value = value.replace(ref.value, function () {
          return `var(--${ref.name})`;
        });
      });
    }

    return value;
  }

  /**
   * Convert box typography value which created by figma plugin
   */
  private convertToTypographyValue(tokenValue: Typography) {
    return {
      fontFamily: `'${tokenValue.fontFamily}'`,
      fontSize: tokenValue.fontSize,
      fontWeight: tokenValue.fontWeight,
      lineHeight: tokenValue.lineHeight,
    };
  }

  /**
   * Convert sizing value which created by figma plugin for design system
   */
  private convertToSizeValue(tokenValue: string) {
    return {
      width: tokenValue,
      height: tokenValue,
    };
  }

  /**
   * Convert box shadow value which created by figma plugin
   */
  private convertToBoxShadowValue(tokenValue: BoxShadow[]) {
    let boxShadowValues: string[] = [];
    boxShadowValues = tokenValue.map((box: BoxShadow) => {
      return `${box.x} ${box.y} ${box.blur} ${box.spread} ${box.color}`;
    });
    return boxShadowValues.join(",");
  }

  /**
   * Create the token files with css values for design system
   */
  private createDesignSystemFilesWithCssValue(
    tokensJson: any,
    filterPath: string,
    className?: string
  ) {
    let tokenPath = "";
    this.addFolder("tokens/design-system-with-details");
    if (filterPath.indexOf(BASE_THEME_TOKEN_PATH) > -1) {
      tokenPath = `tokens/design-system-with-details/${BASE_THEME_TOKEN_PATH}/${className}.json`;
      this.addFolder(
        `tokens/design-system-with-details/${BASE_THEME_TOKEN_PATH}`
      );
    } else if (filterPath.indexOf(BASE_PRIMITIVE_TOKEN_PATH) > -1) {
      tokenPath = `tokens/design-system-with-details/${BASE_PRIMITIVE_TOKEN_PATH}/${className}.json`;
      this.addFolder(
        `tokens/design-system-with-details/${BASE_PRIMITIVE_TOKEN_PATH}`
      );
    }

    writeFileSync(tokenPath, JSON.stringify(tokensJson, null, 2));
  }

  /**
   * Create the token files for design system
   */
  private createDesignSystemFiles(
    tokensJson: unknown,
    filterPath: string,
    className?: string
  ) {
    let tokenPath = "";
    this.addFolder("tokens/design-system-list");
    if (filterPath.indexOf(BASE_THEME_TOKEN_PATH) > -1) {
      tokenPath = `tokens/design-system-list/${BASE_THEME_TOKEN_PATH}/${className}.json`;
      this.addFolder(`tokens/design-system-list/${BASE_THEME_TOKEN_PATH}`);
    } else if (filterPath.indexOf(BASE_PRIMITIVE_TOKEN_PATH) > -1) {
      tokenPath = `tokens/design-system-list/${BASE_PRIMITIVE_TOKEN_PATH}/${className}.json`;
      this.addFolder(`tokens/design-system-list/${BASE_PRIMITIVE_TOKEN_PATH}`);
    }

    writeFileSync(tokenPath, JSON.stringify(tokensJson, null, 2));
  }
}

new GenerateToken();
