export type ExampleBlob = {
  unencodedSize: number
  encodedSize: number
  price: number
}

export type WalrusInfo = {
  currentEpoch: number
  nShards: number
  nNodes: number
  storageUnitSize: number
  pricePerUnitSize: number
  maxBlobSize: number
  marginalSize: number
  metadataPrice: number
  marginalPrice: number
  exampleBlobs: ExampleBlob[]
}

export interface StoreResponse {
  newlyCreated?: NewlyCreated
  alreadyCertified?: AlreadyCertified
}

export interface AlreadyCertified {
  blobId: string
  eventOrObject: EventOrObject
  endEpoch: number
}

export interface EventOrObject {
  Event: Event
}

export interface Event {
  txDigest: string
  eventSeq: string
}

export interface NewlyCreated {
  blobObject: BlobObject
  resourceOperation: ResourceOperation
  cost: number
}

export interface BlobObject {
  id: string
  registeredEpoch: number
  blobId: string
  size: number
  encodingType: string
  certifiedEpoch: number
  storage: Storage
  deletable: boolean
}

export interface Storage {
  id: string
  startEpoch: number
  endEpoch: number
  storageSize: number
}

export interface ResourceOperation {
  RegisterFromScratch: RegisterFromScratch
}

export interface RegisterFromScratch {
  encoded_length: number
  epochs_ahead: number
}

export interface BlobStatusResponse {
  blobId: string
  status: Status | 'nonexistent'
}

export interface Status {
  permanent: Permanent
}

export interface Permanent {
  endEpoch: number
  isCertified: boolean
  statusEvent: StatusEvent
  deletableCounts: DeletableCounts
  initialCertifiedEpoch: number
}

export interface DeletableCounts {
  count_deletable_total: number
  count_deletable_certified: number
}

export interface StatusEvent {
  txDigest: string
  eventSeq: string
}

export interface BlobListItem {
  id: string
  registeredEpoch: number
  blobId: string
  size: number
  encodingType: string
  certifiedEpoch: number
  storage: Storage
  deletable: boolean
}

export interface Storage {
  id: string
  startEpoch: number
  endEpoch: number
  storageSize: number
}

export interface DeleteResponse {
  blobId: string
  deletedBlobs: DeletedBlob[]
}

export interface DeletedBlob {
  id: string
  registeredEpoch: number
  blobId: string
  size: number
  encodingType: string
  certifiedEpoch: number
  storage: Storage
  deletable: boolean
}

export interface Storage {
  id: string
  startEpoch: number
  endEpoch: number
  storageSize: number
}

export type StoreConfig = {
  epochs?: number
  dryRun?: boolean
  force?: boolean
  deletable?: boolean
}

export type BlobStatusConfig = {
  blobId?: string
  file?: string
  timeout?: number
  rpcUrl?: string
}

export type ListBlobsConfig = {
  includeExpired?: boolean
}

export type DeleteConfig = {
  blobId?: string
  file?: string
  objectId?: string
}
