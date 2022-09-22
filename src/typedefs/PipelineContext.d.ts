import * as Logger from 'bunyan'
import { ApiteSW6User } from './User'
import { ApiteSW6Cart } from './Cart'
import { ApiteSW6Favorites } from './Favorites'

declare namespace ApiteSW6Helper {
    interface PipelineContext {
        config: ApiteSW6Cart.PipelineConfiguration | ApiteSW6User.PipelineConfiguration | ApiteSW6Favorites.PipelineConfiguration
        log: Logger
        meta: PipelineContextMeta
        storage: PipelineStorageContainer
    }

    interface PipelineStorageGetCallback {
        (err: Error | null, value: any): void
    }

    interface PipelineStorageDelCallback {
        (err: Error | null, value: string | number | Object): void
    }

    interface PipelineStorageSetCallback {
        (err: Error | null, value: string | number | Object): void
    }

    interface PipelineStorage {
        get(key: string, callback: PipelineStorageGetCallback): void

        get(key: string): Promise<any>

        set(key: string, value: string | number | Object, callback: PipelineStorageSetCallback): void

        set(key: string, value: string | number | Object): Promise<void>

        del(key: string, callback: PipelineStorageDelCallback): void | Promise<void>

        del(key: string): Promise<void>
    }

    interface PipelineStorageContainer {
        user: PipelineStorage
        device: PipelineStorage
        extension: PipelineStorage
    }

    interface PipelineContextMeta {
        userId?: string
        appId: string,
        deviceId: string,
        headers: Array<string> | undefined,
        cookies: Array<string> | undefined,
    }
}
