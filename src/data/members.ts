// Anonymous cards for the "About our members" rolodex, adapted from Fall 2026
// Rolodex Night slides. Keep them anonymous: no names, photos, or details
// specific enough to identify someone (such as the name of a company they founded).

export const MEMBER_COUNT = 120; // paying members

export interface MemberCard {
  tag: 'EC' | 'RC' | 'Partner';
  /** Index into PILLARS (clock order): 0 Robotics, 1 Quantum, 2 Biotech, 3 Climate Tech, 4 Manufacturing, 5 Materials Science. */
  pillar: number;
  /** One sentence. */
  background: string;
  funFact: string;
}

export const MEMBERS: MemberCard[] = [
  { tag: 'EC', pillar: 4, background: 'Hardware PM on Apple Watch, then McKinsey Advanced Industries.', funFact: 'Led a manufacturing change that cut 100 tonnes of carbon emissions a year.' },
  { tag: 'EC', pillar: 4, background: 'Building AI agents that add manufacturing capacity, after Amazon Robotics.', funFact: 'Sold $200k worth of kitchen knives to pay for college.' },
  { tag: 'EC', pillar: 0, background: 'Process engineer at 3M, then corporate development at a drone company.', funFact: 'Ran the 2025 Boston Marathon.' },
  { tag: 'EC', pillar: 0, background: 'Automation engineer at SpaceX, then software at Scale AI and autonomy at Nuro.', funFact: 'Commutes by electric unicycle, skateboard, or scooter.' },
  { tag: 'EC', pillar: 4, background: 'Manufacturing engineer at Tesla, Rivian, and P&G.', funFact: 'Learning to solve a Rubik’s cube blindfolded.' },
  { tag: 'EC', pillar: 4, background: 'Battery manufacturing engineer at Tesla, then a founding engineer.', funFact: 'Holds a Guinness World Record.' },
  { tag: 'RC', pillar: 4, background: 'Y Combinator founder building AI for supply chains.', funFact: 'Birdwatches.' },
  { tag: 'RC', pillar: 5, background: 'Project leader at BCG, with a stint inside a mining company.', funFact: 'Has been inside more than seven mines across the US.' },
  { tag: 'RC', pillar: 5, background: 'Chip designer at AMD and STMicroelectronics, then product manager at Infineon.', funFact: 'Black belt in karate.' },
  { tag: 'RC', pillar: 0, background: 'iPhone hardware electrical engineer at Apple.', funFact: 'Trains Muay Thai.' },
  { tag: 'Partner', pillar: 0, background: 'Stanford EE PhD who builds LiDAR and radar systems.', funFact: 'Has been to 25 national parks.' },
  { tag: 'RC', pillar: 0, background: 'Co-founded a venture-backed AI infrastructure company and helped run it for 11 years.', funFact: 'Watches League of Legends every night before bed.' },
  { tag: 'RC', pillar: 0, background: 'Spacecraft autonomy engineer at Northrop Grumman and Lockheed Martin.', funFact: 'Learned beach volleyball in Michigan.' },
  { tag: 'RC', pillar: 0, background: 'Deep tech investor who backed a waste-sorting robotics company, after practicing law.', funFact: 'Once tried going pro at poker.' },
  { tag: 'RC', pillar: 0, background: 'Aerospace engineer on guidance, controls, and directed-energy programs.', funFact: 'Their name has been to space. They have not, yet.' },
  { tag: 'RC', pillar: 5, background: 'Silicon architect at Intel with five patents filed.', funFact: 'Grew bell peppers, strawberries, and tomatoes last summer.' },
  { tag: 'RC', pillar: 3, background: 'Seven years as a Navy officer, the last five in the nuclear reactor program.', funFact: 'Names their spouse’s houseplants.' },
  { tag: 'RC', pillar: 2, background: 'Built an AI document platform at Goldman Sachs after computer-vision research in healthcare.', funFact: 'Once ate four Subway sandwiches in one sitting.' },
  { tag: 'EC', pillar: 0, background: 'Lead mechanical engineer at an electric-motorcycle startup.', funFact: 'Proud plant parent.' },
  { tag: 'RC', pillar: 5, background: 'Scaled green steel and industrial separations from lab to pilot plant.', funFact: 'Has lived in Boston for 87% of their life.' },
  { tag: 'EC', pillar: 3, background: 'Product at a Latin American auto marketplace, then entrepreneur-in-residence at an energy major.', funFact: 'Hiked a 17,800 ft mountain with family.' },
  { tag: 'RC', pillar: 1, background: 'Army officer and Microsoft technical PM who interned at a quantum computing company.', funFact: 'Has jumped out of perfectly good airplanes, more than once.' },
  { tag: 'Partner', pillar: 0, background: 'Chip architecture modeling at Amazon, after building teleoperation for autonomous vehicles.', funFact: 'Recording an album with their band.' },
  { tag: 'RC', pillar: 4, background: 'Built the first automated R&D lab at a global consumer goods company.', funFact: 'Photographer, filmmaker, and writer on the side.' },
  { tag: 'RC', pillar: 2, background: 'Gene-editing scientist turned biotech founder.', funFact: 'Goes mushroom foraging.' },
  { tag: 'RC', pillar: 0, background: 'Automation systems engineer working on hardware and robotics for defense.', funFact: 'Had their first cheeseburger at 23.' },
  { tag: 'EC', pillar: 0, background: 'Hardware engineer at Meta, Waymo, and Apple’s Special Projects Group.', funFact: 'Used to produce music.' },
  { tag: 'RC', pillar: 2, background: 'Drug-manufacturing automation and robotic-surgery R&D, then machine learning research at a children’s hospital.', funFact: 'Their mom is convinced they were a bird in a past life.' },
  { tag: 'EC', pillar: 4, background: '3D-printed concrete houses at ICON and power-tool R&D at Milwaukee Tool.', funFact: 'Does aerial silks and figure skating.' },
  { tag: 'RC', pillar: 2, background: 'Chief of Staff at a startup turning greenhouse gases into protein.', funFact: 'Has lived in five different states across India.' },
  { tag: 'Partner', pillar: 0, background: 'Full-stack engineer at Salesforce and a hobbyist hardware maker.', funFact: 'Learned CAD, KiCad, and soldering to build their own espresso machine.' },
  { tag: 'RC', pillar: 0, background: 'Growth equity investor now building an AI assistant for families.', funFact: 'Used the same leg press as Andrew Garfield, right after him.' },
  { tag: 'RC', pillar: 0, background: 'Navy bomb-disposal officer, then technical staff at a physical AI startup.', funFact: 'Mined altcoins on school computers in high school.' },
  { tag: 'RC', pillar: 0, background: 'Senior software engineer on Microsoft’s datacenter compute metering.', funFact: 'Has lived in six countries.' },
  { tag: 'RC', pillar: 0, background: 'Green Beret and drone operator, then Navy intelligence.', funFact: 'Studied economics and opera.' },
  { tag: 'RC', pillar: 0, background: 'Founder of an AI cloud-cost platform, after building billing infrastructure at AWS.', funFact: 'Flew a Cessna at 16, before they could drive.' },
  { tag: 'RC', pillar: 3, background: 'Mercedes F1 engineer, then developer of solar and battery storage projects.', funFact: 'Went from the top of Mauna Kea to a −100 ft night dive in twelve hours.' },
  { tag: 'RC', pillar: 0, background: 'Propulsion controls engineer at Rivian.', funFact: 'Captained their college Formula SAE team.' },
  { tag: 'RC', pillar: 0, background: 'Navy pilot flying the P-8, then flight-test operations.', funFact: 'Has a 245-day Chess.com streak and is still really bad.' },
  { tag: 'EC', pillar: 2, background: 'Machine learning engineer at Meta on smart glasses and multimodal models.', funFact: 'Classical guitarist turned microbiologist turned computer scientist.' },
  { tag: 'RC', pillar: 0, background: 'Product marketing at Scale AI and C3.ai.', funFact: 'Chronically online on Reels and X.' },
  { tag: 'RC', pillar: 4, background: 'Deployed AI agents into Fortune 500 companies at Celonis.', funFact: 'Got banned from Caesars Palace.' },
];
