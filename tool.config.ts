import { LOCALES } from "@/constants";
import { Frontmatter } from "@/lib/tools/frontmatter";
import { FC, SVGProps } from "react";
import z from "zod";

export const config = {
  dir: "src/app/**/(default)/tool/",
  schema: Frontmatter.extend({
    icon: z.custom<FC<SVGProps<SVGSVGElement>>>(
      (val) => {
        return (
          typeof val === "function" || (typeof val === "object" && val !== null)
        );
      },
      {
        message: "icon must be a valid React component",
      }
    ),
    icon_size: z.number().optional(),
    icon_color: z.string().optional(),
    isHot: z.boolean().optional(),
    description: z
      .object(
        Object.fromEntries(
          LOCALES.map((locale) => [locale, z.string().optional()])
        ) as z.ZodRawShape
      )
      .optional()
      .or(z.string()),
    isAvailable: z.boolean().or(z.literal("coming")).optional(),
    updatedAt: z.string().optional(),
    isNew: z.boolean().optional().default(true),
  }),
};
