import type { MessagePort } from 'worker_threads'
import type { TransformResult } from 'vite'
import type { ResolvedConfig } from './options'
import type { File, TaskResultPack } from './tasks'
import type { SnapshotResult } from './snapshot'

export interface WorkerContext {
  port: MessagePort
  config: ResolvedConfig
  files: string[]
  invalidates?: string[]
}

export interface RpcMap {
  workerReady: [[], void]
  fetch: [[id: string], TransformResult | null | undefined]
  onCollected: [[files: File[]], void]
  onFinished: [[], void]
  onTaskUpdate: [[pack: TaskResultPack], void]

  onWatcherStart: [[], void]
  onWatcherRerun: [[files: string[], trigger: string], void]

  snapshotSaved: [[snapshot: SnapshotResult], void]
}

export type RpcCall = <T extends keyof RpcMap>(method: T, ...args: RpcMap[T][0]) => Promise<RpcMap[T][1]>
export type RpcSend = <T extends keyof RpcMap>(method: T, ...args: RpcMap[T][0]) => void

export type RpcPayload<T extends keyof RpcMap = keyof RpcMap> = { id: string; method: T; args: RpcMap[T][0]}