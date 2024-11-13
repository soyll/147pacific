import { loadEnvConfig } from "@next/env";
import type { CodegenConfig } from "@graphql-codegen/cli";

loadEnvConfig(process.cwd());

let schemaUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL || "./schema.graphql"; // Use schema.graphql if URL is undefined

if (process.env.GITHUB_ACTION === "generate-schema-from-file") {
	schemaUrl = "schema.graphql";
}

if (!schemaUrl && process.env.NODE_ENV !== "production") {
	console.error("Set NEXT_PUBLIC_SALEOR_API_URL or use a local schema file.");
	process.exit(1);
}

const config: CodegenConfig = {
	overwrite: true,
	schema: schemaUrl,
	documents: "src/graphql/**/*.graphql",
	generates: {
		"src/gql/": {
			preset: "client",
			plugins: [],
			config: {
				documentMode: "string",
				useTypeImports: true,
				strictScalars: true,
				scalars: {
					Date: "string",
					DateTime: "string",
					Day: "number",
					Decimal: "number",
					GenericScalar: "unknown",
					JSON: "unknown",
					JSONString: "string",
					Metadata: "Record<string, string>",
					Minute: "number",
					PositiveDecimal: "number",
					UUID: "string",
					Upload: "unknown",
					WeightScalar: "unknown",
					_Any: "unknown",
				},
			},
			presetConfig: {
				fragmentMasking: false,
			},
		},
	},
};

export default config;