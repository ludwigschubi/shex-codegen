import { normalizeUrl } from "../common";
import {
  generateNameContextName,
  generateShexName,
} from "../typescript/generates";

export function generateShapeMethodsExport(
  {
    id,
    childShapes,
    typed,
  }: {
    id: string;
    childShapes: string[] | undefined;
    typed: boolean | undefined;
  },
  fileName: string
) {
  const shapeName = normalizeUrl(id, true);
  const shape = `
export const ${normalizeUrl(id).replace(
    "Shape",
    ""
  )} = new Shape<${shapeName}, ${shapeName + "CreateArgs"}>({
  id: "${id}",
  shape: ${generateShexName(fileName)},
  context: ${generateNameContextName(id)},
  ${typed ? `type: ${shapeName + "Type"},` : ""}${Array.isArray(childShapes) && childShapes.length > 0
      ? `childContexts: [${childShapes
        .map((shape) => generateNameContextName(shape))
        .join(", ")}],`
      : ""
    }
})\n`;

  return shape;
}

export function generateShapeMethodsImport(customMethodsImport?: string) {
  return `import { Shape } from "${customMethodsImport ?? "shex-methods"}";\n`;
}
