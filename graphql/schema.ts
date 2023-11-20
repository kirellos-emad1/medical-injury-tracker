import { builder } from "./builder";

import "./types/InjuryList.ts";
import "./types/User.ts";
import "./types/Injury.ts";

export const schema = builder.toSchema();