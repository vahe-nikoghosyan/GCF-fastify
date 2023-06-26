import { Firestore } from "@google-cloud/firestore";

const keyFilePath = "/Users/vahenikoghosyan/.gcloud/keyfile.json";

const firestore = new Firestore({
  projectId: process.env["PROJECT_ID"] || "dulcet-day-241310",
  timestampsInSnapshots: true,
  // NOTE: Don't hardcode your project credentials here.
  // If you have to, export the following to your shell:
  //   GOOGLE_APPLICATION_CREDENTIALS=<path>
  keyFilename: keyFilePath,
});

export default firestore;

// const fastifyFirestore: FastifyPluginCallback<FirestoreOptions> = (
//   fastify,
//   options,
//   done
// ) => {
//   const { keyFilename } = options;
//
//   const settings = {
//     projectId: process.env["PROJECT_ID"] || "dulcet-day-241310",
//     timestampsInSnapshots: true,
//   };
//
//   if (keyFilename) {
//     settings["keyFilename"] = keyFilename;
//   }
//
//   const firestore = new Firestore(settings);
//
//   fastify.decorate("db", firestore);
//   done();
// };
//
// export default fp(fastifyFirestore);
