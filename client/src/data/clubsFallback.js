// Used only if the /api/clubs backend is unreachable, so the Clubs section
// and Club Details page still render offline/in local dev.
const daysFromNow = (n) => new Date(Date.now() + n * 86400000).toISOString()

export const clubsFallback = [
  {
    _id: 'mock-trendles', name: 'Trendles', slug: 'trendles', category: 'Fashion & Lifestyle',
    logoIcon: 'Shirt', logoColor: 'from-pink-500 to-rose-500',
    description: 'The campus fashion and lifestyle collective celebrating self-expression.',
    about: 'Trendles brings together students passionate about fashion, styling, and lifestyle content creation, organizing shoots, shows, and workshops throughout the year.',
    vision: 'To make campus a space where creativity and personal style are celebrated.',
    activities: ['Annual Fashion Show', 'Styling Workshops', 'Photo Shoots', 'Thrift Exchanges'],
    gallery: [{ caption: 'Annual Show 2025' }, { caption: 'Styling Workshop' }, { caption: 'Thrift Exchange' }],
    membersCount: 145, upcomingEvent: { title: 'Runway Nights', date: daysFromNow(12) },
    facultyCoordinator: { name: 'Ms. Kavya Iyer', designation: 'Assistant Professor, Design', email: 'kavya.iyer@campus.edu' },
    coreTeam: [{ name: 'Aisha Khan', role: 'President', year: '3rd Year' }, { name: 'Rohan Mehta', role: 'Vice President', year: '2nd Year' }],
    achievements: ['Best Cultural Club 2025', 'Featured in Campus Style Awards'], recruitmentOpen: true
  },
  {
    _id: 'mock-wildbeats', name: 'Wildbeats', slug: 'wildbeats', category: 'Dance',
    logoIcon: 'Music4', logoColor: 'from-fuchsia-500 to-purple-600',
    description: 'The official dance crew bringing every genre to the campus stage.',
    about: 'Wildbeats is a high-energy dance troupe covering hip-hop, contemporary, and classical fusion, representing the campus at inter-college competitions.',
    vision: 'To build a fearless community of dancers who push creative boundaries together.',
    activities: ['Weekly Practice Sessions', 'Inter-College Battles', 'Flash Mobs', 'Annual Showcase'],
    gallery: [{ caption: 'Inter-College Battle' }, { caption: 'Annual Showcase' }, { caption: 'Flash Mob' }],
    membersCount: 98, upcomingEvent: { title: 'Beat Battle Finals', date: daysFromNow(8) },
    facultyCoordinator: { name: 'Mr. Arvind Nambiar', designation: 'Associate Professor, Physical Education', email: 'arvind.nambiar@campus.edu' },
    coreTeam: [{ name: 'Ishaan Rao', role: 'Captain', year: '4th Year' }, { name: 'Meera Suresh', role: 'Choreographer', year: '3rd Year' }],
    achievements: ['1st Place, National Dance League 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-beta-labs', name: 'Beta Labs', slug: 'beta-labs', category: 'Technology',
    logoIcon: 'FlaskConical', logoColor: 'from-cyan-500 to-blue-600',
    description: 'A hands-on builders club for hackathons, product sprints, and open source.',
    about: 'Beta Labs is where students prototype real products, contribute to open source, and prepare for hackathons with mentorship from seniors and alumni.',
    vision: 'To turn campus ideas into shipped products.',
    activities: ['Weekend Build Sprints', 'Open Source Fridays', 'Hackathon Bootcamps', 'Demo Days'],
    gallery: [{ caption: 'Build Sprint' }, { caption: 'Demo Day' }, { caption: 'Hackathon Bootcamp' }],
    membersCount: 210, upcomingEvent: { title: 'Build Sprint #12', date: daysFromNow(5) },
    facultyCoordinator: { name: 'Dr. Neha Kapoor', designation: 'Associate Professor, CSE', email: 'neha.kapoor@campus.edu' },
    coreTeam: [{ name: 'Karan Malhotra', role: 'Lead', year: '4th Year' }, { name: 'Divya Pillai', role: 'Product Lead', year: '3rd Year' }],
    achievements: ['Winner, National Hackathon 2025', '3 alumni startups incubated'], recruitmentOpen: true
  },
  {
    _id: 'mock-ieee', name: 'IEEE', slug: 'ieee', category: 'Technical Society',
    logoIcon: 'CircuitBoard', logoColor: 'from-blue-600 to-indigo-700',
    description: 'Student chapter of IEEE advancing technology for humanity.',
    about: 'The IEEE Student Chapter hosts technical talks, paper presentation contests, and certification workshops in collaboration with the global IEEE community.',
    vision: 'To foster technical excellence and professional growth among engineering students.',
    activities: ['Technical Talks', 'Paper Presentations', 'Certification Workshops', 'IEEEXtreme Programming'],
    gallery: [{ caption: 'Technical Talk Series' }, { caption: 'IEEEXtreme 24hr Coding' }, { caption: 'Workshop' }],
    membersCount: 320, upcomingEvent: { title: 'IEEEXtreme 24-Hour Challenge', date: daysFromNow(18) },
    facultyCoordinator: { name: 'Dr. Suresh Pillai', designation: 'Professor, ECE', email: 'suresh.pillai@campus.edu' },
    coreTeam: [{ name: 'Aditya Ramesh', role: 'Chair', year: '4th Year' }, { name: 'Fatima Sheikh', role: 'Vice Chair', year: '3rd Year' }],
    achievements: ['Top 10 Global Rank, IEEEXtreme 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-gdsc', name: 'GDSC', slug: 'gdsc', category: 'Technical Society',
    logoIcon: 'Sparkles', logoColor: 'from-red-500 via-yellow-500 to-green-500',
    description: 'Google Developer Student Clubs — build with Google technologies.',
    about: 'GDSC organizes study jams, solution challenges, and info sessions to help students build real-world apps using Google technologies like Firebase, Flutter, and TensorFlow.',
    vision: 'To create a community of student developers solving local problems with global technologies.',
    activities: ['Study Jams', 'Solution Challenge', 'Info Sessions', 'DevFest'],
    gallery: [{ caption: 'Study Jam' }, { caption: 'DevFest' }, { caption: 'Solution Challenge Finals' }],
    membersCount: 275, upcomingEvent: { title: 'Solution Challenge Kickoff', date: daysFromNow(10) },
    facultyCoordinator: { name: 'Dr. Anjali Bose', designation: 'Assistant Professor, CSE', email: 'anjali.bose@campus.edu' },
    coreTeam: [{ name: 'Yash Agarwal', role: 'Lead', year: '3rd Year' }, { name: 'Sara Thomas', role: 'Technical Lead', year: '3rd Year' }],
    achievements: ['Regional Finalist, Solution Challenge 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-nss', name: 'NSS', slug: 'nss', category: 'Community Service',
    logoIcon: 'HeartHandshake', logoColor: 'from-orange-500 to-red-600',
    description: 'National Service Scheme — "Not Me, But You" in action on and off campus.',
    about: 'NSS volunteers run blood donation camps, rural outreach programs, cleanliness drives, and disaster relief support throughout the academic year.',
    vision: 'To build socially responsible citizens through community service.',
    activities: ['Blood Donation Camps', 'Rural Outreach', 'Cleanliness Drives', 'Disaster Relief Support'],
    gallery: [{ caption: 'Blood Donation Camp' }, { caption: 'Rural Outreach' }, { caption: 'Cleanliness Drive' }],
    membersCount: 410, upcomingEvent: { title: 'Annual Blood Donation Camp', date: daysFromNow(7) },
    facultyCoordinator: { name: 'Dr. Ramesh Pillai', designation: 'Professor & NSS Officer', email: 'ramesh.pillai@campus.edu' },
    coreTeam: [{ name: 'Pooja Reddy', role: 'Volunteer Secretary', year: '3rd Year' }, { name: 'Vivek Nair', role: 'Program Officer Assistant', year: '4th Year' }],
    achievements: ['Best NSS Unit, State Award 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-iedc', name: 'IEDC', slug: 'iedc', category: 'Entrepreneurship',
    logoIcon: 'Rocket', logoColor: 'from-violet-500 to-purple-700',
    description: 'Innovation & Entrepreneurship Development Cell nurturing student startups.',
    about: 'IEDC supports student entrepreneurs with ideation bootcamps, mentorship from industry experts, seed funding guidance, and a dedicated pre-incubation space.',
    vision: 'To turn every campus idea into a viable startup.',
    activities: ['Ideation Bootcamps', 'Founder Mentorship', 'Pitch Days', 'Pre-Incubation Support'],
    gallery: [{ caption: 'Pitch Day' }, { caption: 'Ideation Bootcamp' }, { caption: 'Founder Mentorship Session' }],
    membersCount: 180, upcomingEvent: { title: 'Startup Pitch Night', date: daysFromNow(20) },
    facultyCoordinator: { name: 'Dr. Priya Varghese', designation: 'IEDC Nodal Officer', email: 'priya.varghese@campus.edu' },
    coreTeam: [{ name: 'Nikhil Bhat', role: 'CEO', year: '4th Year' }, { name: 'Riya Kapoor', role: 'COO', year: '3rd Year' }],
    achievements: ['3 Student Startups Funded in 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-photography', name: 'Photography Club', slug: 'photography-club', category: 'Arts & Media',
    logoIcon: 'Camera', logoColor: 'from-slate-600 to-gray-800',
    description: 'Capturing campus life one frame at a time.',
    about: 'The Photography Club runs photo walks, gear workshops, and exhibitions, and handles official photography coverage for major campus events.',
    vision: 'To help every student see and tell stories through a lens.',
    activities: ['Photo Walks', 'Editing Workshops', 'Annual Exhibition', 'Event Coverage'],
    gallery: [{ caption: 'Annual Exhibition' }, { caption: 'Photo Walk' }, { caption: 'Event Coverage' }],
    membersCount: 132, upcomingEvent: { title: 'Golden Hour Photo Walk', date: daysFromNow(6) },
    facultyCoordinator: { name: 'Mr. Thomas George', designation: 'Assistant Professor, Media Studies', email: 'thomas.george@campus.edu' },
    coreTeam: [{ name: 'Anjali Krishnan', role: 'President', year: '3rd Year' }, { name: 'Dev Chauhan', role: 'Editor-in-Chief', year: '2nd Year' }],
    achievements: ['Best Campus Media Club 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-music', name: 'Music Club', slug: 'music-club', category: 'Music',
    logoIcon: 'Music', logoColor: 'from-amber-500 to-orange-600',
    description: 'From acoustic jams to full band nights — campus’s home for music.',
    about: 'The Music Club hosts open mics, band rehearsals, and an annual battle of bands, welcoming vocalists and instrumentalists of every genre and skill level.',
    vision: 'To give every musician on campus a stage.',
    activities: ['Open Mic Nights', 'Band Rehearsals', 'Battle of Bands', 'Jam Sessions'],
    gallery: [{ caption: 'Battle of Bands' }, { caption: 'Open Mic Night' }, { caption: 'Jam Session' }],
    membersCount: 156, upcomingEvent: { title: 'Open Mic Night', date: daysFromNow(4) },
    facultyCoordinator: { name: 'Ms. Lakshmi Menon', designation: 'Assistant Professor, Fine Arts', email: 'lakshmi.menon@campus.edu' },
    coreTeam: [{ name: 'Rehan Ali', role: 'President', year: '4th Year' }, { name: 'Tara Joseph', role: 'Vocal Lead', year: '2nd Year' }],
    achievements: ['Winner, Battle of Bands — Zonal 2025'], recruitmentOpen: true
  },
  {
    _id: 'mock-robotics', name: 'Robotics Club', slug: 'robotics-club', category: 'Technology',
    logoIcon: 'Bot', logoColor: 'from-teal-500 to-emerald-700',
    description: 'Designing, building, and racing robots — from line followers to drones.',
    about: 'The Robotics Club builds competition-grade robots, runs beginner-friendly Arduino/ROS workshops, and represents the campus at national robotics competitions.',
    vision: 'To make robotics and automation accessible to every student.',
    activities: ['Robo Wars', 'Arduino Workshops', 'Drone Building', 'National Competitions'],
    gallery: [{ caption: 'Robo Wars' }, { caption: 'Drone Building' }, { caption: 'Arduino Workshop' }],
    membersCount: 168, upcomingEvent: { title: 'Robo Wars Qualifiers', date: daysFromNow(16) },
    facultyCoordinator: { name: 'Dr. Vinod Kumar', designation: 'Professor, Mechatronics', email: 'vinod.kumar@campus.edu' },
    coreTeam: [{ name: 'Sahil Verma', role: 'Team Lead', year: '4th Year' }, { name: 'Nandini Rao', role: 'Technical Head', year: '3rd Year' }],
    achievements: ['Best Innovation Award, TechFest National'], recruitmentOpen: true
  }
]
