import path from 'path'

export default function foo () {
  return path.join(process.cwd(), 'foo')
}
