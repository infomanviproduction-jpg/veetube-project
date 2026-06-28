export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  timeAgo: string;
  replies?: Comment[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  channelHandle: string;
  channelVerified: boolean;
  subscribers: string;
  views: string;
  uploadedAt: string;
  duration: string;
  description: string;
  likes: string;
  category: string;
  comments: Comment[];
}

export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribers: string;
  videoCount: string;
  verified: boolean;
  description: string;
}

const av = (seed: string) => `https://picsum.photos/seed/${seed}/88/88`;
const thumb = (seed: string) => `https://picsum.photos/seed/${seed}/640/360`;
const banner = (seed: string) => `https://picsum.photos/seed/${seed}/1280/240`;

const sampleComments: Comment[] = [
  {
    id: 'c1',
    author: 'Alex Rivera',
    avatar: av('alex'),
    text: 'This is exactly what I needed. The pacing is perfect and the examples are super clear. Subscribed!',
    likes: 1240,
    timeAgo: '2 days ago',
    replies: [
      {
        id: 'c1r1',
        author: 'Jordan Kim',
        avatar: av('jordan'),
        text: 'Agreed! The part at 8:32 was a game changer for me.',
        likes: 88,
        timeAgo: '1 day ago',
      },
      {
        id: 'c1r2',
        author: 'Sam Patel',
        avatar: av('sam'),
        text: 'Same here, been looking for something this thorough for weeks.',
        likes: 42,
        timeAgo: '18 hours ago',
      },
    ],
  },
  {
    id: 'c2',
    author: 'Maria Lopez',
    avatar: av('maria'),
    text: 'The production quality on this channel keeps getting better. That transition at the 5 minute mark was buttery smooth.',
    likes: 567,
    timeAgo: '3 days ago',
    replies: [
      {
        id: 'c2r1',
        author: 'Devon Wright',
        avatar: av('devon'),
        text: 'Right?! I had to rewind it twice.',
        likes: 31,
        timeAgo: '2 days ago',
      },
    ],
  },
  {
    id: 'c3',
    author: 'Priya Sharma',
    avatar: av('priya'),
    text: 'Can we appreciate how much effort goes into these? From scripting to editing, top tier content.',
    likes: 2103,
    timeAgo: '5 days ago',
  },
  {
    id: 'c4',
    author: 'Chris Nguyen',
    avatar: av('chris'),
    text: 'Watching this at 2am instead of sleeping. No regrets.',
    likes: 890,
    timeAgo: '1 week ago',
    replies: [
      {
        id: 'c4r1',
        author: 'Taylor Brooks',
        avatar: av('taylor'),
        text: 'The 2am YouTube rabbit hole is real lol',
        likes: 145,
        timeAgo: '6 days ago',
      },
      {
        id: 'c4r2',
        author: 'Morgan Lee',
        avatar: av('morgan'),
        text: 'Solidarity. 3am here.',
        likes: 67,
        timeAgo: '5 days ago',
      },
    ],
  },
  {
    id: 'c5',
    author: 'Riley Cooper',
    avatar: av('riley'),
    text: 'First time here, really impressed. Just hit subscribe and the bell. Keep it up!',
    likes: 312,
    timeAgo: '4 days ago',
  },
  {
    id: 'c6',
    author: 'Jamie Foster',
    avatar: av('jamie'),
    text: 'The way you break down complex topics into bite-sized pieces is a genuine skill. Thank you for making this free.',
    likes: 1789,
    timeAgo: '1 week ago',
  },
];

export const videos: Video[] = [
  {
    id: 'v1',
    title: 'Learn React in 2 Hours — Complete Beginner to Pro Course',
    thumbnail: thumb('react1'),
    channelName: 'CodeWithMason',
    channelAvatar: av('mason'),
    channelHandle: '@codewithmason',
    channelVerified: true,
    subscribers: '2.4M',
    views: '1.2M views',
    uploadedAt: '2 days ago',
    duration: '2:04:31',
    description:
      'In this complete React course, we cover everything from JSX and components to hooks, state management, and building a full production app. Whether you are brand new to React or looking to level up, this course has you covered.\n\nChapters:\n0:00 Introduction\n08:21 Setting up your environment\n21:45 JSX fundamentals\n45:10 Components and props\n1:12:30 useState and useEffect\n1:38:00 Building a real app\n\nBy the end you will have built a fully functional app and understand the React mental model.',
    likes: '78K',
    category: 'React',
    comments: sampleComments,
  },
  {
    id: 'v2',
    title: 'Top 10 Gaming Moments That Changed Esports Forever',
    thumbnail: thumb('game1'),
    channelName: 'PixelArena',
    channelAvatar: av('pixel'),
    channelHandle: '@pixelarena',
    channelVerified: true,
    subscribers: '5.1M',
    views: '3.4M views',
    uploadedAt: '5 days ago',
    duration: '18:42',
    description:
      'From the impossible comeback to the play that launched a million memes, these are the top 10 moments that defined competitive gaming. Featuring clips from CS:GO, League of Legends, Valorant, Dota 2, and more.',
    likes: '210K',
    category: 'Gaming',
    comments: sampleComments,
  },
  {
    id: 'v3',
    title: 'I Built a Synthesizer From Scratch (Full Build + Sound Test)',
    thumbnail: thumb('synth1'),
    channelName: 'WaveformLab',
    channelAvatar: av('wave'),
    channelHandle: '@waveformlab',
    channelVerified: false,
    subscribers: '890K',
    views: '456K views',
    uploadedAt: '1 week ago',
    duration: '32:15',
    description:
      'A deep dive into analog synthesis. We design the circuit board, solder every component, and patch together a working synth. Full sound test at the end — the bass on this thing is enormous.',
    likes: '34K',
    category: 'Music',
    comments: sampleComments,
  },
  {
    id: 'v4',
    title: '24 Hours Surviving in the Arctic Wilderness',
    thumbnail: thumb('surv1'),
    channelName: 'WildBound',
    channelAvatar: av('wild'),
    channelHandle: '@wildbound',
    channelVerified: true,
    subscribers: '8.2M',
    views: '5.6M views',
    uploadedAt: '3 days ago',
    duration: '24:08',
    description:
      'I spent 24 hours alone in the Arctic with minimal gear. Building shelter, finding water, and keeping warm in -30°C. This was the hardest challenge I have ever done.',
    likes: '320K',
    category: 'Live',
    comments: sampleComments,
  },
  {
    id: 'v5',
    title: 'The Ultimate Chocolate Lava Cake — Restaurant Quality at Home',
    thumbnail: thumb('cook1'),
    channelName: 'KitchenCraft',
    channelAvatar: av('kitchen'),
    channelHandle: '@kitchencraft',
    channelVerified: true,
    subscribers: '3.7M',
    views: '1.8M views',
    uploadedAt: '4 days ago',
    duration: '12:33',
    description:
      'The perfect molten chocolate lava cake with a gooey center every single time. I will show you the exact temperature, timing, and the one ingredient most recipes get wrong.',
    likes: '92K',
    category: 'Cooking',
    comments: sampleComments,
  },
  {
    id: 'v6',
    title: 'Python Full Course — Build 5 Real Projects in 2024',
    thumbnail: thumb('py1'),
    channelName: 'DevSimplified',
    channelAvatar: av('dev'),
    channelHandle: '@devsimplified',
    channelVerified: true,
    subscribers: '1.9M',
    views: '980K views',
    uploadedAt: '6 days ago',
    duration: '4:12:55',
    description:
      'Learn Python by building 5 real projects: a web scraper, a CLI tool, a Flask API, a data dashboard, and an automation script. Every project is practical and portfolio-ready.',
    likes: '56K',
    category: 'Python',
    comments: sampleComments,
  },
  {
    id: 'v7',
    title: 'Why This Tiny Country Has the Fastest Internet in the World',
    thumbnail: thumb('tech1'),
    channelName: 'TechFrontier',
    channelAvatar: av('tech'),
    channelHandle: '@techfrontier',
    channelVerified: true,
    subscribers: '4.3M',
    views: '2.1M views',
    uploadedAt: '1 week ago',
    duration: '16:47',
    description:
      'We traveled to find out how this country built the fastest, most affordable internet infrastructure on the planet. The answer involves government policy, fiber optics, and a very different way of thinking about connectivity.',
    likes: '88K',
    category: 'News',
    comments: sampleComments,
  },
  {
    id: 'v8',
    title: 'Lo-Fi Beats to Study/Relax to — 1 Hour Live Stream',
    thumbnail: thumb('lofi1'),
    channelName: 'ChillSphere',
    channelAvatar: av('chill'),
    channelHandle: '@chillsphere',
    channelVerified: false,
    subscribers: '1.2M',
    views: '6.7M views',
    uploadedAt: '2 weeks ago',
    duration: '1:02:14',
    description:
      'A curated hour of lo-fi hip hop beats for studying, relaxing, or coding. No ads, no talking, just vibes. Hit play and get into the flow.',
    likes: '145K',
    category: 'Music',
    comments: sampleComments,
  },
  {
    id: 'v9',
    title: 'I Raced a $2M Hypercar Against a Fighter Jet',
    thumbnail: thumb('race1'),
    channelName: 'SpeedCraze',
    channelAvatar: av('speed'),
    channelHandle: '@speedcraze',
    channelVerified: true,
    subscribers: '12M',
    views: '9.8M views',
    uploadedAt: '3 days ago',
    duration: '14:22',
    description:
      'The ultimate speed test. We lined up a 1500hp hypercar against a military fighter jet on a 2-mile runway. The result was closer than anyone expected.',
    likes: '540K',
    category: 'Sports',
    comments: sampleComments,
  },
  {
    id: 'v10',
    title: 'How Black Holes Actually Work — A Visual Explanation',
    thumbnail: thumb('space1'),
    channelName: 'CosmosDecoded',
    channelAvatar: av('cosmos'),
    channelHandle: '@cosmosdecoded',
    channelVerified: true,
    subscribers: '6.5M',
    views: '4.2M views',
    uploadedAt: '5 days ago',
    duration: '22:18',
    description:
      'Using stunning visualizations, we break down what happens inside a black hole, why time slows down, and what spaghettification really means. No physics degree required.',
    likes: '230K',
    category: 'Learning',
    comments: sampleComments,
  },
  {
    id: 'v11',
    title: 'Building a Modern PC for $800 — Can It Run Everything?',
    thumbnail: thumb('pc1'),
    channelName: 'PixelArena',
    channelAvatar: av('pixel'),
    channelHandle: '@pixelarena',
    channelVerified: true,
    subscribers: '5.1M',
    views: '780K views',
    uploadedAt: '4 days ago',
    duration: '28:40',
    description:
      'We build a complete gaming PC with an $800 budget and benchmark it against today\'s most demanding titles at 1440p. Spoiler: the results surprised us.',
    likes: '45K',
    category: 'Gaming',
    comments: sampleComments,
  },
  {
    id: 'v12',
    title: 'The Math Behind Every Casino Game (Why the House Always Wins)',
    thumbnail: thumb('math1'),
    channelName: 'MindBenders',
    channelAvatar: av('mind'),
    channelHandle: '@mindbenders',
    channelVerified: true,
    subscribers: '2.8M',
    views: '1.5M views',
    uploadedAt: '1 week ago',
    duration: '19:55',
    description:
      'We break down the probability and expected value behind roulette, blackjack, and slots. Understanding the math is the first step to never losing money you cannot afford.',
    likes: '67K',
    category: 'Learning',
    comments: sampleComments,
  },
  {
    id: 'v13',
    title: 'Live: 2024 Championship Finals — Watch Now',
    thumbnail: thumb('live1'),
    channelName: 'ArenaLive',
    channelAvatar: av('arena'),
    channelHandle: '@arenalive',
    channelVerified: true,
    subscribers: '3.2M',
    views: '89K watching',
    uploadedAt: 'Started 1 hour ago',
    duration: 'LIVE',
    description:
      'The grand finals are live! Two teams, one trophy, and everything on the line. Join the chat and watch history unfold in real time.',
    likes: '12K',
    category: 'Live',
    comments: sampleComments,
  },
  {
    id: 'v14',
    title: 'I Tried Making Sushi for the First Time (Disaster?)',
    thumbnail: thumb('sushi1'),
    channelName: 'KitchenCraft',
    channelAvatar: av('kitchen'),
    channelHandle: '@kitchencraft',
    channelVerified: true,
    subscribers: '3.7M',
    views: '1.1M views',
    uploadedAt: '6 days ago',
    duration: '15:28',
    description:
      'I have never made sushi before. With zero experience and a lot of rice, I attempt to make nigiri, maki rolls, and a dragon roll. Some of it actually worked.',
    likes: '54K',
    category: 'Cooking',
    comments: sampleComments,
  },
  {
    id: 'v15',
    title: 'TypeScript Generics Explained — Finally Clicks',
    thumbnail: thumb('ts1'),
    channelName: 'CodeWithMason',
    channelAvatar: av('mason'),
    channelHandle: '@codewithmason',
    channelVerified: true,
    subscribers: '2.4M',
    views: '620K views',
    uploadedAt: '3 days ago',
    duration: '26:44',
    description:
      'Generics are the most confusing part of TypeScript for most developers. This video makes them click with real-world examples, visual diagrams, and zero jargon.',
    likes: '38K',
    category: 'React',
    comments: sampleComments,
  },
  {
    id: 'v16',
    title: 'The History of Every Major Video Game Console (1972–2024)',
    thumbnail: thumb('console1'),
    channelName: 'PixelArena',
    channelAvatar: av('pixel'),
    channelHandle: '@pixelarena',
    channelVerified: true,
    subscribers: '5.1M',
    views: '2.8M views',
    uploadedAt: '2 weeks ago',
    duration: '45:12',
    description:
      'From the Magnavox Odyssey to the PS5, we trace the complete history of home video game consoles — the rivalries, the failures, and the innovations that changed entertainment.',
    likes: '180K',
    category: 'Gaming',
    comments: sampleComments,
  },
  {
    id: 'v17',
    title: 'Morning Jazz — Smooth Coffee Shop Vibes for a Perfect Start',
    thumbnail: thumb('jazz1'),
    channelName: 'ChillSphere',
    channelAvatar: av('chill'),
    channelHandle: '@chillsphere',
    channelVerified: false,
    subscribers: '1.2M',
    views: '3.3M views',
    uploadedAt: '1 week ago',
    duration: '58:30',
    description:
      'Start your morning right with an hour of smooth jazz. Perfect for coffee, reading, or easing into the day. Curated tracks from rising jazz artists.',
    likes: '76K',
    category: 'Music',
    comments: sampleComments,
  },
  {
    id: 'v18',
    title: 'Breaking: Major Tech Announcement Shakes the Industry',
    thumbnail: thumb('news1'),
    channelName: 'TechFrontier',
    channelAvatar: av('tech'),
    channelHandle: '@techfrontier',
    channelVerified: true,
    subscribers: '4.3M',
    views: '890K views',
    uploadedAt: '8 hours ago',
    duration: '8:15',
    description:
      'A surprise announcement just dropped and the implications are massive. We break down what happened, what it means for consumers, and what to watch for next.',
    likes: '23K',
    category: 'News',
    comments: sampleComments,
  },
  {
    id: 'v19',
    title: 'How to Solve a Rubik\'s Cube in Under 1 Minute (Beginner Method)',
    thumbnail: thumb('cube1'),
    channelName: 'MindBenders',
    channelAvatar: av('mind'),
    channelHandle: '@mindbenders',
    channelVerified: true,
    subscribers: '2.8M',
    views: '4.5M views',
    uploadedAt: '2 weeks ago',
    duration: '10:42',
    description:
      'The easiest beginner method to solve a Rubik\'s cube. No memorizing dozens of algorithms — just a simple, repeatable process anyone can learn in one sitting.',
    likes: '150K',
    category: 'Learning',
    comments: sampleComments,
  },
  {
    id: 'v20',
    title: 'I Lived in a Van for 30 Days — Here is What Happened',
    thumbnail: thumb('van1'),
    channelName: 'WildBound',
    channelAvatar: av('wild'),
    channelHandle: '@wildbound',
    channelVerified: true,
    subscribers: '8.2M',
    views: '6.1M views',
    uploadedAt: '4 days ago',
    duration: '21:37',
    description:
      'I converted a cargo van into a tiny home and lived in it for 30 days. The freedom was incredible, but the challenges were real. Here is the full honest breakdown.',
    likes: '290K',
    category: 'Live',
    comments: sampleComments,
  },
  {
    id: 'v21',
    title: 'The Perfect Pour-Over Coffee — Barista Secrets Revealed',
    thumbnail: thumb('coffee1'),
    channelName: 'KitchenCraft',
    channelAvatar: av('kitchen'),
    channelHandle: '@kitchencraft',
    channelVerified: true,
    subscribers: '3.7M',
    views: '920K views',
    uploadedAt: '5 days ago',
    duration: '11:20',
    description:
      'A professional barista walks through the exact technique for a perfect pour-over every time. Grind size, water temp, bloom time, and pour pattern — all the variables that matter.',
    likes: '41K',
    category: 'Cooking',
    comments: sampleComments,
  },
  {
    id: 'v22',
    title: 'Next.js 14 App Router — Everything You Need to Know',
    thumbnail: thumb('next1'),
    channelName: 'DevSimplified',
    channelAvatar: av('dev'),
    channelHandle: '@devsimplified',
    channelVerified: true,
    subscribers: '1.9M',
    views: '540K views',
    uploadedAt: '1 week ago',
    duration: '38:09',
    description:
      'A complete guide to the Next.js 14 App Router. Server components, layouts, loading states, error boundaries, and data fetching — all explained with practical examples.',
    likes: '29K',
    category: 'React',
    comments: sampleComments,
  },
  {
    id: 'v23',
    title: 'The Science of Sleep — Why You Wake Up Tired (and How to Fix It)',
    thumbnail: thumb('sleep1'),
    channelName: 'CosmosDecoded',
    channelAvatar: av('cosmos'),
    channelHandle: '@cosmosdecoded',
    channelVerified: true,
    subscribers: '6.5M',
    views: '3.9M views',
    uploadedAt: '3 days ago',
    duration: '17:51',
    description:
      'We break down the sleep cycles, why 8 hours is not always enough, and the science-backed habits that actually improve sleep quality. Backed by peer-reviewed research.',
    likes: '175K',
    category: 'Learning',
    comments: sampleComments,
  },
  {
    id: 'v24',
    title: 'F1 Monaco Grand Prix — Every Overtake in 4 Minutes',
    thumbnail: thumb('f1_1'),
    channelName: 'SpeedCraze',
    channelAvatar: av('speed'),
    channelHandle: '@speedcraze',
    channelVerified: true,
    subscribers: '12M',
    views: '7.2M views',
    uploadedAt: '6 days ago',
    duration: '4:18',
    description:
      'Every single overtake from the Monaco Grand Prix, back to back. The most action-packed 4 minutes of racing you will watch all year.',
    likes: '410K',
    category: 'Sports',
    comments: sampleComments,
  },
];

export const channels: Channel[] = [
  {
    id: 'ch1',
    name: 'CodeWithMason',
    handle: '@codewithmason',
    avatar: av('mason'),
    banner: banner('masonban'),
    subscribers: '2.4M',
    videoCount: '342',
    verified: true,
    description:
      'Practical web development tutorials. New videos every week on React, TypeScript, and modern frontend tooling. Let\'s build together.',
  },
  {
    id: 'ch2',
    name: 'PixelArena',
    handle: '@pixelarena',
    avatar: av('pixel'),
    banner: banner('pixelban'),
    subscribers: '5.1M',
    videoCount: '1.2K',
    verified: true,
    description:
      'Gaming content, PC builds, and esports coverage. We live and breathe games. New uploads every Tuesday and Friday.',
  },
  {
    id: 'ch3',
    name: 'WaveformLab',
    handle: '@waveformlab',
    avatar: av('wave'),
    banner: banner('waveban'),
    subscribers: '890K',
    videoCount: '156',
    verified: false,
    description:
      'DIY electronics, synth builds, and audio engineering deep dives. Analog warmth, digital precision.',
  },
  {
    id: 'ch4',
    name: 'WildBound',
    handle: '@wildbound',
    avatar: av('wild'),
    banner: banner('wildban'),
    subscribers: '8.2M',
    videoCount: '489',
    verified: true,
    description:
      'Survival challenges, wilderness expeditions, and pushing human limits. New adventure every Sunday.',
  },
  {
    id: 'ch5',
    name: 'KitchenCraft',
    handle: '@kitchencraft',
    avatar: av('kitchen'),
    banner: banner('kitchenban'),
    subscribers: '3.7M',
    videoCount: '678',
    verified: true,
    description:
      'Restaurant-quality recipes you can make at home. From sushi to lava cakes, we make cooking approachable and fun.',
  },
  {
    id: 'ch6',
    name: 'DevSimplified',
    handle: '@devsimplified',
    avatar: av('dev'),
    banner: banner('devban'),
    subscribers: '1.9M',
    videoCount: '234',
    verified: true,
    description:
      'Programming made simple. Python, Next.js, and full-stack project tutorials. Learn by building real things.',
  },
  {
    id: 'ch7',
    name: 'TechFrontier',
    handle: '@techfrontier',
    avatar: av('tech'),
    banner: banner('techban'),
    subscribers: '4.3M',
    videoCount: '512',
    verified: true,
    description:
      'Exploring the technology shaping our future. Deep dives, news, and the stories behind the world\'s biggest tech.',
  },
  {
    id: 'ch8',
    name: 'ChillSphere',
    handle: '@chillsphere',
    avatar: av('chill'),
    banner: banner('chillban'),
    subscribers: '1.2M',
    videoCount: '89',
    verified: false,
    description:
      'Lo-fi, jazz, and chill beats for studying, relaxing, and focusing. New mixes every week.',
  },
  {
    id: 'ch9',
    name: 'SpeedCraze',
    handle: '@speedcraze',
    avatar: av('speed'),
    banner: banner('speedban'),
    subscribers: '12M',
    videoCount: '1.5K',
    verified: true,
    description:
      'Hypercars, racing, and the need for speed. We test the fastest machines on the planet.',
  },
  {
    id: 'ch10',
    name: 'CosmosDecoded',
    handle: '@cosmosdecoded',
    avatar: av('cosmos'),
    banner: banner('cosmosban'),
    subscribers: '6.5M',
    videoCount: '301',
    verified: true,
    description:
      'Space, science, and the universe explained visually. Making complex ideas accessible to everyone.',
  },
  {
    id: 'ch11',
    name: 'MindBenders',
    handle: '@mindbenders',
    avatar: av('mind'),
    banner: banner('mindban'),
    subscribers: '2.8M',
    videoCount: '198',
    verified: true,
    description:
      'Puzzles, probability, and the math behind everyday life. Train your brain with us.',
  },
  {
    id: 'ch12',
    name: 'ArenaLive',
    handle: '@arenalive',
    avatar: av('arena'),
    banner: banner('arenaban'),
    subscribers: '3.2M',
    videoCount: '2.3K',
    verified: true,
    description:
      'Live esports, tournaments, and championship coverage. We never miss a moment.',
  },
];

export const categories = [
  'All',
  'Music',
  'Gaming',
  'News',
  'Live',
  'Cooking',
  'React',
  'Python',
  'Sports',
  'Learning',
  'Technology',
  'Podcasts',
  'Recently uploaded',
  'Watched',
  'New to you',
];

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

export function getChannelByHandle(handle: string): Channel | undefined {
  return channels.find((c) => c.handle === handle);
}

export function getChannelById(id: string): Channel | undefined {
  return channels.find((c) => c.id === id);
}

export function getVideosByChannelHandle(handle: string): Video[] {
  return videos.filter((v) => v.channelHandle === handle);
}

export function searchVideos(query: string): Video[] {
  const q = query.toLowerCase();
  return videos.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.channelName.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q),
  );
}

export function getRelatedVideos(currentId: string, limit = 12): Video[] {
  const current = getVideoById(currentId);
  if (!current) return videos.slice(0, limit);
  const sameCategory = videos.filter(
    (v) => v.id !== currentId && v.category === current.category,
  );
  const others = videos.filter(
    (v) => v.id !== currentId && v.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
