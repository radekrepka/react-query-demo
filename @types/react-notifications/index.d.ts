declare module 'react-notifications' {
  import { ComponentType } from 'react';

  declare const NotificationContainer: ComponentType;

  declare const NotificationManager: {
    error: (message: string) => void;
  }
}
