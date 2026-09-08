import { eventChoiceThemes, type ChoiceTheme } from './choice-themes';
export const chapters = [
  { name: 'First agency', range: '13–15', start: 13, end: 16, count: 3 },
  { name: 'Becoming', range: '16–18', start: 16, end: 19, count: 4 },
  { name: 'Thresholds', range: '19–24', start: 19, end: 25, count: 5 },
  { name: 'Making a life', range: '25–34', start: 25, end: 35, count: 6 },
  { name: 'Commitments', range: '35–44', start: 35, end: 45, count: 6 },
  { name: 'Revision', range: '45–54', start: 45, end: 55, count: 6 },
  { name: 'Perspective', range: '55–64', start: 55, end: 65, count: 5 },
  { name: 'Harvest', range: '65–74', start: 65, end: 75, count: 5 },
  { name: 'Late horizons', range: '75–85', start: 75, end: 86, count: 4 },
];
export const constellations = [
  {
    id: 'inheritance',
    name: 'Inheritance',
    symbol: 'orbit',
    question: 'What was waiting when you arrived?',
    description: 'The resources, roots, and expectations you inherit.',
    options: [
      ['A reliable safety net', 'There is always somewhere soft to land.'],
      ['Enough, but no more', 'You learn the value of what you have.'],
      ['Comfort with conditions', 'Doors open. Expectations follow.'],
    ],
  },
  {
    id: 'temperament',
    name: 'Temperament',
    symbol: 'spark',
    question: 'How do you meet the unknown?',
    description: 'Your first instinct. Never your final definition.',
    options: [
      ['Follow your curiosity', 'The unfamiliar has a certain pull.'],
      ['Pause and observe', 'You notice what others hurry past.'],
      ['Reach toward people', 'A stranger is a story you haven’t heard.'],
    ],
  },
  {
    id: 'body',
    name: 'Body',
    symbol: 'sun',
    question: 'What rhythm does your body keep?',
    description: 'Every life moves at its own pace.',
    options: [
      ['Energy to spare', 'There is a restless spring in your step.'],
      ['A changing rhythm', 'Some days ask more patience than others.'],
      ['Care in the everyday', 'You make space for rest and support.'],
    ],
  },
  {
    id: 'obligations',
    name: 'Obligations',
    symbol: 'link',
    question: 'Who or what is counting on you?',
    description: 'The things you carry as your world opens.',
    options: [
      ['Room to explore', 'For now, your time is mostly your own.'],
      ['Needed at home', 'Someone’s everyday is easier with you in it.'],
      ['Learning to contribute', 'You are finding your part in the whole.'],
    ],
  },
  {
    id: 'belonging',
    name: 'Belonging',
    symbol: 'stars',
    question: 'Where do you feel at home?',
    description: 'The people and places that give you a shape.',
    options: [
      ['Deep roots', 'Your stories begin where your family’s do.'],
      ['Between communities', 'You carry pieces of more than one world.'],
      ['A new beginning', 'The streets are unfamiliar. So are the faces.'],
    ],
  },
  {
    id: 'chance',
    name: 'Chance',
    symbol: 'comet',
    question: 'And then, something unexpected.',
    description: 'Life leaves a little room for the unplanned.',
    options: [
      ['An unexpected invitation', 'A small yes could open a very large door.'],
      ['A change at home', 'Something familiar is beginning to shift.'],
      [
        'A surprising connection',
        'Someone arrives who sees things differently.',
      ],
    ],
  },
];
export const forces = ['connection', 'freedom', 'meaning', 'vitality'] as const;
export type Force = (typeof forces)[number];
export const avatars = [
  { name: 'Finding your feet', position: 0 },
  { name: 'A new graduate', position: 1 },
  { name: 'Building a career', position: 2 },
  { name: 'Making things', position: 3 },
  { name: 'Out in the world', position: 4 },
  { name: 'A life well explored', position: 5 },
];
export type Effect = {
  force?: Force;
  amount?: number;
  cash?: number;
  role?: 'student' | 'office' | 'maker' | 'traveler' | 'retired';
  keepsake?: string;
  flag?: string;
  requires?: string;
  avatar?: number;
};
export type Choice = {
  category: ChoiceTheme;
  label: string;
  hint: string;
  outcome: string;
  effect: Effect;
};
export type LifeEvent = {
  id: string;
  chapter: number;
  title: string;
  scene: string;
  theme: string;
  choices: Choice[];
  requires?: string;
};
type Pick = [string, string, Effect?];
function event(
  chapter: number,
  id: string,
  title: string,
  scene: string,
  theme: string,
  a: Pick,
  b: Pick,
  c: Pick,
  requires?: string,
): LifeEvent {
  return {
    id,
    chapter,
    title,
    scene,
    theme,
    requires,
    choices: [a, b, c].map((p, i) => ({
      category:
        eventChoiceThemes[id]?.[i] ||
        (['curiosity', 'connection', 'freedom'] as ChoiceTheme[])[i],
      label: p[0],
      hint: [
        'Follow the possibility',
        'Make room for connection',
        'Choose your own rhythm',
      ][i],
      outcome: p[1],
      effect: p[2] || {
        force: (['meaning', 'connection', 'freedom'] as Force[])[i],
        amount: 6,
      },
    })),
  };
}
export const events: LifeEvent[] = [
  event(
    0,
    'empty-chair',
    'The empty chair',
    'Saturday afternoon. A drawing club is meeting at the library. Through the window, you see an empty chair and a table scattered with pencils. Nobody here knows who you are yet.',
    'CURIOSITY',
    [
      'Take the empty chair',
      'Your first sketch is uneven. You date it anyway.',
      {
        force: 'meaning',
        amount: 7,
        keepsake: 'Your first sketch',
        flag: 'artist',
      },
    ],
    [
      'Bring someone with you',
      'A hesitant invitation becomes a shared Saturday ritual.',
    ],
    [
      'Keep the afternoon open',
      'You take the long way home, with nothing to be late for.',
    ],
  ),
  event(
    0,
    'small-secret',
    'A little trust',
    'A classmate tells you why they have been so quiet lately. “Please don’t tell everyone.” For a moment, being trusted feels heavier than being liked.',
    'BELONGING',
    [
      'Listen, without trying to fix it',
      'You learn that attention can be a kind of shelter.',
    ],
    [
      'Help them find a trusted adult',
      'Neither of you has to carry this alone.',
    ],
    ['Check in with them tomorrow', 'You remember. That turns out to matter.'],
  ),
  event(
    0,
    'old-camera',
    'A different way of seeing',
    'At a neighborhood sale, an old camera catches your eye. It costs almost all your saved pocket money. The seller says it still works.',
    'DISCOVERY',
    [
      'Trade your savings for the camera',
      'You begin noticing the light on ordinary things.',
      {
        cash: -20,
        force: 'meaning',
        amount: 7,
        keepsake: 'A secondhand camera',
      },
    ],
    [
      'Ask someone to share the cost',
      'Your first photograph has both of your shadows in it.',
    ],
    [
      'Look around a little longer',
      'You keep your money and leave with a story.',
    ],
  ),
  event(
    0,
    'small-stage',
    'Before the curtain',
    'The school play needs one more person. Not the lead. Just someone willing to stand where people can see them. Your hand almost rises.',
    'COURAGE',
    ['Raise your hand', 'Your voice shakes. It still reaches the back row.'],
    [
      'Offer to work backstage',
      'You discover the satisfaction of making others shine.',
    ],
    [
      'Go and cheer from the audience',
      'You find your own way to be part of the room.',
    ],
  ),
  event(
    0,
    'home-change',
    'The shape of home',
    'The room at home everyone uses is being rearranged. For the first time, someone asks what you would change. It is a small question with an unexpectedly large feeling.',
    'ROOTS',
    [
      'Make a corner for your projects',
      'A small desk becomes a place to imagine.',
    ],
    [
      'Create somewhere to sit together',
      'More conversations happen without anyone planning them.',
    ],
    [
      'Keep one familiar thing',
      'The old chair stays. A little continuity helps.',
    ],
  ),
  event(
    0,
    'new-face',
    'A name you don’t know',
    'Someone new arrives halfway through the school year. At lunch, they stand holding a tray, searching for somewhere to belong.',
    'CONNECTION',
    [
      'Wave them over',
      'A new name becomes a familiar face.',
      { force: 'connection', amount: 8, flag: 'friend' },
    ],
    [
      'Ask about where they came from',
      'Your world gets a little bigger at a lunch table.',
    ],
    ['Give them space, then say hello', 'Sometimes a quiet welcome is enough.'],
  ),
  event(
    1,
    'first-pay',
    'Money with your name on it',
    'A local shop offers a few hours of work each week. Your first pay would be yours. So would the afternoons you give in exchange.',
    'INDEPENDENCE',
    [
      'Take the weekend shift',
      'You learn the weight of money you earned.',
      { cash: 180, force: 'meaning', amount: 5 },
    ],
    [
      'Ask for fewer hours',
      'You find an arrangement that leaves room for school and friends.',
    ],
    [
      'Keep your afternoons free',
      'You protect time whose value is harder to count.',
    ],
  ),
  event(
    1,
    'after-school',
    'Beyond the timetable',
    'Applications are opening. Some people seem certain about their next step. You are beginning to suspect certainty is not a requirement.',
    'POSSIBILITY',
    [
      'Apply to study further',
      'You begin a course of study, one question at a time.',
      { role: 'student', flag: 'enrolled', force: 'meaning', amount: 7 },
    ],
    [
      'Explore a practical apprenticeship',
      'You start learning things your hands remember.',
      { role: 'maker', flag: 'craft', force: 'meaning', amount: 7 },
    ],
    [
      'Leave room to discover',
      'You allow yourself a beginning without a fixed title.',
      { role: 'traveler', force: 'freedom', amount: 8 },
    ],
  ),
  event(
    1,
    'last-summer',
    'The long summer',
    'There is a stretch of summer ahead with no fixed plan. One friend wants a small adventure. Your family could use some help. You also want time that belongs only to you.',
    'TIME',
    [
      'Go on the little adventure',
      'The journey is short. The memory is not.',
      { force: 'freedom', amount: 7, keepsake: 'A summer train ticket' },
    ],
    [
      'Be there at home',
      'You become part of stories you might otherwise have missed.',
    ],
    [
      'Make a project of your own',
      'Something unfinished starts to take a shape.',
    ],
  ),
  event(
    1,
    'different-opinion',
    'Your own voice',
    'Around a familiar table, someone makes a comment you disagree with. Once, you would have stayed quiet without thinking. This time you notice the choice.',
    'IDENTITY',
    ['Say what you believe', 'Your words are imperfect, but they are yours.'],
    [
      'Ask why they see it that way',
      'The conversation becomes less certain and more interesting.',
    ],
    [
      'Speak to them privately later',
      'You choose a smaller audience for an important thought.',
    ],
  ),
  event(
    1,
    'friend-distance',
    'A little distance',
    'A friend has begun spending time with a new group. Nothing dramatic has happened. Somehow that makes the distance harder to name.',
    'FRIENDSHIP',
    [
      'Invite them to do something familiar',
      'For an afternoon, the old ease returns.',
    ],
    [
      'Tell them you miss them',
      'The honesty is awkward for a moment, then warm.',
    ],
    [
      'Let the friendship change shape',
      'You make room for other people without erasing this one.',
    ],
  ),
  event(
    1,
    'first-failure',
    'The result you didn’t want',
    'You worked for something and did not get it. The reply is short. Your feelings are not. A new opportunity is already waiting, but so is the option to pause.',
    'RESILIENCE',
    [
      'Try again, differently',
      'You change the method without discarding the desire.',
    ],
    [
      'Ask someone for perspective',
      'Another pair of eyes helps you see more than the result.',
    ],
    [
      'Take a little time',
      'Rest becomes a decision rather than an apology.',
      { force: 'vitality', amount: 8 },
    ],
  ),
  event(
    2,
    'open-door',
    'A door into working life',
    'A team is willing to give you a chance. The work is unfamiliar, the people seem kind, and the days would have a dependable shape.',
    'WORK',
    [
      'Take the office role',
      'Your name appears on a desk. You start learning the rest.',
      { role: 'office', force: 'meaning', amount: 5 },
    ],
    [
      'Choose hands-on work instead',
      'You prefer a day with something tangible at its end.',
      { role: 'maker', flag: 'craft', force: 'meaning', amount: 6 },
    ],
    [
      'Keep exploring for now',
      'The uncertainty buys you time to look around.',
      { role: 'traveler', force: 'freedom', amount: 7 },
    ],
  ),
  event(
    2,
    'new-city',
    'A city that doesn’t know you',
    'There is a place on the map you keep returning to. A modest room may be available. You can already imagine introducing yourself without explaining your past.',
    'PLACE',
    [
      'Make the move',
      'The first night is quiet. The second morning is yours.',
      {
        role: 'traveler',
        force: 'freedom',
        amount: 8,
        keepsake: 'A key to a new city',
      },
    ],
    [
      'Try a short visit first',
      'You learn the difference between a place imagined and a place lived.',
    ],
    [
      'Build something where you are',
      'You look at familiar streets with a little more intention.',
    ],
  ),
  event(
    2,
    'dinner-invitation',
    'One more place at the table',
    'Someone you barely know invites you to dinner. “Bring nothing.” You almost make an excuse. Then you wonder how people ever become less than strangers.',
    'BELONGING',
    [
      'Say yes',
      'You leave with a recipe and someone to call.',
      {
        force: 'connection',
        amount: 8,
        flag: 'friend',
        keepsake: 'A handwritten recipe',
      },
    ],
    ['Ask to bring a friend', 'The table makes room for another story.'],
    [
      'Suggest a quieter coffee',
      'You meet in a way that lets you be yourself.',
    ],
  ),
  event(
    2,
    'unfinished-song',
    'A thing you make for yourself',
    'There is a small creative project you keep picking up and putting down. It has no obvious audience and no guarantee of being good. It still calls to you.',
    'CRAFT',
    [
      'Give it a regular hour',
      'It becomes a practice before it becomes a finished thing.',
      { force: 'meaning', amount: 8, flag: 'artist' },
    ],
    [
      'Find someone to make things with',
      'An exchange of half-formed ideas becomes its own pleasure.',
    ],
    [
      'Let it stay private',
      'You remember that not everything needs an audience.',
    ],
  ),
  event(
    2,
    'budget',
    'The first real budget',
    'Your money has several possible futures: a little security, a meaningful experience, or help for someone you care about. You cannot do everything at once.',
    'RESOURCES',
    [
      'Build a small reserve',
      'The number grows slowly. So does your breathing room.',
      { cash: 250, force: 'freedom', amount: 2 },
    ],
    [
      'Plan an affordable experience',
      'You choose something memorable within what you can spare.',
    ],
    [
      'Share time instead of money',
      'You find a way to help without promising what you do not have.',
    ],
  ),
  event(
    2,
    'quiet-love',
    'Something like a beginning',
    'You find yourself looking forward to one person’s messages. Nothing has been named yet. Naming it might change things. Leaving it unnamed might too.',
    'LOVE',
    [
      'Tell them how you feel',
      'You agree to see where this could go.',
      { force: 'connection', amount: 8, flag: 'partner' },
    ],
    [
      'Spend more time together',
      'You allow the connection to grow at its own pace.',
      { force: 'connection', amount: 5, flag: 'partner' },
    ],
    [
      'Keep the friendship as it is',
      'You protect a connection you already value.',
    ],
  ),
  event(
    2,
    'qualification',
    'The day you finish',
    'After the late evenings and difficult weeks, your qualification is complete. For once, the work is behind you and the day is simply yours.',
    'MILESTONE',
    [
      'Go to the ceremony',
      'You keep a photograph of a very ordinary, very proud smile.',
      {
        avatar: 1,
        flag: 'qualified',
        keepsake: 'A graduation photograph',
        force: 'meaning',
        amount: 8,
      },
    ],
    ['Celebrate with your people', 'They know what this took. That is enough.'],
    [
      'Mark the moment quietly',
      'You write down what you learned beyond the syllabus.',
    ],
    'enrolled',
  ),
  event(
    3,
    'roots',
    'A place to put the books',
    'For a while, home has felt temporary. Now you could make it more yours: a longer lease, a shared place, or simply allowing yourself to unpack.',
    'HOME',
    [
      'Put down a few roots',
      'You hang the picture you kept wrapped up.',
      { force: 'meaning', amount: 6, keepsake: 'A picture finally hung' },
    ],
    [
      'Make a home with other people',
      'Everyday life gains the sound of another person making tea.',
    ],
    [
      'Keep your life a little portable',
      'Your home becomes what you carry and who you call.',
    ],
  ),
  event(
    3,
    'work-crossroad',
    'The next rung',
    'There is a more demanding role available. More money, more responsibility, and fewer evenings that end on time. Someone asks if you want your name considered.',
    'AMBITION',
    [
      'Put your name forward',
      'You learn to lead, and to decide what can wait.',
      { role: 'office', cash: 600, force: 'meaning', amount: 6 },
    ],
    [
      'Ask for a different arrangement',
      'You discover that an offer can be the beginning of a conversation.',
    ],
    [
      'Keep room outside work',
      'You leave some capacity for the rest of your life.',
      { force: 'vitality', amount: 7 },
    ],
  ),
  event(
    3,
    'small-business',
    'Something with your name on it',
    'People have started asking whether you could do more of the thing you make well. A small venture is beginning to look possible, if you are willing to start small.',
    'CRAFT',
    [
      'Try a weekend venture',
      'Your first customer remembers your name.',
      { role: 'maker', flag: 'craft', force: 'meaning', amount: 8 },
    ],
    [
      'Build it with someone',
      'You discover which responsibilities each of you can carry.',
    ],
    [
      'Keep it as a pleasure',
      'You let something stay valuable without making it your income.',
    ],
  ),
  event(
    3,
    'parenthood-question',
    'Making room for a child',
    'You have been thinking about what it would mean to care for a child. There are practical questions, emotional questions, and no deadline that belongs to everyone.',
    'CARE',
    [
      'Take a first practical step',
      'You begin exploring a route toward parenthood.',
      { flag: 'parent-path', force: 'connection', amount: 7 },
    ],
    [
      'Care for young people in your community',
      'You find a meaningful place in a larger circle.',
    ],
    [
      'Choose a life without children',
      'You make room for the commitments that are yours.',
    ],
  ),
  event(
    3,
    'return-friend',
    'An old name on your phone',
    'A message arrives from someone who knew you before much of this life existed. “I was thinking about you.” You read it twice.',
    'FRIENDSHIP',
    [
      'Arrange to meet',
      'You recognize each other, and notice the differences.',
    ],
    ['Write a proper reply', 'The conversation stretches across the distance.'],
    [
      'Send a small kindness back',
      'You do not reopen everything to honor what it was.',
    ],
  ),
  event(
    3,
    'body-message',
    'A different pace',
    'Your usual schedule has begun leaving you drained. Your body is asking for attention, and the calendar has not made room for it yet.',
    'VITALITY',
    [
      'Make time for support and rest',
      'You begin adjusting your routine with help.',
      { force: 'vitality', amount: 8 },
    ],
    [
      'Ask someone to share the load',
      'You find a task that does not have to be yours alone.',
    ],
    [
      'Protect one quiet part of each day',
      'A small boundary makes the days more manageable.',
      { force: 'vitality', amount: 5 },
    ],
  ),
  event(
    3,
    'promise',
    'A promise with room to grow',
    'You and your partner have begun talking about a lasting commitment. You want the occasion to feel like your lives, rather than someone else’s expectations.',
    'LOVE',
    [
      'Choose a small ceremony',
      'You make a promise in a room full of familiar faces.',
      {
        flag: 'married',
        force: 'connection',
        amount: 8,
        keepsake: 'A wedding keepsake',
      },
    ],
    [
      'Make your own private ritual',
      'You choose words that fit the two of you.',
      { flag: 'married', force: 'connection', amount: 7 },
    ],
    [
      'Keep talking before deciding',
      'You give a large decision the space it deserves.',
    ],
    'partner',
  ),
  event(
    4,
    'hours',
    'The calendar fills itself',
    'Work, errands, people, plans. Somehow there is no blank space unless you put it there. An unexpected free Saturday makes the problem visible.',
    'TIME',
    [
      'Protect a day for yourself',
      'You remember what your thoughts sound like without a schedule.',
      { force: 'freedom', amount: 7 },
    ],
    [
      'Spend it with someone you miss',
      'An ordinary afternoon becomes the important thing.',
    ],
    [
      'Do something with no useful outcome',
      'Enjoyment gets a place on the calendar.',
      { force: 'vitality', amount: 6 },
    ],
  ),
  event(
    4,
    'mentor',
    'Someone at the beginning',
    'A younger person asks how you learned what you do. You almost answer with your job title, then think of the much less tidy truth.',
    'CONTRIBUTION',
    [
      'Offer to mentor them',
      'Your mistakes become useful in a different way.',
      { force: 'meaning', amount: 7, keepsake: 'A thank-you note' },
    ],
    [
      'Introduce them to your community',
      'You open a door without deciding their path.',
    ],
    [
      'Share the honest version',
      'They seem relieved that your story includes uncertainty.',
    ],
  ),
  event(
    4,
    'distance-care',
    'A call that changes the week',
    'Someone close needs more support for a while. There is no single grand gesture to make. There are appointments, meals, and conversations.',
    'OBLIGATIONS',
    [
      'Take on a regular part',
      'Reliability becomes a form of affection.',
      { force: 'connection', amount: 7, flag: 'caregiver' },
    ],
    [
      'Organize a circle of help',
      'The responsibility becomes more possible when shared.',
    ],
    ['Offer what you can sustain', 'You make a smaller promise and keep it.'],
  ),
  event(
    4,
    'other-skill',
    'A beginner again',
    'A course catches your eye. It has almost nothing to do with what you already know. That is part of its appeal.',
    'DISCOVERY',
    [
      'Sign up',
      'Being clumsy at something feels strangely freeing.',
      { force: 'meaning', amount: 7, flag: 'artist' },
    ],
    ['Learn alongside a friend', 'You laugh more than you expected to.'],
    [
      'Try a small version at home',
      'Curiosity does not require an official beginning.',
    ],
  ),
  event(
    4,
    'long-trip',
    'The map on the wall',
    'A trip you once discussed as “someday” comes up again. The logistics are real. So is the possibility of letting another decade pass.',
    'ADVENTURE',
    [
      'Plan a version you can manage',
      'You turn someday into a date.',
      {
        role: 'traveler',
        force: 'freedom',
        amount: 7,
        keepsake: 'A folded map',
      },
    ],
    [
      'Invite someone to plan with you',
      'The anticipation becomes something shared.',
    ],
    ['Explore closer to home', 'You find unfamiliar things within reach.'],
  ),
  event(
    4,
    'neighborhood',
    'The place around your home',
    'A neighborhood project needs help: a garden, a repair day, a space for people to meet. You pass the notice more than once.',
    'COMMUNITY',
    [
      'Offer your hands',
      'The place begins to hold a little of your work.',
      { force: 'meaning', amount: 7, role: 'maker' },
    ],
    [
      'Bring a few people together',
      'You discover how many people were waiting to be invited.',
    ],
    [
      'Contribute in a small way',
      'A small contribution is still part of what makes it happen.',
    ],
  ),
  event(
    4,
    'relationship-space',
    'The space between you',
    'You and your partner have changed. Some changes brought you closer; others have gone unspoken. You both notice that the next conversation matters.',
    'RELATIONSHIPS',
    [
      'Make room for an honest conversation',
      'You begin learning the people you have become.',
    ],
    [
      'Seek support together',
      'You choose help with a conversation that has been difficult.',
    ],
    [
      'Discuss whether separate paths fit better',
      'You agree to consider separation thoughtfully.',
      { flag: 'separated', force: 'freedom', amount: 5 },
    ],
    'partner',
  ),
  event(
    5,
    'old-ambition',
    'The thing you almost did',
    'You find a note about something you wanted years ago. It is both familiar and slightly embarrassing. Beneath that, the desire is still alive.',
    'REINVENTION',
    [
      'Give it a small beginning',
      'You stop requiring the beginning to be impressive.',
      { force: 'meaning', amount: 8, flag: 'artist' },
    ],
    ['Tell someone about it', 'Saying it aloud makes it less easy to dismiss.'],
    [
      'Let the old ambition go kindly',
      'You make space for wanting something different.',
    ],
  ),
  event(
    5,
    'enough',
    'The meaning of enough',
    'An opportunity would bring more income and more pressure. For the first time, you ask what the extra money would actually make possible.',
    'RESOURCES',
    [
      'Choose the opportunity deliberately',
      'You give the extra effort a purpose.',
      { role: 'office', cash: 900, force: 'meaning', amount: 4 },
    ],
    [
      'Negotiate for time instead',
      'You discover that enough can include an open afternoon.',
      { force: 'freedom', amount: 7 },
    ],
    ['Keep what is working', 'You allow contentment to count as a decision.'],
  ),
  event(
    5,
    'family-stories',
    'Before the stories disappear',
    'Someone older begins telling a story you have never heard. You realize how much of their life happened before they became a role in yours.',
    'MEMORY',
    [
      'Record their stories, with permission',
      'Their voice becomes a keepsake.',
      { keepsake: 'Recorded family stories', force: 'meaning', amount: 7 },
    ],
    [
      'Ask them to tell you more',
      'An ordinary conversation changes how you see them.',
    ],
    [
      'Share a story of your own',
      'You become people to each other in a new way.',
    ],
  ),
  event(
    5,
    'making-room',
    'A shelf of former selves',
    'You are sorting possessions from earlier chapters. Some objects hold affection. Others hold obligations you no longer recognize.',
    'CHANGE',
    [
      'Keep the things that still speak',
      'You choose a smaller collection of meaningful things.',
    ],
    ['Pass something on', 'An object starts a second life with someone else.'],
    [
      'Leave the decision for another day',
      'Not everything has to become clear at once.',
    ],
  ),
  event(
    5,
    'new-ritual',
    'A rhythm worth keeping',
    'You notice the days that feel good often contain the same small thing: a walk, a conversation, a few minutes making something.',
    'WELLBEING',
    [
      'Make it a regular practice',
      'You give a good day a repeatable beginning.',
      { force: 'vitality', amount: 7 },
    ],
    ['Invite someone into the ritual', 'The habit gains a familiar face.'],
    ['Keep it spontaneous', 'You protect the part that feels unforced.'],
  ),
  event(
    5,
    'home-again',
    'A place you used to know',
    'You return to somewhere from an earlier life. The shop has changed. A familiar corner has not. You cannot quite tell whether you miss the place or who you were.',
    'ROOTS',
    [
      'Walk the old route',
      'You discover what remains without needing everything to.',
    ],
    ['Find someone you knew there', 'Memory becomes a conversation.'],
    ['Make a new memory here', 'The place gets to belong to the present too.'],
  ),
  event(
    5,
    'exhibition',
    'What became of the first sketch',
    'Someone asks whether you would show your creative work. You think about the first uncertain attempt, long before anyone was watching.',
    'CALLBACK',
    [
      'Share what you have made',
      'The old beginning glows differently in the light of this day.',
      {
        force: 'meaning',
        amount: 9,
        keepsake: 'Your first exhibition invitation',
      },
    ],
    [
      'Show it to a few trusted people',
      'A small audience gives the work room to breathe.',
    ],
    ['Keep making for yourself', 'You remember why you began.'],
    'artist',
  ),
  event(
    6,
    'expertise',
    'What your experience is for',
    'You know things now that cannot be found in a manual. Someone asks if you would help others learn them.',
    'LEGACY',
    [
      'Teach a small group',
      'Your experience becomes a bridge for someone else.',
      { role: 'maker', force: 'meaning', amount: 8 },
    ],
    ['Work with one person closely', 'The lesson becomes a relationship.'],
    [
      'Write down what you know',
      'You begin leaving useful traces.',
      { keepsake: 'A notebook of lessons', force: 'meaning', amount: 6 },
    ],
  ),
  event(
    6,
    'friend-ritual',
    'An invitation to keep showing up',
    'A friend proposes meeting at the same time every month. No special occasion. You think of how often connection loses out to logistics.',
    'FRIENDSHIP',
    [
      'Put it on the calendar',
      'The ordinary meetings become part of the year.',
    ],
    [
      'Suggest a shared activity',
      'The friendship gains something new to talk about.',
    ],
    [
      'Keep the invitations flexible',
      'You find a rhythm that fits both lives.',
    ],
  ),
  event(
    6,
    'change-work',
    'A different working life',
    'You could keep going as you are, reduce your commitments, or begin something smaller of your own. Each option gives and asks something different.',
    'WORK',
    [
      'Build a smaller independent practice',
      'You keep the work you care about and reshape the rest.',
      { role: 'maker', force: 'meaning', amount: 7 },
    ],
    [
      'Step back from some commitments',
      'Your calendar begins to look more like your priorities.',
      { force: 'freedom', amount: 8 },
    ],
    [
      'Continue with clearer boundaries',
      'You stay, but not on exactly the same terms.',
    ],
  ),
  event(
    6,
    'body-care',
    'Working with your body',
    'Something that used to be easy takes more planning now. There are ways to adapt, and people who can help you explore them.',
    'ADAPTATION',
    [
      'Find a way to adapt the activity',
      'You keep the pleasure while changing the method.',
      { force: 'vitality', amount: 6 },
    ],
    ['Ask someone to join you', 'Support becomes company, too.'],
    [
      'Discover a different pleasure',
      'You let curiosity help choose what comes next.',
    ],
  ),
  event(
    6,
    'unexpected-free',
    'A week without a role',
    'For a week, fewer people need something from you. The freedom is welcome, and a little unfamiliar. What would you like to do with it?',
    'FREEDOM',
    [
      'Travel somewhere slowly',
      'You notice the place between the destinations.',
      { role: 'traveler', force: 'freedom', amount: 8 },
    ],
    ['Reconnect with someone', 'You make a visit that kept getting postponed.'],
    [
      'Stay home without an agenda',
      'You let the week be spacious.',
      { force: 'vitality', amount: 7 },
    ],
  ),
  event(
    6,
    'garden',
    'Something that grows slowly',
    'You are offered a small patch in a shared garden. Nothing you plant will be ready tomorrow. That feels like a reason to say yes.',
    'PATIENCE',
    [
      'Plant something',
      'You begin a conversation with the seasons.',
      { keepsake: 'A packet of saved seeds', force: 'meaning', amount: 6 },
    ],
    [
      'Help someone with their patch',
      'You learn by working beside another person.',
    ],
    [
      'Enjoy the garden as a visitor',
      'There is more than one way to belong to a place.',
    ],
  ),
  event(
    7,
    'retirement',
    'Who owns your mornings?',
    'The shape of work can change now. You could retire from your current role, keep working, or carry just a small part of it forward.',
    'TIME',
    [
      'Retire and explore a new rhythm',
      'Your mornings become a question you get to answer.',
      { role: 'retired', force: 'freedom', amount: 8 },
    ],
    ['Keep doing work you value', 'You continue with a clearer sense of why.'],
    [
      'Carry one project forward',
      'You choose a smaller thread of the working life.',
    ],
  ),
  event(
    7,
    'local-table',
    'A table for everyone',
    'A local group is looking for someone to host a regular gathering. You do not need expertise. You need a little patience and a way to make people welcome.',
    'COMMUNITY',
    ['Help host the gathering', 'People begin greeting each other by name.'],
    [
      'Become a regular guest',
      'Your presence becomes part of what people count on.',
    ],
    [
      'Contribute behind the scenes',
      'The welcome has your care in it, even when you are quiet.',
    ],
  ),
  event(
    7,
    'learning-late',
    'A language you don’t speak yet',
    'There is a class for beginners. You are older than some of them and younger than others. Everyone is equally unfamiliar with the first lesson.',
    'CURIOSITY',
    [
      'Join the class',
      'Your age becomes the least interesting thing about the afternoon.',
    ],
    [
      'Learn with someone you know',
      'You make mistakes together, and keep going.',
    ],
    [
      'Try a little on your own',
      'A new word makes the world fractionally larger.',
    ],
  ),
  event(
    7,
    'old-travel',
    'A journey at your pace',
    'A place you have wanted to visit is still there. You begin looking at what a comfortable, manageable journey could be.',
    'ADVENTURE',
    [
      'Plan the journey with support',
      'You make the adventure fit the life you have.',
      {
        role: 'traveler',
        keepsake: 'A postcard sent home',
        force: 'freedom',
        amount: 7,
      },
    ],
    [
      'Travel with familiar company',
      'The shared moments become part of the destination.',
    ],
    [
      'Find a little discovery nearby',
      'A new route changes a familiar afternoon.',
    ],
  ),
  event(
    7,
    'passing-on',
    'Who gets the good bowl?',
    'Someone admires an object you have kept for years. You remember where it came from, and begin wondering which things you want to pass along while you can tell their stories.',
    'KEEPSAKES',
    ['Give it with its story', 'The object carries more than its usefulness.'],
    [
      'Tell the story and keep it for now',
      'Sharing the memory is its own kind of gift.',
    ],
    [
      'Write its history down',
      'You leave a little context for a future pair of hands.',
    ],
  ),
  event(
    7,
    'ordinary-joy',
    'A very ordinary good day',
    'Nothing remarkable is scheduled. There is a little sunlight, something warm to drink, and enough time to notice both.',
    'DELIGHT',
    [
      'Make something just for fun',
      'Pleasure turns out to need no further explanation.',
    ],
    [
      'Call someone and share the moment',
      'The good day becomes part of two lives.',
    ],
    [
      'Let it be enough',
      'You do not improve the afternoon. You enjoy it.',
      { force: 'vitality', amount: 7 },
    ],
  ),
  event(
    8,
    'memory-box',
    'The box of small things',
    'You open a collection of objects kept almost by accident. Tickets, notes, photographs. Together they tell a version of your life no official record could.',
    'MEMORY',
    [
      'Arrange a small exhibition',
      'You see a pattern you could not see while living it.',
      { force: 'meaning', amount: 8 },
    ],
    [
      'Invite someone to look with you',
      'They ask about a detail you had almost forgotten.',
    ],
    [
      'Choose one thing to keep nearby',
      'A small object gives a large memory somewhere to rest.',
    ],
  ),
  event(
    8,
    'help',
    'The grace of receiving',
    'Someone offers help with something that has become difficult. You are used to being capable. You are learning that capability can include knowing when to accept.',
    'INTERDEPENDENCE',
    ['Accept the offer', 'The help leaves a little more room for living.'],
    [
      'Work out an exchange that suits you both',
      'Care travels in more than one direction.',
    ],
    [
      'Ask for a different kind of support',
      'You keep a voice in how the help happens.',
    ],
  ),
  event(
    8,
    'unfinished',
    'Still a little unfinished',
    'There is something you would still like to make, say, or understand. It does not need to become a grand final project. It could simply begin today.',
    'PURPOSE',
    [
      'Begin a small version',
      'The unfinished thing moves a little closer to the world.',
    ],
    ['Ask someone to join you', 'A project becomes time spent together.'],
    [
      'Leave a note for someone else',
      'You pass on the spark without prescribing the outcome.',
    ],
  ),
  event(
    8,
    'late-friend',
    'A new story across the table',
    'Someone you have only recently met asks about your life. They have no familiar version of you to protect. You can begin the story almost anywhere.',
    'CONNECTION',
    [
      'Tell them something unexpected',
      'You enjoy surprising someone with your own life.',
    ],
    [
      'Ask about theirs first',
      'You find another story with more chapters than its appearance suggests.',
    ],
    [
      'Talk about something happening now',
      'You meet in the present, which is still unfolding.',
    ],
  ),
  event(
    8,
    'window',
    'What the window holds',
    'The view changes a little every day. Today you notice someone taking the same walk, a bird returning, a new leaf. Attention has become a kind of travel.',
    'WONDER',
    [
      'Write down what you notice',
      'An ordinary day gets a place in the record.',
    ],
    [
      'Share the view with someone',
      'You both see a little more by looking together.',
    ],
    [
      'Simply stay with it',
      'For a moment, nothing needs to happen next.',
      { force: 'vitality', amount: 6 },
    ],
  ),
  event(
    8,
    'letter',
    'A letter across time',
    'If you could leave a few words for the person you were at thirteen, what would you want those words to carry?',
    'REFLECTION',
    [
      'Permission to be uncertain',
      'You write: “You do not have to know the whole way.”',
    ],
    [
      'A reminder to reach for people',
      'You write: “Let others be part of the story.”',
    ],
    [
      'Room to choose differently',
      'You write: “You can begin again more than once.”',
    ],
  ),
];
