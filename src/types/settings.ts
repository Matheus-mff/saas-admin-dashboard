export type Settings = {
  name: string;
  email: string;
  company: string;
  emailNotifications: boolean;
};

export type SettingsInput = {
  name: string;
  email: string;
  company?: string;
  emailNotifications: boolean;
};