import type { Task } from "../types";
import type { BadgeProps } from "../components/ui/Badge";

export const statusVariants: Record<
  Task["status"], 
  NonNullable<BadgeProps["variant"]>
> = {
  backlog: "neutral",
  todo: "neutral",
  "in-progress": "warning",
  done: "success",
};

export const priorityVariants: Record<
  Task["priority"], 
  NonNullable<BadgeProps["variant"]>
> = {
  critical: "danger",
  high: "warning",
  medium: "neutral",
  low: "neutral"
};