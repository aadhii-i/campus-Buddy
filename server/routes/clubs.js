const express = require('express')
const mongoose = require('mongoose')
const Club = require('../models/Club')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Fallback mock data used when MongoDB is not connected or has no clubs yet,
// mirroring the pattern used in routes/events.js
const MOCK_CLUBS = [
  {
    _id: 'mock-trendles',
    name: 'Trendles',
    slug: 'trendles',
    category: 'Fashion & Lifestyle',
    logoIcon: 'Shirt',
    logoColor: 'from-pink-500 to-rose-500',
    description: 'The campus fashion and lifestyle collective celebrating self-expression.',
    about: 'Trendles brings together students passionate about fashion, styling, and lifestyle content creation, organizing shoots, shows, and workshops throughout the year.',
    vision: 'To make campus a space where creativity and personal style are celebrated.',
    activities: ['Annual Fashion Show', 'Styling Workshops', 'Photo Shoots', 'Thrift Exchanges'],
    gallery: [{ caption: 'Annual Show 2025' }, { caption: 'Styling Workshop' }, { caption: 'Thrift Exchange' }],
    membersCount: 145,
    upcomingEvent: { title: 'Runway Nights', date: new Date(Date.now() + 12 * 86400000) },
    facultyCoordinator: { name: 'Ms. Kavya Iyer', designation: 'Assistant Professor, Design', email: 'kavya.iyer@campus.edu' },
    coreTeam: [{ name: 'Aisha Khan', role: 'President', year: '3rd Year' }, { name: 'Rohan Mehta', role: 'Vice President', year: '2nd Year' }],
    achievements: ['Best Cultural Club 2025', 'Featured in Campus Style Awards'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-wildbeats',
    name: 'Wildbeats',
    slug: 'wildbeats',
    category: 'Dance',
    logoIcon: 'Music4',
    logoColor: 'from-fuchsia-500 to-purple-600',
    description: 'The official dance crew bringing every genre to the campus stage.',
    about: 'Wildbeats is a high-energy dance troupe covering hip-hop, contemporary, and classical fusion, representing the campus at inter-college competitions.',
    vision: 'To build a fearless community of dancers who push creative boundaries together.',
    activities: ['Weekly Practice Sessions', 'Inter-College Battles', 'Flash Mobs', 'Annual Showcase'],
    gallery: [{ caption: 'Inter-College Battle' }, { caption: 'Annual Showcase' }, { caption: 'Flash Mob' }],
    membersCount: 98,
    upcomingEvent: { title: 'Beat Battle Finals', date: new Date(Date.now() + 8 * 86400000) },
    facultyCoordinator: { name: 'Mr. Arvind Nambiar', designation: 'Associate Professor, Physical Education', email: 'arvind.nambiar@campus.edu' },
    coreTeam: [{ name: 'Ishaan Rao', role: 'Captain', year: '4th Year' }, { name: 'Meera Suresh', role: 'Choreographer', year: '3rd Year' }],
    achievements: ['1st Place, National Dance League 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-beta-labs',
    name: 'Beta Labs',
    slug: 'beta-labs',
    category: 'Technology',
    logoIcon: 'FlaskConical',
    logoColor: 'from-cyan-500 to-blue-600',
    description: 'A hands-on builders club for hackathons, product sprints, and open source.',
    about: 'Beta Labs is where students prototype real products, contribute to open source, and prepare for hackathons with mentorship from seniors and alumni.',
    vision: 'To turn campus ideas into shipped products.',
    activities: ['Weekend Build Sprints', 'Open Source Fridays', 'Hackathon Bootcamps', 'Demo Days'],
    gallery: [{ caption: 'Build Sprint' }, { caption: 'Demo Day' }, { caption: 'Hackathon Bootcamp' }],
    membersCount: 210,
    upcomingEvent: { title: 'Build Sprint #12', date: new Date(Date.now() + 5 * 86400000) },
    facultyCoordinator: { name: 'Dr. Neha Kapoor', designation: 'Associate Professor, CSE', email: 'neha.kapoor@campus.edu' },
    coreTeam: [{ name: 'Karan Malhotra', role: 'Lead', year: '4th Year' }, { name: 'Divya Pillai', role: 'Product Lead', year: '3rd Year' }],
    achievements: ['Winner, National Hackathon 2025', '3 alumni startups incubated'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-ieee',
    name: 'IEEE',
    slug: 'ieee',
    category: 'Technical Society',
    logoIcon: 'CircuitBoard',
    logoColor: 'from-blue-600 to-indigo-700',
    description: 'Student chapter of IEEE advancing technology for humanity.',
    about: 'The IEEE Student Chapter hosts technical talks, paper presentation contests, and certification workshops in collaboration with the global IEEE community.',
    vision: 'To foster technical excellence and professional growth among engineering students.',
    activities: ['Technical Talks', 'Paper Presentations', 'Certification Workshops', 'IEEEXtreme Programming'],
    gallery: [{ caption: 'Technical Talk Series' }, { caption: 'IEEEXtreme 24hr Coding' }, { caption: 'Workshop' }],
    membersCount: 320,
    upcomingEvent: { title: 'IEEEXtreme 24-Hour Challenge', date: new Date(Date.now() + 18 * 86400000) },
    facultyCoordinator: { name: 'Dr. Suresh Pillai', designation: 'Professor, ECE', email: 'suresh.pillai@campus.edu' },
    coreTeam: [{ name: 'Aditya Ramesh', role: 'Chair', year: '4th Year' }, { name: 'Fatima Sheikh', role: 'Vice Chair', year: '3rd Year' }],
    achievements: ['Top 10 Global Rank, IEEEXtreme 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-gdsc',
    name: 'GDSC',
    slug: 'gdsc',
    category: 'Technical Society',
    logoIcon: 'Sparkles',
    logoColor: 'from-red-500 via-yellow-500 to-green-500',
    description: 'Google Developer Student Clubs — build with Google technologies.',
    about: 'GDSC organizes study jams, solution challenges, and info sessions to help students build real-world apps using Google technologies like Firebase, Flutter, and TensorFlow.',
    vision: 'To create a community of student developers solving local problems with global technologies.',
    activities: ['Study Jams', 'Solution Challenge', 'Info Sessions', 'DevFest'],
    gallery: [{ caption: 'Study Jam' }, { caption: 'DevFest' }, { caption: 'Solution Challenge Finals' }],
    membersCount: 275,
    upcomingEvent: { title: 'Solution Challenge Kickoff', date: new Date(Date.now() + 10 * 86400000) },
    facultyCoordinator: { name: 'Dr. Anjali Bose', designation: 'Assistant Professor, CSE', email: 'anjali.bose@campus.edu' },
    coreTeam: [{ name: 'Yash Agarwal', role: 'Lead', year: '3rd Year' }, { name: 'Sara Thomas', role: 'Technical Lead', year: '3rd Year' }],
    achievements: ['Regional Finalist, Solution Challenge 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-nss',
    name: 'NSS',
    slug: 'nss',
    category: 'Community Service',
    logoIcon: 'HeartHandshake',
    logoColor: 'from-orange-500 to-red-600',
    description: 'National Service Scheme — "Not Me, But You" in action on and off campus.',
    about: 'NSS volunteers run blood donation camps, rural outreach programs, cleanliness drives, and disaster relief support throughout the academic year.',
    vision: 'To build socially responsible citizens through community service.',
    activities: ['Blood Donation Camps', 'Rural Outreach', 'Cleanliness Drives', 'Disaster Relief Support'],
    gallery: [{ caption: 'Blood Donation Camp' }, { caption: 'Rural Outreach' }, { caption: 'Cleanliness Drive' }],
    membersCount: 410,
    upcomingEvent: { title: 'Annual Blood Donation Camp', date: new Date(Date.now() + 7 * 86400000) },
    facultyCoordinator: { name: 'Dr. Ramesh Pillai', designation: 'Professor & NSS Officer', email: 'ramesh.pillai@campus.edu' },
    coreTeam: [{ name: 'Pooja Reddy', role: 'Volunteer Secretary', year: '3rd Year' }, { name: 'Vivek Nair', role: 'Program Officer Assistant', year: '4th Year' }],
    achievements: ['Best NSS Unit, State Award 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-iedc',
    name: 'IEDC',
    slug: 'iedc',
    category: 'Entrepreneurship',
    logoIcon: 'Rocket',
    logoColor: 'from-violet-500 to-purple-700',
    description: 'Innovation & Entrepreneurship Development Cell nurturing student startups.',
    about: 'IEDC supports student entrepreneurs with ideation bootcamps, mentorship from industry experts, seed funding guidance, and a dedicated pre-incubation space.',
    vision: 'To turn every campus idea into a viable startup.',
    activities: ['Ideation Bootcamps', 'Founder Mentorship', 'Pitch Days', 'Pre-Incubation Support'],
    gallery: [{ caption: 'Pitch Day' }, { caption: 'Ideation Bootcamp' }, { caption: 'Founder Mentorship Session' }],
    membersCount: 180,
    upcomingEvent: { title: 'Startup Pitch Night', date: new Date(Date.now() + 20 * 86400000) },
    facultyCoordinator: { name: 'Dr. Priya Varghese', designation: 'IEDC Nodal Officer', email: 'priya.varghese@campus.edu' },
    coreTeam: [{ name: 'Nikhil Bhat', role: 'CEO', year: '4th Year' }, { name: 'Riya Kapoor', role: 'COO', year: '3rd Year' }],
    achievements: ['3 Student Startups Funded in 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-photography',
    name: 'Photography Club',
    slug: 'photography-club',
    category: 'Arts & Media',
    logoIcon: 'Camera',
    logoColor: 'from-slate-600 to-gray-800',
    description: 'Capturing campus life one frame at a time.',
    about: 'The Photography Club runs photo walks, gear workshops, and exhibitions, and handles official photography coverage for major campus events.',
    vision: 'To help every student see and tell stories through a lens.',
    activities: ['Photo Walks', 'Editing Workshops', 'Annual Exhibition', 'Event Coverage'],
    gallery: [{ caption: 'Annual Exhibition' }, { caption: 'Photo Walk' }, { caption: 'Event Coverage' }],
    membersCount: 132,
    upcomingEvent: { title: 'Golden Hour Photo Walk', date: new Date(Date.now() + 6 * 86400000) },
    facultyCoordinator: { name: 'Mr. Thomas George', designation: 'Assistant Professor, Media Studies', email: 'thomas.george@campus.edu' },
    coreTeam: [{ name: 'Anjali Krishnan', role: 'President', year: '3rd Year' }, { name: 'Dev Chauhan', role: 'Editor-in-Chief', year: '2nd Year' }],
    achievements: ['Best Campus Media Club 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-music',
    name: 'Music Club',
    slug: 'music-club',
    category: 'Music',
    logoIcon: 'Music',
    logoColor: 'from-amber-500 to-orange-600',
    description: 'From acoustic jams to full band nights — campus’s home for music.',
    about: 'The Music Club hosts open mics, band rehearsals, and an annual battle of bands, welcoming vocalists and instrumentalists of every genre and skill level.',
    vision: 'To give every musician on campus a stage.',
    activities: ['Open Mic Nights', 'Band Rehearsals', 'Battle of Bands', 'Jam Sessions'],
    gallery: [{ caption: 'Battle of Bands' }, { caption: 'Open Mic Night' }, { caption: 'Jam Session' }],
    membersCount: 156,
    upcomingEvent: { title: 'Open Mic Night', date: new Date(Date.now() + 4 * 86400000) },
    facultyCoordinator: { name: 'Ms. Lakshmi Menon', designation: 'Assistant Professor, Fine Arts', email: 'lakshmi.menon@campus.edu' },
    coreTeam: [{ name: 'Rehan Ali', role: 'President', year: '4th Year' }, { name: 'Tara Joseph', role: 'Vocal Lead', year: '2nd Year' }],
    achievements: ['Winner, Battle of Bands — Zonal 2025'],
    recruitmentOpen: true
  },
  {
    _id: 'mock-robotics',
    name: 'Robotics Club',
    slug: 'robotics-club',
    category: 'Technology',
    logoIcon: 'Bot',
    logoColor: 'from-teal-500 to-emerald-700',
    description: 'Designing, building, and racing robots — from line followers to drones.',
    about: 'The Robotics Club builds competition-grade robots, runs beginner-friendly Arduino/ROS workshops, and represents the campus at national robotics competitions.',
    vision: 'To make robotics and automation accessible to every student.',
    activities: ['Robo Wars', 'Arduino Workshops', 'Drone Building', 'National Competitions'],
    gallery: [{ caption: 'Robo Wars' }, { caption: 'Drone Building' }, { caption: 'Arduino Workshop' }],
    membersCount: 168,
    upcomingEvent: { title: 'Robo Wars Qualifiers', date: new Date(Date.now() + 16 * 86400000) },
    facultyCoordinator: { name: 'Dr. Vinod Kumar', designation: 'Professor, Mechatronics', email: 'vinod.kumar@campus.edu' },
    coreTeam: [{ name: 'Sahil Verma', role: 'Team Lead', year: '4th Year' }, { name: 'Nandini Rao', role: 'Technical Head', year: '3rd Year' }],
    achievements: ['Best Innovation Award, TechFest National'],
    recruitmentOpen: true
  }
]

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
router.get('/', async (req, res) => {
  try {
    let clubs = []

    if (mongoose.connection.readyState === 1) {
      try {
        let query = Club.find()
        if (req.query.category) {
          query = query.where('category').equals(req.query.category)
        }
        clubs = await query.sort({ name: 1 }).timeout(5000)
      } catch (dbError) {
        console.log('Database query failed, falling back to mock data:', dbError.message)
        clubs = []
      }
    }

    if (clubs.length === 0) {
      clubs = MOCK_CLUBS
    }

    res.json({
      success: true,
      clubs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Get a single club by slug
// @route   GET /api/clubs/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    let club = null

    if (mongoose.connection.readyState === 1) {
      try {
        club = await Club.findOne({ slug: req.params.slug }).timeout(5000)
      } catch (dbError) {
        console.log('Database query failed, falling back to mock data:', dbError.message)
      }
    }

    if (!club) {
      club = MOCK_CLUBS.find((c) => c.slug === req.params.slug)
    }

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found'
      })
    }

    res.json({
      success: true,
      club
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private (Admin/Moderator only)
router.post('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const club = await Club.create(req.body)
    res.status(201).json({
      success: true,
      club
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create club'
    })
  }
})

// @desc    Update a club
// @route   PUT /api/clubs/:id
// @access  Private (Admin/Moderator only)
router.put('/:id', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' })
    }
    res.json({ success: true, club })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update club'
    })
  }
})

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private (Admin/Moderator only)
router.delete('/:id', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id)
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' })
    }
    res.json({ success: true, message: 'Club deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' })
    }

    const alreadyMember = club.members.some((m) => m.user.toString() === req.user._id.toString())
    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'You are already a member of this club' })
    }

    club.members.push({ user: req.user._id })
    club.membersCount = club.members.length
    await club.save()

    res.json({ success: true, message: 'Successfully joined the club' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to join club' })
  }
})

// @desc    Register interest in club recruitment
// @route   POST /api/clubs/:id/register-recruitment
// @access  Private
router.post('/:id/register-recruitment', protect, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' })
    }

    const alreadyApplied = club.recruitmentApplicants.some((a) => a.user.toString() === req.user._id.toString())
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already registered for recruitment' })
    }

    club.recruitmentApplicants.push({ user: req.user._id })
    await club.save()

    res.json({ success: true, message: 'Successfully registered for recruitment' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to register for recruitment' })
  }
})

module.exports = router
