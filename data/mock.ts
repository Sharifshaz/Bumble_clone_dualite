export interface Profile {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  images: string[];
  job: string;
  verified: boolean;
  interests: string[];
}

export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 24,
    distance: 2,
    bio: 'Adventure seeker and coffee enthusiast. Let’s find the best latte in town! ☕️',
    job: 'Graphic Designer',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Coffee', 'Design', 'Travel'],
  },
  {
    id: '2',
    name: 'Jessica',
    age: 28,
    distance: 5,
    bio: 'Marketing manager by day, aspiring chef by night. 🍝',
    job: 'Marketing Manager',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Cooking', 'Marketing', 'Yoga'],
  },
  {
    id: '3',
    name: 'Emily',
    age: 26,
    distance: 12,
    bio: 'Love hiking and outdoors. Looking for a partner in crime.',
    job: 'Teacher',
    verified: false,
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Hiking', 'Nature', 'Dogs'],
  },
  {
    id: '4',
    name: 'Michael',
    age: 30,
    distance: 8,
    bio: 'Software Engineer. I speak Python and Sarcasm.',
    job: 'Software Engineer',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Coding', 'Gaming', 'Sci-Fi'],
  },
  {
    id: '5',
    name: 'David',
    age: 29,
    distance: 15,
    bio: 'Entrepreneur. Building the next big thing.',
    job: 'Founder',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Business', 'Startups', 'Gym'],
  },
   {
    id: '6',
    name: 'Olivia',
    age: 25,
    distance: 3,
    bio: 'Art lover and gallery hopper.',
    job: 'Curator',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Art', 'Museums', 'Wine'],
  },
  {
    id: '7',
    name: 'Daniel',
    age: 32,
    distance: 20,
    bio: 'Just moved here. Show me around?',
    job: 'Architect',
    verified: false,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Architecture', 'Travel', 'Photography'],
  },
  {
    id: '8',
    name: 'Sophia',
    age: 23,
    distance: 6,
    bio: 'Student of life. And actual university.',
    job: 'Student',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Books', 'Learning', 'Music'],
  },
  {
    id: '9',
    name: 'James',
    age: 27,
    distance: 10,
    bio: 'Musician. Let’s jam.',
    job: 'Musician',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Music', 'Guitar', 'Concerts'],
  },
  {
    id: '10',
    name: 'Isabella',
    age: 26,
    distance: 4,
    bio: 'Foodie. Always hungry.',
    job: 'Chef',
    verified: true,
    images: [
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?q=80&w=1000&auto=format&fit=crop',
    ],
    interests: ['Food', 'Cooking', 'Restaurants'],
  }
];

export const MOCK_CHATS = [
  {
    id: '1',
    name: 'Alex',
    message: 'Hey! How\'s it going?',
    time: '2m',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Jordan',
    message: 'Love your profile! Do you like hiking?',
    time: '1h',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Taylor',
    message: 'What do you like to do for fun?',
    time: '3h',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1000&auto=format&fit=crop',
  },
];
