import createFriendLookup from './votes'
import { writeToFile } from '../utility/file'

const friendLookup = createFriendLookup()
writeToFile(friendLookup, 'data/friend-lookup.json', true)
