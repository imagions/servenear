export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)': undefined;
  '+not-found': undefined;
  'service/[id]': { id: string };
  'category/[id]': { id: string };
  'add-service': undefined;
  'cart': undefined;
  'schedule': { serviceId: string };
  'map': undefined;
};

export type TabParamList = {
  index: undefined;
  explore: undefined;
  'voice-help-requests': undefined;
  bookings: undefined;
  profile: undefined;
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
  verify: undefined;
};