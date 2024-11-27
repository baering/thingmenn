const fs = require('fs')

const releaseId = new Date().getTime()

fs.writeFileSync('.env', `REACT_APP_RELEASE_ID=${releaseId}\n`)
