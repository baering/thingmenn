import createFriendLookup from './votes'
import createMpNounLookup from './speeches'
import createMpPositionLookup from './position'
import { writeToFile } from '../utility/file'

// const friendLookup = createFriendLookup()
// writeToFile(friendLookup, 'data/friend-lookup.json', true)
// createMpNounLookup()
createMpPositionLookup()
