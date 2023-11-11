import * as url from "url";
import { writeFileSync } from "fs";
import { resolve } from "path";
import getArray from "get-tz-ids";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const arr = await getArray();
try {
  writeFileSync(
    resolve(dirname, "../src/data/tz-ids.json"),
    JSON.stringify(arr)
  );
} catch (err) {
  console.error(err);
}
