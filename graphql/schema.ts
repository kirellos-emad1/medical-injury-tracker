import { builder } from "./builder";
import "./prismaTypes/InjuryList";
import "./prismaTypes/User";
import "./prismaTypes/Injury";
export const schema = builder.toSchema();
