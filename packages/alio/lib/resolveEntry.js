const path = require('path')
const match = require('matched')
const cwd = process.cwd()

function matchFiles (file) {
  if (/\*+/g.test(file)) {
    return match.sync(path.join(cwd, file))
  } else {
    return [ path.join(cwd, file) ]
  }
}

module.exports = function resolveEntry (entry) {
  let result = {}

  if (typeof entry === 'object' && !Array.isArray(entry)) {
    for (let file in entry) {
      result[file] = path.join(cwd, entry[file])
    }
  } else {
    const entries = [].concat(entry)
    let files = []

    for (let i = 0; i < entries.length; i++) {
      const matches = matchFiles(entries[i])

      for (let o = 0; o < matches.length; o++) {
        files.push(matches[o])
      }
    }

    for (let file of files) {
      result[path.basename(file, '.js')] = file
    }
  }

  return result
}
