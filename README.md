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


## Design Token Types
The following types of design tokens are the building blocks and design decisions that make up the potato17 design system <br />

**Primitive tokens:**
* Primitives.json will change only game by game
* These tokens don’t use reference value(semantic value). That means they use basic values and not point  another design token.
* Example token of primitive.json: <br />
![image](https://user-images.githubusercontent.com/13114945/230381934-0be6d2f3-78e9-4c0e-bf10-2ec20652e448.png)
* Example generated token as css var from primitive.json: <br />
![image](https://user-images.githubusercontent.com/13114945/230381966-82a08fec-8b33-42e5-a0c4-54eff39cfbc2.png)

**Decision tokens: (Themes token)**

* These tokens need to reference from primitives tokens.
* They can use basic tokens, they need to point another design token.
* They are creatable multiple times (in each theme-x.json)
* Example token of themes-{name}.json:
![image](https://user-images.githubusercontent.com/13114945/230382023-aaa65a9c-332b-433d-b679-2b032f16c19a.png)
* Example generated token as css var from themes-{name} json:
![image](https://user-images.githubusercontent.com/13114945/230382086-001257fb-4f86-465f-89f9-15e4b63538fa.png)

## Design Token Rule 
Creating for token's JSON, follow CTI structure rule. The current token rule: <br />  <br />
![image](https://user-images.githubusercontent.com/78482240/151450641-c8ed512a-e4d2-4473-9411-e2a044a05af8.png)

![image](https://user-images.githubusercontent.com/13114945/230377388-7d3e1f85-bbda-4f65-99c8-e8d51def5553.png)
![image](https://user-images.githubusercontent.com/13114945/230377477-bdf4ec7f-71d6-4fe4-9341-a741c78ba57d.png)

**SENTIMENT:**

Sentiment naming related to variations and variants can be extendable.

**Example sentiments:**

* Success (Green tones)
* Warning (Yellow tones)
* Danger (Red tones)
* Primary
* Secondary
* Tertiary
* Neutral
* Premium

**USAGE:**
Usage naming related to where you wanna use that token. 

**Example uesages:**

* Brand/Background
* Text
* Icon
* Border
* Surface

**PROMINENCE:**
Prominence naming related to emphasis and prominence can be extendable.

**Example prominences: (extendable in time):**

* Strong/Dark
* Week/Light
* Default

**INTERACTION:**

Interaction naming related to what actions can be taken by that user. 

**Example interactions:**

* Default
* Hovered
* Disabled
* Focused
* Pressed

**STATE:**
State naming related to what situations it might be and states can be extendable.

### Example states: (extendable in time):
* Select
* Default

**Example for design token rule:**
![image](https://user-images.githubusercontent.com/13114945/230377568-3f590b09-a5e4-4eb8-be78-05d2026d668a.png)


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
