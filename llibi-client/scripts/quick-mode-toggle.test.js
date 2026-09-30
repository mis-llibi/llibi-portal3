const fs = require('fs')
const assert = require('assert')

const page = fs.readFileSync(
  'src/pages/self-service/admin/index.jsx',
  'utf8',
)

assert(
  page.includes('const [isQuickMode, setIsQuickMode] = useState(false)'),
  'missing controlled Quick Mode state',
)
assert(page.includes('role="switch"'), 'missing switch role')
assert(
  page.includes('aria-checked={isQuickMode}'),
  'missing accessible checked state',
)
assert(
  page.includes('onClick={() => setIsQuickMode(current => !current)}'),
  'missing one-click state transition',
)
assert(page.includes('>Quick Mode</'), 'missing visible label')

console.log('Quick Mode toggle markup is present')
