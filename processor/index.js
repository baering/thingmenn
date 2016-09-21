import createFriendLookup from './votes'
import createMpNounLookup from './speeches'
import { writeToFile } from '../utility/file'

// const friendLookup = createFriendLookup()
// writeToFile(friendLookup, 'data/friend-lookup.json', true)
createMpNounLookup()
