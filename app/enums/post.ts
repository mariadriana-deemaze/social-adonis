export enum PostReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  THANKFUL = 'THANKFUL',
  FUNNY = 'FUNNY',
  ANGRY = 'ANGRY',
  CONGRATULATIONS = 'CONGRATULATIONS',
}

export enum PostReportReason {
  ADULTERY = 'ADULTERY',
  IMPERSONATION = 'IMPERSONATION',
  OFFENSIVE = 'OFFENSIVE'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  REPORTED = 'REPORTED'
}

export enum PostReportStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
