## Potato17 Design Token
* [General Info](#general-info)
* [Terminology](#terminology)
* [Design Token Rule](#design-token-rule)
* [Design Token Types](#design-token-types)
* [Design Token Schema](#design-token-schema)
* [Technologies](#technologies)
* [Setup](#setup)

## General Info
This project is a token-style generator and works in synch with Figma token plugin output. 
In general, it allows to quickly generate tokens style of Figma token's output using by github action.

## Terminology
**Design Token** <br /> <br />
Design tokens are all the values needed to construct and maintain a design system — spacing, color, typography, object styles, animation, etc. — represented as data. These can represent anything defined by design <br /> <br />
**Semantic Token** <br /> <br />
Token aliases let you relate a semantic token to a base token for a specific context or to get a level of abstraction. It helps you communicate the intended purpose of a token independent of the actual/primitive value of the token. For more info : [link](https://www.toolabs.com/learn/tokens/semantics/#:~:text=Token%20aliases%20let%20you%20relate,primitive%20value%20of%20the%20token.)

## Design Token Rule 
Creating for token's JSON, follow CTI structure rule. The current token rule: <br />  <br />
![image](https://user-images.githubusercontent.com/78482240/151450641-c8ed512a-e4d2-4473-9411-e2a044a05af8.png)

## Design Token Types
The following types of design tokens are the building blocks and design decisions that make up the potato17 design system <br />

**Primitive tokens:**
* Primitives.json will change only game by game
* These tokens don’t use reference value(semantic value)
* Example token of primitive.json: <br />
![image](https://user-images.githubusercontent.com/78482240/157431811-90fbbc43-c520-4a60-b106-15b4585a6ebd.png)
* Example generated token as css var from primitive.json: <br />
   ![image](https://user-images.githubusercontent.com/78482240/157427860-e2997014-3b24-4304-9e47-f0690cdffc4c.png)
<br/>

**Themes tokens:**
* These tokens can get reference from only primitives tokens
* They are creatable multiple times (in each theme-x.json)
* Example token of themes-{name}.json: <br />
![image](https://user-images.githubusercontent.com/78482240/157432161-52abdadf-77dc-4865-8d55-7c297b80022e.png)
* Example generated token as css var from themes-{name} json: <br />
  ![image](https://user-images.githubusercontent.com/78482240/157428612-b3a4863d-cb7b-4dff-bedc-8c20f149059b.png)
<br/>

**Component tokens:**
* Components should be(ideally) only  base things, please don’t extend if not necessary
* Component.json will change only game by game
* These tokens can get reference from themes or primitives tokens
* Button-primary-background-color only can not linkable by primary-background-color. You can use other colors as well. For example,  ‘primary’ of decisions(themes) is related to color options that are used in the game. So button-primary-background-color can also settable second(option-1,option-2)-background-color if you want. . Please don’t mixed up that difference because of the names
* Example token of component.json: <br />
![image](https://user-images.githubusercontent.com/78482240/157432921-1d28e024-cb7b-4f09-9b80-da0a02ce1a0a.png)
* Example generated token as css var from component.json : <br />
  ![image](https://user-images.githubusercontent.com/78482240/157433043-833d6c41-fc7d-4dff-9aa4-66c40edbe98b.png)
<br/>


:warning: Components + Themes called as a decisions. 

 ## Design Token Schema

Use the that basic flowchart when determining the type of token

![image](https://user-images.githubusercontent.com/78482240/157283817-17d2a8ad-4997-43ec-bb7d-1e9df53071b3.png)

	
## Technologies
Project is created with:
* [Style Dictionary](https://amzn.github.io/style-dictionary/#/) using to generate token according to cti structure
* [Figma Tokens](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens) using to extract token on figma
* [Figma](https://www.figma.com/) using to keep our tokens in documents and use plugins to extract/create assets/tokens. 
	
## Setup
To test without github action:
```
$ npm run generate-tokens
```
![image](https://user-images.githubusercontent.com/78482240/157434342-9b25085e-dacb-4207-a6e7-d30d0fef980d.png)
<br />
And see outputs in styles/ and src/tokens/

## Sources
Terminology: https://spectrum.adobe.com/page/design-tokens/
<br />
The design system is inspired by Michael Mangialardi's article (https://www.michaelmang.dev/blog/introduction-to-design-tokens)
<br />
Cristiano Rastelli's article https://didoo.medium.com/how-to-manage-your-design-tokens-with-style-dictionary-98c795b938aa
<br />
And see more detail for CTI structure: https://amzn.github.io/style-dictionary/#/tokens
