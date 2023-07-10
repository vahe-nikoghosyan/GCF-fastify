import { config } from "dotenv";

import { initialize as serverInitialize } from "./server";

config();
serverInitialize();
