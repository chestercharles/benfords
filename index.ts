import fs from "fs";
import { Benfords } from "./benfordHistogram";

const read = fs.createReadStream("./war-of-the-worlds.txt", "utf-8");

Benfords(read);
