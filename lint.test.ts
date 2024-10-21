import { RuleTester } from "@typescript-eslint/rule-tester";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import type { RuleModule } from "@typescript-eslint/utils/ts-eslint";

const ruleTester = new RuleTester();
Object.assign(ruleTester, { describe, it });
const rule = {
	create(context) {
		return {
			TSTypeAliasDeclaration(node) {
				if (node.typeAnnotation.type !== AST_NODE_TYPES.TSNumberKeyword) {
					context.report({
						node,
						messageId: "typeIsNotLiterallyNumber",
					});
				}
			},
		};
	},
	meta: {
		type: "problem",
		docs: {
			description: "some description",
		},
		messages: {
			typeIsNotLiterallyNumber: `Type is not a literally "number"`,
		},
		schema: [],
	},
	defaultOptions: [],
} as const satisfies RuleModule<string, []>;

ruleTester.run("only-ever-use-literal-number-type", rule, {
	valid: [
		{
			name: "type is number",
			code: `
        type MyType = number;
	    `,
		},
	],
	invalid: [
		{
			name: "type is string",
			code: `
        type MyType = string;
      `,
			errors: [{ messageId: "typeIsNotLiterallyNumber" }],
		},
	],
});
