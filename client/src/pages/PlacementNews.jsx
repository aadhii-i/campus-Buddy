import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building, MapPin, ExternalLink, Search, Bookmark, Plus, Briefcase } from 'lucide-react';
import CreatePlacementModal from '../components/CreatePlacementModal';
import LogoTile from '../components/home/LogoTile';
import { PageHeader, Stat, LoadingState, EmptyState } from '../components/common';

const STATUS_STYLES = {
  open: 'badge-success',
  closed: 'badge-outline',
};

// Categories map onto the palette (lilac / lime / ink / neutral) instead of a rainbow.
const CATEGORY_STYLES = {
  software: 'badge-lilac',
  data: 'badge-ink',
  management: 'badge-lime',
  devops: 'badge-neutral',
};

// LogoTile now derives its palette variant from the label; kept for API compatibility.
const CATEGORY_GRADIENT = {
  software: 'from-brand-200 to-brand-200',
  data: 'from-midnight-900 to-midnight-900',
  management: 'from-glow-400 to-glow-400',
  devops: 'from-midnight-900 to-midnight-900',
};

const STATUS_FILTERS = [
  { value: 'all', label: 'All status' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

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
  const getCategoryStyle = (category) => CATEGORY_STYLES[category] || 'badge-neutral';

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
    <div className="page-shell">
      <div className="page-container">
        <PageHeader
          eyebrow="Placement hub"
          title={<>Your next opportunity, <span className="marker">curated</span></>}
          description="Live openings from companies visiting campus — package, deadlines, and requirements at a glance."
          actions={
            <button onClick={() => setShowCreateModal(true)} className="btn-primary flex-shrink-0">
              <Plus className="h-4 w-4" />
              Post opportunity
            </button>
          }
        />

        {/* Stats strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="surface-panel p-5">
            <Stat icon={Briefcase} value={placements.filter(p => p.status === 'open').length} label="Active openings" />
          </div>
          <div className="surface-panel p-5">
            <Stat icon={Building} value={companies.length} label="Companies hiring" />
          </div>
          <div className="surface-panel p-5">
            <Stat icon={Calendar} value={placements.filter(p => isDeadlineApproaching(p.deadline)).length} label="Urgent deadlines" />
          </div>
          <div className="surface-panel-dark relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-0 bg-dots-dark" />
            <div className="relative">
              <Stat dark icon={ExternalLink} value="₹25L+" label="Avg. package" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="surface-panel mt-6 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="relative">
              <label htmlFor="placement-search" className="sr-only">Search opportunities</label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" />
              <input
                id="placement-search"
                type="text"
                placeholder="Search opportunities…"
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="placement-company" className="sr-only">Filter by company</label>
              <select id="placement-company" className="form-select" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}>
                <option value="all">All companies</option>
                {companies.map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            role="group"
            aria-label="Filter by status"
            className="no-scrollbar -mx-1 mt-4 flex gap-2 overflow-x-auto border-t border-midnight-900/10 px-1 pt-4"
          >
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                aria-pressed={filterStatus === f.value}
                className={filterStatus === f.value ? 'chip-active' : 'chip'}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Placements Grid */}
        {loading ? (
          <LoadingState label="Loading opportunities…" />
        ) : filteredPlacements.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={Briefcase}
              title="No opportunities found"
              description="No placement opportunities match your criteria."
              actionLabel="Post the first opportunity"
              onAction={() => setShowCreateModal(true)}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredPlacements.map((placement, index) => (
              <motion.div
                key={placement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="surface-panel card-interactive flex h-full flex-col p-5 sm:p-6"
              >
                {/* Company + role */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <LogoTile label={placement.company} gradient={CATEGORY_GRADIENT[placement.category] || 'from-brand-500 to-brand-700'} size="md" />
                    <div className="min-w-0">
                      <div className="mb-0.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-midnight-500">
                        <Building className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{placement.company}</span>
                      </div>
                      <h3 className="mb-1 font-bold leading-snug text-midnight-900 sm:text-lg">{placement.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-midnight-500">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{placement.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                    <span className={getStatusStyle(placement.status)}>
                      {placement.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                    <span className={getCategoryStyle(placement.category)}>
                      {placement.category}
                    </span>
                  </div>
                </div>

                {/* Package / type */}
                <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-xl border border-midnight-900/10">
                  <div className="bg-glow-400 p-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-midnight-600">Package</p>
                    <p className="font-display text-lg font-bold leading-tight text-midnight-900">{placement.package}</p>
                  </div>
                  <div className="border-l border-midnight-900/10 bg-surface-50 p-3.5 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-midnight-600">Type</p>
                    <p className="font-semibold text-midnight-900">{placement.type}</p>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-midnight-600">{placement.description}</p>

                <div className="mb-4 flex flex-wrap gap-1.5">
                  {placement.requirements.slice(0, 3).map((req, index) => (
                    <span key={index} className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-midnight-800">
                      {req}
                    </span>
                  ))}
                </div>

                {/* Deadline + actions */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-midnight-900/10 pt-4">
                  <div className="flex items-center gap-2 text-xs text-midnight-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-midnight-500" />
                      <span className="font-medium">Apply by {new Date(placement.deadline).toLocaleDateString()}</span>
                    </span>
                    {isDeadlineApproaching(placement.deadline) && (
                      <span className="badge-danger">Urgent</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button aria-label="Bookmark" className="btn-icon">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="btn-primary !px-4 !py-2">
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
