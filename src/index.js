import Server from "./server/app.js";

import { poblarDB } from "./utils/DB.utils.js";
poblarDB();

const servidor = new Server("3001");
servidor.listen();