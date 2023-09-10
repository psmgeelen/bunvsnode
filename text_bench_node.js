const {
  glob,
  globSync,
  globStream,
  globStreamSync,
  Glob,
} = require('glob')
const fs = require('fs');

// data that is being used comes from: https://archive.ics.uci.edu/dataset/137/reuters+21578+text+categorization+collection

function filterbychr(body, match) {
  var regex = match
  return body.match(regex).filter(function (m, i, self) {
    return i == self.indexOf(m)
  }).join('')
}

async function readAndProcess(filepath, match) {
  const text = fs.readFileSync(filepath, 'utf8');
  const matches = filterbychr(text, match)
  return { "file": filepath, "matches": matches }
}

async function processFiles(files, match) {
  let contents = await Promise.all(files.map(async (file) => {
    const contents = await readAndProcess(file, match);
    return contents
  }))
  fs.writeFileSync(`output_node.json`, JSON.stringify(contents));
}

async function runAll() {
  const start = performance.now()
  const files = await glob('datatext/reut**.sgm', { ignore: 'node_modules/**' })
  await processFiles(files, '.*corn.*')
  const end = performance.now()
  console.log("The time it took to run was:", end - start)
}
// actually running the tests
runAll();

