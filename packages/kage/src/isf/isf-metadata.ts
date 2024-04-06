import tokenizeGlsl from "glsl-tokenizer/string";
import * as yup from "yup";

const Vector2Schema = yup.tuple([yup.number().required(), yup.number().required()]);

const Vector4Schema = yup.tuple([
  yup.number().required(),
  yup.number().required(),
  yup.number().required(),
  yup.number().required(),
]);

const IsfMetadataJsonBaseInputSchema = yup.object({
  NAME: yup.string().required().matches(/^\S+$/),
  LABEL: yup.string().optional(),
  TYPE: yup.string().required().oneOf(["event", "bool", "long", "float", "point2D", "color", "image"]),
});

type IsfMetadataJsonEventInput = Omit<yup.InferType<typeof IsfMetadataJsonBaseInputSchema>, "TYPE"> & { TYPE: "event" };

const IsfMetadataJsonBoolInputSchema = IsfMetadataJsonBaseInputSchema.concat(
  yup.object({
    DEFAULT: yup.number().optional(),
  }),
);

type IsfMetadataJsonBoolInput = Omit<yup.InferType<typeof IsfMetadataJsonBoolInputSchema>, "TYPE"> & { TYPE: "bool" };

const IsfMetadataJsonLongInputSchema = IsfMetadataJsonBaseInputSchema.concat(
  yup.object({
    DEFAULT: yup.number().optional(),
    VALUES: yup.array().of(yup.number().required()).optional(),
    LABELS: yup.array().of(yup.string().required()).optional(),
  }),
);

type IsfMetadataJsonLongInput = Omit<yup.InferType<typeof IsfMetadataJsonLongInputSchema>, "TYPE"> & { TYPE: "long" };

const IsfMetadataJsonFloatInputSchema = IsfMetadataJsonBaseInputSchema.concat(
  yup.object({
    DEFAULT: yup.number().optional(),
    MIN: yup.number().optional(),
    MAX: yup.number().optional(),
  }),
);

type IsfMetadataJsonFloatInput = Omit<yup.InferType<typeof IsfMetadataJsonFloatInputSchema>, "TYPE"> & {
  TYPE: "float";
};

const IsfMetadataJsonPoint2dInputSchema = IsfMetadataJsonBaseInputSchema.concat(
  yup.object({
    DEFAULT: Vector2Schema.optional(),
    MIN: Vector2Schema.optional(),
    MAX: Vector2Schema.optional(),
  }),
);

type IsfMetadataJsonPoint2dInput = Omit<yup.InferType<typeof IsfMetadataJsonPoint2dInputSchema>, "TYPE"> & {
  TYPE: "point2D";
};

const IsfMetadataJsonColorInputSchema = IsfMetadataJsonBaseInputSchema.concat(
  yup.object({
    DEFAULT: Vector4Schema.optional(),
  }),
);

type IsfMetadataJsonColorInput = Omit<yup.InferType<typeof IsfMetadataJsonColorInputSchema>, "TYPE"> & {
  TYPE: "color";
};

type IsfMetadataJsonImageInput = Omit<yup.InferType<typeof IsfMetadataJsonBaseInputSchema>, "TYPE"> & { TYPE: "image" };

const IsfMetadataJsonInputSchema = yup.lazy((value) => {
  switch (value?.TYPE) {
    case "event":
      return IsfMetadataJsonBaseInputSchema;
    case "bool":
      return IsfMetadataJsonBoolInputSchema;
    case "long":
      return IsfMetadataJsonLongInputSchema;
    case "float":
      return IsfMetadataJsonFloatInputSchema;
    case "point2D":
      return IsfMetadataJsonPoint2dInputSchema;
    case "color":
      return IsfMetadataJsonColorInputSchema;
    case "image":
      return IsfMetadataJsonBaseInputSchema;
    default:
      return IsfMetadataJsonBaseInputSchema;
  }
});

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
    | IsfMetadataJsonEventInput
    | IsfMetadataJsonBoolInput
    | IsfMetadataJsonLongInput
    | IsfMetadataJsonFloatInput
    | IsfMetadataJsonPoint2dInput
    | IsfMetadataJsonColorInput
    | IsfMetadataJsonImageInput
  )[];
};

interface IsfBaseInput {
  name: string;
  label?: string;
  type: string;
}

interface IsfEventInput extends IsfBaseInput {
  type: "event";
}

interface IsfBoolInput extends IsfBaseInput {
  type: "bool";
  default?: number;
}

interface IsfLongInput extends IsfBaseInput {
  type: "long";
  default?: number;
  values?: number[];
  labels?: string[];
}

interface IsfFloatInput extends IsfBaseInput {
  type: "float";
  default?: number;
  min?: number;
  max?: number;
}

interface IsfPoint2dInput extends IsfBaseInput {
  type: "point2D";
  default?: [number, number];
  min?: [number, number];
  max?: [number, number];
}

interface IsfColorInput extends IsfBaseInput {
  type: "color";
  default?: [number, number, number, number];
}

interface IsfImageInput extends IsfBaseInput {
  type: "image";
}

export type IsfInput =
  | IsfEventInput
  | IsfBoolInput
  | IsfLongInput
  | IsfFloatInput
  | IsfPoint2dInput
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
    const isfMetadata = new IsfMetadata();

    for (const token of tokenizeGlsl(isfSource)) {
      if (token.type === "block-comment") {
        const isfMetadataJson = JSON.parse(token.data.replace(/(^\/\*|\*\/$)/g, ""));
        isfMetadata.parseIsfMetadataJson(isfMetadataJson);
        break;
      } else if (token.type !== "whitespace") {
        break;
      }
    }

    return isfMetadata;
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

    this._inputs = (isfMetadataJson.INPUTS || []).map((rawInput) => {
      switch (rawInput.TYPE) {
        case "event":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
          };

        case "bool":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
            default: rawInput.DEFAULT,
          };

        case "long":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
            default: rawInput.DEFAULT,
            values: rawInput.VALUES,
            labels: rawInput.LABELS,
          };

        case "float":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
            default: rawInput.DEFAULT,
            min: rawInput.MIN,
            max: rawInput.MAX,
          };

        case "point2D":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
            default: rawInput.DEFAULT,
            min: rawInput.MIN,
            max: rawInput.MAX,
          };

        case "color":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
            default: rawInput.DEFAULT,
          };

        case "image":
          return {
            name: rawInput.NAME,
            label: rawInput.LABEL,
            type: rawInput.TYPE,
          };
      }
    });
  }
}
