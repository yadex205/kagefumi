import tokenizeGlsl from "glsl-tokenizer/string";
import * as yup from "yup";

const Vector4Schema = yup.tuple([
  yup.number().required(),
  yup.number().required(),
  yup.number().required(),
  yup.number().required(),
]);

const IsfMetadataJsonBaseInputSchema = yup.object({
  NAME: yup.string().required().matches(/^\S+$/),
  LABEL: yup.string().optional(),
  TYPE: yup.string().required().oneOf(["bool", "long", "float", "color", "image"]),
});

const IsfMetadataJsonBoolInputSchema = IsfMetadataJsonBaseInputSchema.concat(yup.object({
  DEFAULT: yup.number().optional(),
}));

type IsfMetadataJsonBoolInput = Omit<yup.InferType<typeof IsfMetadataJsonBoolInputSchema>, "TYPE"> & { TYPE: "bool" };

const IsfMetadataJsonLongInputSchema = IsfMetadataJsonBaseInputSchema.concat(yup.object({
  DEFAULT: yup.number().optional(),
  MIN: yup.number().optional(),
  MAX: yup.number().optional(),
}));

type IsfMetadataJsonLongInput = Omit<yup.InferType<typeof IsfMetadataJsonLongInputSchema>, "TYPE"> & { TYPE: "long" };

const IsfMetadataJsonFloatInputSchema = IsfMetadataJsonBaseInputSchema.concat(yup.object({
  DEFAULT: yup.number().optional(),
  MIN: yup.number().optional(),
  MAX: yup.number().optional(),
}));

type IsfMetadataJsonFloatInput = Omit<yup.InferType<typeof IsfMetadataJsonFloatInputSchema>, "TYPE"> & { TYPE: "float" };

const IsfMetadataJsonColorInputSchema = IsfMetadataJsonBaseInputSchema.concat(yup.object({
  DEFAULT: Vector4Schema.optional(),
  MIN: Vector4Schema.optional(),
  MAX: Vector4Schema.optional(),
}));

type IsfMetadataJsonColorInput = Omit<yup.InferType<typeof IsfMetadataJsonColorInputSchema>, "TYPE"> & { TYPE: "color" };

type IsfMetadataJsonImageInput = Omit<yup.InferType<typeof IsfMetadataJsonColorInputSchema>, "TYPE"> & { TYPE: "image" };

const IsfMetadataJsonInputSchema = yup.lazy(value => {
  switch (value?.TYPE) {
    case "bool": return IsfMetadataJsonBoolInputSchema;
    case "long": return IsfMetadataJsonLongInputSchema;
    case "float": return IsfMetadataJsonFloatInputSchema;
    case "color": return IsfMetadataJsonColorInputSchema;
    case "image": return IsfMetadataJsonBaseInputSchema;
    default: return IsfMetadataJsonBaseInputSchema;
  }
})

const IsfMetadataJsonSchema = yup.object({
  ISFVSN: yup.string().optional(),
  VSN: yup.string().optional(),
  DESCRIPTION: yup.string().optional(),
  CREDIT: yup.string().optional(),
  CATEGORIES: yup.array().of(yup.string().required()).optional(),
  INPUTS: yup.array().of(IsfMetadataJsonInputSchema).optional(),
});

type IsfMetadataJson = Omit<yup.InferType<typeof IsfMetadataJsonSchema>, "INPUTS"> & {
  INPUTS?: (
    | IsfMetadataJsonBoolInput
    | IsfMetadataJsonLongInput
    | IsfMetadataJsonFloatInput
    | IsfMetadataJsonColorInput
    | IsfMetadataJsonImageInput
  )[];
}

interface IsfBaseInput {
  name: string;
  label?: string;
  type: string;
}

interface IsfBoolInput extends IsfBaseInput {
  type: "bool";
  default?: number;
}

interface IsfLongInput extends IsfBaseInput {
  type: "long";
  default?: number;
  min?: number;
  max?: number;
}

interface IsfFloatInput extends IsfBaseInput {
  type: "float";
  default?: number;
  min?: number;
  max?: number;
}

interface IsfColorInput extends IsfBaseInput {
  type: "color";
  default?: [number, number, number, number];
  min?: [number, number, number, number];
  max?: [number, number, number, number];
}

interface IsfImageInput extends IsfBaseInput {
  type: "image";
}

type IsfInput =
  | IsfBoolInput
  | IsfLongInput
  | IsfFloatInput
  | IsfColorInput
  | IsfImageInput;

export class IsfMetadata {
  private _isfVersion?: string;
  private _version?: string;
  private _description?: string;
  private _credit?: string;
  private _categories: string[] = [];
  private _inputs: IsfInput[] = [];

  public static parseIsfSource(isfSource: string) {
    for (const token of tokenizeGlsl(isfSource)) {
      if (token.type === "whitespace") {
        continue;
      } else if (token.type === "block-comment") {
        const isfMetadataJson = JSON.parse(token.data.replace(/(^\/\*|\*\/$)/g, ""));
        const isfMetadata = new IsfMetadata();

        isfMetadata.parseIsfMetadataJson(isfMetadataJson);

        return isfMetadata;
      } else {
        return null;
      }
    }

    return null;
  }

  public get isfVersion() {
    return this._isfVersion;
  }

  public get version() {
    return this._version;
  }

  public get description() {
    return this._description;
  }

  public get credit() {
    return this._credit;
  }

  public get categories() {
    return this._categories;
  }

  public get inputs() {
    return this._inputs;
  }

  public parseIsfMetadataJson(_isfMetadataJson: unknown) {
    IsfMetadataJsonSchema.validateSync(_isfMetadataJson);
    const isfMetadataJson = _isfMetadataJson as IsfMetadataJson;

    this._isfVersion = isfMetadataJson.ISFVSN;
    this._version = isfMetadataJson.VSN;
    this._description = isfMetadataJson.DESCRIPTION;
    this._credit = isfMetadataJson.CREDIT;
    this._categories = isfMetadataJson.CATEGORIES || [];

    this._inputs = (isfMetadataJson.INPUTS || []).map(rawInput => {
      switch (rawInput.TYPE) {
        case "bool": return {
          name: rawInput.NAME,
          label: rawInput.LABEL,
          type: rawInput.TYPE,
          default: rawInput.DEFAULT,
        };

        case "long": return {
          name: rawInput.NAME,
          label: rawInput.LABEL,
          type: rawInput.TYPE,
          default: rawInput.DEFAULT,
          min: rawInput.MIN,
          max: rawInput.MAX,
        };

        case "float": return {
          name: rawInput.NAME,
          label: rawInput.LABEL,
          type: rawInput.TYPE,
          default: rawInput.DEFAULT,
          min: rawInput.MIN,
          max: rawInput.MAX,
        };

        case "color": return {
          name: rawInput.NAME,
          label: rawInput.LABEL,
          type: rawInput.TYPE,
          default: rawInput.DEFAULT,
          min: rawInput.MIN,
          max: rawInput.MAX,
        };

        case "image": return {
          name: rawInput.NAME,
          label: rawInput.LABEL,
          type: rawInput.TYPE,
        }
      }
    });
  }
}
