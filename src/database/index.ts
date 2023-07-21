import { Firestore } from "@google-cloud/firestore";

const keyFilePath = "keyfile.json";

const firestore = new Firestore({
  projectId: process.env["PROJECT_ID"] || "dulcet-day-241310",
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  keyFilename: keyFilePath,
});

export default firestore;
