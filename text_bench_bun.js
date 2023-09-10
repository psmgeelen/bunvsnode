import { read } from 'fs';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

// data that is being used comes from: https://archive.ics.uci.edu/dataset/137/reuters+21578+text+categorization+collection
const files = await glob('datatext/reut**.sgm', { ignore: 'node_modules/**' })

function filterbychr(body, match) {
  var regex = match
  return body.match(regex).filter(function (m, i, self) {
    return i == self.indexOf(m)
  }).join('')
}

async function readAndProcess(filepath, match) {
  const file = Bun.file(filepath);
  const text = await file.text();
  const matches = filterbychr(text, match)
  return { "file": filepath, "matches": matches }
}

async function processFiles(files, match) {
  let contents = await Promise.all(files.map(async (file) => {
    const contents = await readAndProcess(file, match);
    return contents
  }))
  await Bun.write(`output_bun.json`, JSON.stringify(contents));
}

// actually running the tests
const start = performance.now()
await processFiles(files, '.*corn.*')
const end = performance.now()
console.log("The time it took to run was:", end - start)
