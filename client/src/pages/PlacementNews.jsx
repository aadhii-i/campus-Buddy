import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, MapPin, ExternalLink, Filter, Search, Bookmark, Plus } from 'lucide-react';
import CreatePlacementModal from '../components/CreatePlacementModal';

const PlacementNews = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      // Mock data for development
      setPlacements([
        {
          _id: '1',
          title: 'Software Engineer - Google',
          company: 'Google',
          location: 'Bangalore, India',
          package: '₹25-30 LPA',
          type: 'Full-time',
          deadline: '2025-10-15',
          description: 'Google is hiring fresh graduates for Software Engineer positions. Looking for strong programming skills in Java, Python, or C++.',
          requirements: ['B.Tech/B.E in CS/IT', 'Strong programming skills', 'Good communication skills'],
          status: 'open',
          postedDate: '2025-10-01',
          category: 'software'
        },
        {
          _id: '2',
          title: 'Data Analyst - Microsoft',
          company: 'Microsoft',
          location: 'Hyderabad, India',
          package: '₹18-22 LPA',
          type: 'Full-time',
          deadline: '2025-10-20',
          description: 'Microsoft is looking for Data Analysts to join their team. Experience with SQL, Python, and data visualization tools required.',
          requirements: ['Any Engineering degree', 'SQL and Python skills', 'Data visualization experience'],
          status: 'open',
          postedDate: '2025-10-02',
          category: 'data'
        },
        {
          _id: '3',
          title: 'Product Manager - Amazon',
          company: 'Amazon',
          location: 'Mumbai, India',
          package: '₹22-28 LPA',
          type: 'Full-time',
          deadline: '2025-10-05',
          description: 'Amazon is hiring Product Managers for their India operations. Looking for strategic thinkers with leadership potential.',
          requirements: ['Any degree with good academics', 'Leadership experience', 'Strategic thinking'],
          status: 'closed',
          postedDate: '2025-09-20',
          category: 'management'
        },
        {
          _id: '4',
          title: 'DevOps Engineer - Netflix',
          company: 'Netflix',
          location: 'Remote',
          package: '₹20-25 LPA',
          type: 'Full-time',
          deadline: '2025-10-25',
          description: 'Netflix is seeking DevOps Engineers to manage their cloud infrastructure. Experience with AWS, Docker, and Kubernetes preferred.',
          requirements: ['B.Tech in CS/IT', 'Cloud platform experience', 'Docker/Kubernetes knowledge'],
          status: 'open',
          postedDate: '2025-10-03',
          category: 'devops'
        }
      ]);
    } catch (error) {
      console.error('Error fetching placements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'open' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      software: 'bg-blue-100 text-blue-800',
      data: 'bg-purple-100 text-purple-800',
      management: 'bg-orange-100 text-orange-800',
      devops: 'bg-cyan-100 text-cyan-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const isDeadlineApproaching = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const filteredPlacements = placements.filter(placement => {
    const matchesSearch = placement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = filterCompany === 'all' || placement.company === filterCompany;
    const matchesStatus = filterStatus === 'all' || placement.status === filterStatus;
    
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const companies = [...new Set(placements.map(p => p.company))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Placement Opportunities</h1>
            <p className="text-lg text-gray-600">
              Stay updated with the latest job opportunities and placement news
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Post Opportunity
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Placements Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading opportunities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPlacements.map((placement) => (
              <motion.div
                key={placement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{placement.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">{placement.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{placement.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(placement.status)}`}>
                        {placement.status === 'open' ? 'Open' : 'Closed'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(placement.category)}`}>
                        {placement.category}
                      </span>
                    </div>
                  </div>

                  {/* Package and Type */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Package</p>
                      <p className="font-semibold text-green-600">{placement.package}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{placement.type}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-3">{placement.description}</p>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {placement.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(placement.deadline).toLocaleDateString()}</span>
                      </div>
                      {isDeadlineApproaching(placement.deadline) && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <ExternalLink className="h-4 w-4" />
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredPlacements.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No placement opportunities found matching your criteria.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Post First Opportunity
            </button>
          </div>
        )}

  {/* Statistics Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {placements.filter(p => p.status === 'open').length}
            </div>
            <div className="text-gray-600">Active Openings</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {companies.length}
            </div>
            <div className="text-gray-600">Companies</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {placements.filter(p => isDeadlineApproaching(p.deadline)).length}
            </div>
            <div className="text-gray-600">Urgent Deadlines</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">₹25L+</div>
            <div className="text-gray-600">Avg. Package</div>
          </div>
        </div>
        {showCreateModal && (
          <CreatePlacementModal
            onClose={() => setShowCreateModal(false)}
            onCreate={async (payload) => {
              // Append locally (mock environment). In real app call placement.createNews
              const newPlacement = {
                _id: Date.now().toString(),
                status: 'open',
                postedDate: new Date().toISOString(),
                category: 'software',
                ...payload
              }
              setPlacements((prev) => [newPlacement, ...prev])
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PlacementNews;