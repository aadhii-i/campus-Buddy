const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

export const placementCompanies = [
  { name: 'Google', role: 'Software Engineer', package: '₹42 LPA', deadline: daysFromNow(6), gradient: 'from-blue-500 to-emerald-500' },
  { name: 'Microsoft', role: 'Product Engineer', package: '₹38 LPA', deadline: daysFromNow(9), gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Amazon', role: 'SDE-1', package: '₹32 LPA', deadline: daysFromNow(4), gradient: 'from-orange-400 to-amber-600' },
  { name: 'Oracle', role: 'Applications Developer', package: '₹22 LPA', deadline: daysFromNow(12), gradient: 'from-red-500 to-rose-600' },
  { name: 'Adobe', role: 'Software Development Engineer', package: '₹28 LPA', deadline: daysFromNow(8), gradient: 'from-red-600 to-pink-600' },
  { name: 'Infosys', role: 'Systems Engineer', package: '₹9 LPA', deadline: daysFromNow(15), gradient: 'from-indigo-500 to-blue-700' }
]
