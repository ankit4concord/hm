// @ts-check
import { initSchema } from '@aws-amplify/datastore'
import { schema } from './schema'

const { RemoteConfig } = initSchema(schema)

export { RemoteConfig }
