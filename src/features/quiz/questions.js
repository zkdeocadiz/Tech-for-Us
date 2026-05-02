export const questions = [
  // Mental Health
  { id: 'mh1', text: "The constant stream of new information online is more stimulating than overwhelming", category: 'mentalHealth', direction: 'E' },
  { id: 'mh2', text: "Social media algorithms showing you content you enjoy is mostly a good thing", category: 'mentalHealth', direction: 'E' },
  { id: 'mh3', text: "Staying informed through social media is genuinely good for my wellbeing", category: 'mentalHealth', direction: 'E' },
  { id: 'mh4', text: "I feel more energized than drained when I think about using social media", category: 'mentalHealth', direction: 'E' },
  { id: 'mh5', text: "Always being reachable is more of a burden than a benefit", category: 'mentalHealth', direction: 'W' },
  { id: 'mh6', text: "The content I see online often leaves me feeling anxious or unsettled", category: 'mentalHealth', direction: 'W' },
  { id: 'mh7', text: "Social media is deliberately designed to be addictive in ways that aren't good for me", category: 'mentalHealth', direction: 'W' },
  { id: 'mh8', text: "I would generally be happier if I used social media less", category: 'mentalHealth', direction: 'W' },

  // Social Status
  { id: 'ss1', text: "Social media is a genuine tool for getting ahead in life", category: 'socialStatus', direction: 'D' },
  { id: 'ss2', text: "Not being on social media would put me at a real disadvantage socially or professionally", category: 'socialStatus', direction: 'D' },
  { id: 'ss3', text: "Social media can be a genuine equalizer, giving anyone the chance to build influence regardless of their background", category: 'socialStatus', direction: 'D' },
  { id: 'ss4', text: "Social media has created real opportunities for people who wouldn't have had them otherwise", category: 'socialStatus', direction: 'D' },
  { id: 'ss5', text: "I feel like I have to be on social media whether I want to be or not", category: 'socialStatus', direction: 'M' },
  { id: 'ss6', text: "I shouldn't have to be on social media to be taken seriously professionally or socially", category: 'socialStatus', direction: 'M' },
  { id: 'ss7', text: "Social media platforms have too much power over whether I can participate in society", category: 'socialStatus', direction: 'M' },
  { id: 'ss8', text: "Being without social media feels like being excluded from conversations that matter", category: 'socialStatus', direction: 'M' },

  // Identity
  { id: 'id1', text: "Social media gives me the freedom to express sides of myself I can't show in person", category: 'identity', direction: 'G' },
  { id: 'id2', text: "I think there are opportunities to be authentic online", category: 'identity', direction: 'G' },
  { id: 'id3', text: "I am able to find communities online where I can be truly myself", category: 'identity', direction: 'G' },
  { id: 'id4', text: "I can use social media to develop my understanding of my own identity better", category: 'identity', direction: 'G' },
  { id: 'id5', text: "Digital spaces are safer places for me to test out new ways of presenting myself in public", category: 'identity', direction: 'G' },
  { id: 'id6', text: "I worry about how things posted online today could affect me in the future", category: 'identity', direction: 'Ft' },
  { id: 'id7', text: "The fear of being judged online makes me less likely to express my true opinions", category: 'identity', direction: 'Ft' },
  { id: 'id8', text: "I am concerned about people's privacy when they are more open about their identity online", category: 'identity', direction: 'Ft' },
  { id: 'id9', text: "I present an unrealistic version of myself online", category: 'identity', direction: 'Fp' },
  { id: 'id10', text: "I compare my life to others on social media", category: 'identity', direction: 'Fp' },

  // Connection
  { id: 'cn1', text: "Online relationships can be just as meaningful as in-person ones", category: 'connection', direction: 'C' },
  { id: 'cn2', text: "Social media gives me access to community and support I wouldn't otherwise have", category: 'connection', direction: 'C' },
  { id: 'cn3', text: "Social media has made it easier to stay close to people who don't live nearby", category: 'connection', direction: 'C' },
  { id: 'cn4', text: "Social media has been an important outlet for me when I feel misunderstood or marginalized in my offline life", category: 'connection', direction: 'C' },
  { id: 'cn5', text: "Despite connecting people digitally, social media makes me lonelier overall", category: 'connection', direction: 'L' },
  { id: 'cn6', text: "Seeing other people's social lives online makes me more aware of what I'm missing", category: 'connection', direction: 'L' },
  { id: 'cn7', text: "Social media replaces real connection with something that only looks like it", category: 'connection', direction: 'L' },
  { id: 'cn8', text: "Online interactions often feel shallow compared to in-person ones", category: 'connection', direction: 'L' },
];

export const QUESTION_COUNTS = {
  mentalHealth: { E: 4, W: 4 },
  socialStatus: { D: 4, M: 4 },
  identity: { G: 5, Ft: 3, Fp: 2 },
  connection: { C: 4, L: 4 },
};