import {
  ModelInit,
  MutableModel,
  PersistentModelConstructor,
} from '@aws-amplify/datastore'

type RemoteConfigMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt'
}

export declare class RemoteConfig {
  readonly id: string
  readonly app_config: string
  readonly createdAt?: string | null
  readonly updatedAt?: string | null
  constructor(init: ModelInit<RemoteConfig, RemoteConfigMetaData>)
  static copyOf(
    source: RemoteConfig,
    mutator: (
      draft: MutableModel<RemoteConfig, RemoteConfigMetaData>
    ) => MutableModel<RemoteConfig, RemoteConfigMetaData> | void
  ): RemoteConfig
}
