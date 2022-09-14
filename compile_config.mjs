import { load } from "js-yaml";
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, } from 'path';

let files = readdirSync('./actions/');
let combined = {}
files.forEach((fn) => {
    let ext = extname(fn)
    let base = fn.slice(0, -ext.length)
    if (ext == ".yaml" || ext == ".yml") {
        combined[base] = load(readFileSync(`./actions/${fn}`))
    }
})
console.log("Compiled configs")
writeFileSync('./src/actions.json', JSON.stringify(combined))
console.log("Written configs")
