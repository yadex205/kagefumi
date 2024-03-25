import { describe, expect, it } from "vitest";
import { IsfMetadata } from "../../../src/lib/kagefumi/isf-metadata";

describe("IsfMetadata", () => {
  describe(".parseIsfMetadataJson", () => {
    describe("when DESCRIPTION is given", () => {
      it("updates .description", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ DESCRIPTION: "sample description" });

        expect(isfMetadata.description).to.equal("sample description");
      });
    });

    describe("when CREDIT is given", () => {
      it("updates .credit", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ CREDIT: "Kanon Kakuno" });

        expect(isfMetadata.credit).to.equal("Kanon Kakuno");
      });
    });

    describe("when ISFVSN is given", () => {
      it("updates .isfVersion", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ ISFVSN: "2.0" });

        expect(isfMetadata.isfVersion).to.equal("2.0");
      });
    });

    describe("when VSN is given", () => {
      it("updates .version", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ VSN: "1.0" });

        expect(isfMetadata.version).to.equal("1.0");
      });
    });

    describe("when CATEGORIES is given", () => {
      it("updates .categories", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ CATEGORIES: ["GENERATOR", "Retro"] });

        expect(isfMetadata.categories).toMatchObject(["GENERATOR", "Retro"]);
      });
    });

    describe("when bool input is given", () => {
      it("updates .inputs", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ INPUTS: [{ TYPE: "bool", NAME: "value1" }] });

        expect(isfMetadata.inputs[0]).toMatchObject({ type: "bool", name: "value1" });
      });
    });

    describe("when bool input with label is given", () => {
      it("updates .inputs", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ INPUTS: [{ TYPE: "bool", NAME: "value1", LABEL: "Value 01" }] });

        expect(isfMetadata.inputs[0]).toMatchObject({ type: "bool", name: "value1", label: "Value 01" });
      });
    });

    describe("when bool input with default is given", () => {
      it("updates .inputs", () => {
        const isfMetadata = new IsfMetadata();
        isfMetadata.parseIsfMetadataJson({ INPUTS: [{ TYPE: "bool", NAME: "value1", DEFAULT: 1.0 }] });

        expect(isfMetadata.inputs[0]).toMatchObject({ type: "bool", name: "value1", default: 1.0 });
      });
    });

    describe("when input's name contains whitespaces", () => {
      it("throws validation error", () => {
        const isfMetadata = new IsfMetadata();

        expect(() => isfMetadata.parseIsfMetadataJson({ INPUTS: [{ TYPE: "bool", NAME: "value 1" }] })).toThrowError();
      });
    });

    describe("when input doesn't have name", () => {
      it("throws validation error", () => {
        const isfMetadata = new IsfMetadata();

        expect(() => isfMetadata.parseIsfMetadataJson({ INPUTS: [{ TYPE: "bool" }] })).toThrowError();
      });
    });

    describe("when input doesn't have type", () => {
      it("throws validation error", () => {
        const isfMetadata = new IsfMetadata();

        expect(() => isfMetadata.parseIsfMetadataJson({ INPUTS: [{ NAME: "value1" }] })).toThrowError();
      });
    });
  });
});
