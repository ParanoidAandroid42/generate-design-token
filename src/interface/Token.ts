export interface Token {
	name: string;
	cssValue: string | { [key:string]: string };
	value: string;
}