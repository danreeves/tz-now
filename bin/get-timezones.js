const { writeFileSync } = require("fs");
const { resolve } = require("path");
const getArray = require("get-tz-ids");

async function getTzIds() {
  const arr = await getArray();
  try {
    writeFileSync(
      resolve(__dirname, "../src/data/tz-ids.json"),
      JSON.stringify(arr)
    );
  } catch (err) {
    console.error(err);
  }
}

getTzIds();
