"use server";

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const deleteFile = async (fileId: string) => {
  await utapi.deleteFiles(fileId);
  return { success: true, message: "File deleted" };
};
