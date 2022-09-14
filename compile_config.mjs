import { load } from "js-yaml";
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, extname, } from 'path';

let files = readdirSync('./tasks/');
let combined = {}
files.forEach((fn) => {
    let ext = extname(fn)
    let base = fn.slice(0, -ext.length)
    if (ext == ".yaml" || ext == ".yml") {
        combined[base] = load(readFileSync(`./tasks/${fn}`))
    }
})
console.log("Compiled configs")
writeFileSync('./src/tasks.json', JSON.stringify(combined))
console.log("Written configs")
