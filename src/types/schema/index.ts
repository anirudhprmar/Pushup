export enum GoalType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  LIFETIME = "LIFETIME"
}

export enum GoalStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  ACHIEVED = "ACHIEVED"
}

export enum WeeklyRating {
    Unrated = 0,
    Terrible = 1,
    Bad = 2,
    Neutral = 3,
    Good = 4,
    Great = 5
}

export enum NotificationType {
  INFO = "INFO",
  FEATURE = "FEATURE",
  UPDATE = "UPDATE",
  WARNING = "WARNING",
  WELCOME = "WELCOME"
}