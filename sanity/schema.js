import {blockContent} from './schemas/blockContent'
import {category} from './schemas/category'
import {post} from './schemas/post'
import {author} from './schemas/author'
import {city} from './schemas/city'

export const schema = {
  types: [post, author, category, blockContent, city],
}
