"use strict";

var _require = require('glob'),
    glob = _require.glob,
    globSync = _require.globSync,
    globStream = _require.globStream,
    globStreamSync = _require.globStreamSync,
    Glob = _require.Glob;

var fs = require('fs'); // data that is being used comes from: https://archive.ics.uci.edu/dataset/137/reuters+21578+text+categorization+collection


function filterbychr(body, match) {
  var regex = match;
  return body.match(regex).filter(function (m, i, self) {
    return i == self.indexOf(m);
  }).join('');
}

function readAndProcess(filepath, match) {
  var text, matches;
  return regeneratorRuntime.async(function readAndProcess$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          text = fs.readFileSync(filepath, 'utf8');
          matches = filterbychr(text, match);
          return _context.abrupt("return", {
            "file": filepath,
            "matches": matches
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

function processFiles(files, match) {
  var contents;
  return regeneratorRuntime.async(function processFiles$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Promise.all(files.map(function _callee(file) {
            var contents;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return regeneratorRuntime.awrap(readAndProcess(file, match));

                  case 2:
                    contents = _context2.sent;
                    return _context2.abrupt("return", contents);

                  case 4:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          })));

        case 2:
          contents = _context3.sent;
          fs.writeFileSync("output_node.json", JSON.stringify(contents));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function runAll() {
  var start, files, end;
  return regeneratorRuntime.async(function runAll$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          start = performance.now();
          _context4.next = 3;
          return regeneratorRuntime.awrap(glob('datatext/reut**.sgm', {
            ignore: 'node_modules/**'
          }));

        case 3:
          files = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(processFiles(files, '.*corn.*'));

        case 6:
          end = performance.now();
          console.log("The time it took to run was:", end - start);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
} // actually running the tests


runAll();