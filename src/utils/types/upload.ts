import { z } from "zod";

const MAX_UPLOAD_SIZE = 500000;
const ACCEPTED_FILE_TYPES = ["text/csv"];

export const UploadSchema = z.object({
  tableName: z.string().min(1, { message: "Mandatory Field" }),
  tableDescription: z.string().min(1, { message: "Mandatory Field" }),
  file: z
    .instanceof(File, { message: "A csv file is mandatory" })
    .refine((file) => {
      return file!.size != 0;
    }, "File is empty")
    .refine((file) => {
      return file!.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 3MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file!.type);
    }, "File must be a CSV"),
});

export type UploadSchemaForm = z.infer<typeof UploadSchema>;
