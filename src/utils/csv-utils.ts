import { Options, parse } from "csv-parse";

export const parseCsvFromBuffer = async (buffer: Buffer, options?: Options) =>
  new Promise((resolve, reject) =>
    parse(buffer, options, (mainError, records) => {
      if (mainError) {
        reject(mainError);
        return;
      }
      resolve(records);
    }),
  );
