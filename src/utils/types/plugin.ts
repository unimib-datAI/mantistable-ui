import { z } from "zod";

const MAX_UPLOAD_SIZE = 500000;
const ACCEPTED_FILE_TYPES = ["application/zip"];

export const UploadPlugin = z.object({
  file: z
    .instanceof(File, { message: "A csv file is mandatory" })
    .refine((file) => {
      return file!.size != 0;
    }, "File is empty")
    .refine((file) => {
      return file!.size <= MAX_UPLOAD_SIZE;
    }, "File size must be less than 5MB")
    .refine((file) => {
      return ACCEPTED_FILE_TYPES.includes(file!.type);
    }, "File must be a ZIP"),
});

export type UploadPluginForm = z.infer<typeof UploadPlugin>;
