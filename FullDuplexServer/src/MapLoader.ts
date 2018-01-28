import * as file from "fs";
import * as path from "path";

export function LoadMap(name: string) {
    return file.readFileSync(path.join("./maps", name + ".map"), {encoding: "utf-8"});
}