export interface NotificationType {
  message: string;
  type: "success" | "error";
  onClose?: () => void | undefined;
}