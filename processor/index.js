import createFriendLookup from './mps'
import { writeToFile } from '../utility/file'

const friendLookup = createFriendLookup()
writeToFile(friendLookup, 'data/friend-lookup.json', true)
