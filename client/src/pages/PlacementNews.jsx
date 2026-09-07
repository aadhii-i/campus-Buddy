import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, MapPin, ExternalLink, Search, Bookmark, Plus, Briefcase } from 'lucide-react';
import CreatePlacementModal from '../components/CreatePlacementModal';
import LogoTile from '../components/home/LogoTile';
import { PageHeader, Stat, LoadingState, EmptyState } from '../components/common';

const STATUS_STYLES = {
  open: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-rose-50 text-rose-700',
};

const CATEGORY_STYLES = {
  software: 'bg-brand-50 text-brand-700',
  data: 'bg-violet-50 text-violet-700',
  management: 'bg-amber-50 text-amber-700',
  devops: 'bg-glow-500/10 text-glow-600',
};

const CATEGORY_GRADIENT = {
  software: 'from-brand-500 to-brand-700',
  data: 'from-violet-500 to-violet-700',
  management: 'from-amber-500 to-amber-700',
  devops: 'from-glow-500 to-glow-600',
};

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

  const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.closed;
  const getCategoryStyle = (category) => CATEGORY_STYLES[category] || 'bg-midnight-100 text-midnight-600';

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
    <div className="min-h-screen bg-surface-50 pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Placement hub"
          title="Your next opportunity, curated"
          description="Live openings from companies visiting campus — package, deadlines, and requirements at a glance."
          actions={
            <button onClick={() => setShowCreateModal(true)} className="btn-primary flex-shrink-0">
              <Plus className="h-4 w-4" />
              Post opportunity
            </button>
          }
        />

        {/* Stats strip */}
        <div className="surface-panel mt-8 grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
          <Stat icon={Briefcase} value={placements.filter(p => p.status === 'open').length} label="Active openings" />
          <Stat icon={Building} value={companies.length} label="Companies hiring" />
          <Stat icon={Calendar} value={placements.filter(p => isDeadlineApproaching(p.deadline)).length} label="Urgent deadlines" />
          <Stat icon={ExternalLink} value="₹25L+" label="Avg. package" />
        </div>

        {/* Search and Filters */}
        <div className="surface-panel mt-6 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
              <input
                type="text"
                placeholder="Search opportunities…"
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select className="form-select" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
              <option value="all">All companies</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Placements Grid */}
        {loading ? (
          <LoadingState label="Loading opportunities…" />
        ) : filteredPlacements.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Briefcase}
              title="No opportunities found"
              description="No placement opportunities match your criteria."
              actionLabel="Post the first opportunity"
              onAction={() => setShowCreateModal(true)}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredPlacements.map((placement, index) => (
              <motion.div
                key={placement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="surface-panel p-6"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <LogoTile label={placement.company} gradient={CATEGORY_GRADIENT[placement.category] || 'from-brand-500 to-brand-700'} size="md" />
                    <div>
                      <h3 className="mb-1 font-bold leading-snug text-midnight-900">{placement.title}</h3>
                      <div className="mb-1 flex items-center gap-1.5 text-sm text-midnight-600">
                        <Building className="h-3.5 w-3.5" />
                        <span className="font-medium">{placement.company}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-midnight-400">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{placement.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(placement.status)}`}>
                      {placement.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${getCategoryStyle(placement.category)}`}>
                      {placement.category}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between rounded-xl bg-midnight-50 p-3.5">
                  <div>
                    <p className="text-xs text-midnight-500">Package</p>
                    <p className="font-bold text-emerald-600">{placement.package}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-midnight-500">Type</p>
                    <p className="font-semibold text-midnight-900">{placement.type}</p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-midnight-500">{placement.description}</p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {placement.requirements.slice(0, 3).map((req, index) => (
                    <span key={index} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                      {req}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-midnight-100 pt-4">
                  <div className="flex items-center gap-3 text-xs text-midnight-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(placement.deadline).toLocaleDateString()}
                    </span>
                    {isDeadlineApproaching(placement.deadline) && (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">Urgent</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button aria-label="Bookmark" className="rounded-full p-2 text-midnight-400 transition-colors hover:bg-midnight-50 hover:text-brand-600">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
