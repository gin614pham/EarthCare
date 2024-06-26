export interface Location {
  id: string;
  address: string;
  description: string;
  image: string[];
  locationType: string;
  longitude: number;
  latitude: number;
}

export interface CarouselItems {
  title: string;
  icon: string;
}

export interface Activity {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  hoursStart: string;
  address: string;
  description: string;
  image: string[];
  location: {
    longitude: number;
    latitude: number;
  };
  userId: string;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  avatar: string;
  role: number;
}

export enum ROLE {
  GUEST = 0,
  USER = 1,
  ADMIN = 2,
  VOLUNTEER = 3,
}

export enum durationAnimation {
  DURATION_1000 = 1000,
  DURATION_500 = 500,
  DURATION_300 = 300,
  DELAY_0 = 0,
  DELAY_1 = 150,
  DELAY_2 = 300,
  DELAY_3 = 450,
  DELAY_4 = 600,
  DELAY_5 = 750,
  DELAY_6 = 900,
  DELAY_7 = 1050,
  DELAY_8 = 1200,
  DELAY_9 = 1350,
  DELAY_10 = 1500,
}

export const DayOfWeek = {
  ENG: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  VI: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  JP: ['日', '月', '火', '水', '木', '金', '土'],
};

export const LOCATION_TYPES = [
  {
    label: 'Select location type',
    value: '',
    image: require('../assets/icons/location.png'),
  },
  {
    label: 'Recycling Center',
    value: 'Recycling Center',
    image: require('../assets/icons/recycling-center.png'),
  },
  {
    label: 'Garbage Dump',
    value: 'Garbage Dump',
    image: require('../assets/icons/trash1.png'),
  },
  {
    label: 'Polluted Area',
    value: 'Polluted Area',
    image: require('../assets/icons/danger.png'),
  },
];

export const MAP_TYPES = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const CAROUSEL_ITEMS = [
  {
    id: 1,
    title: 'Vị trí bị ô nhiễm',
    icon: require('../assets/icons/danger.png'),
  },
  {
    id: 2,
    title: 'Vị trí đổ rác thải',
    icon: require('../assets/icons/trash1.png'),
  },
  {
    id: 3,
    title: 'Vị trí tái chế rác',
    icon: require('../assets/icons/recycling-center.png'),
  },
];
