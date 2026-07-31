const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

export const upcomingEventsShowcase = [
  {
    id: 'showcase-1',
    title: 'National Hackathon 2026',
    date: daysFromNow(5),
    time: '09:00 AM',
    venue: 'Innovation Hub, Block C',
    seatsLeft: 32,
    totalSeats: 200,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500'
  },
  {
    id: 'showcase-2',
    title: 'AI & ML Summit',
    date: daysFromNow(9),
    time: '10:30 AM',
    venue: 'Main Auditorium',
    seatsLeft: 68,
    totalSeats: 300,
    gradient: 'from-blue-500 via-cyan-500 to-teal-500'
  },
  {
    id: 'showcase-3',
    title: 'Cultural Fest — Rhythm',
    date: daysFromNow(14),
    time: '05:00 PM',
    venue: 'Open Air Theatre',
    seatsLeft: 120,
    totalSeats: 800,
    gradient: 'from-orange-500 via-rose-500 to-red-500'
  },
  {
    id: 'showcase-4',
    title: 'Startup Pitch Night',
    date: daysFromNow(20),
    time: '04:00 PM',
    venue: 'Conference Hall B',
    seatsLeft: 15,
    totalSeats: 100,
    gradient: 'from-emerald-500 via-green-500 to-lime-500'
  }
]
