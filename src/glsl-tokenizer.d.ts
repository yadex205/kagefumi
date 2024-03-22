declare module "glsl-tokenizer/string" {
  interface TokenizeOption {
    version?: string;
  }

  interface GlslToken {
    type: "block-comment" | "line-comment" | "preprocessor" | "operator" | "integer" | "float" | "ident" | "buildin" | "keyword" | "whitespace" | "eof";
    data: string;
    position: number;
    line: number;
    column: number;
  }

  export default function tokenizeString(string: string, option?: TokenizeOption): Array<GlslToken>;
}
