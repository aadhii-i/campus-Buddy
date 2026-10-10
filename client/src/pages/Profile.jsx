import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Camera, Award, BookOpen, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmptyState, Stat } from '../components/common';

const DEPARTMENT_LABELS = {
  CSE: 'Computer Science', ECE: 'Electronics', ME: 'Mechanical',
  CE: 'Civil', EE: 'Electrical', IT: 'Information Technology', OTHER: 'Other'
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'academic', label: 'Academic', icon: BookOpen },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'experience', label: 'Experience', icon: Briefcase }
];

const ordinalYear = (year) => {
  const n = Number(year);
  if (!n) return '';
  const suffix = ['th', 'st', 'nd', 'rd'][n] || 'th';
  return `${n}${suffix} Year`;
};

const Profile = () => {
  const { user } = useAuth();

  // Seed from the signed-in user; fall back to sample content for fields the
  // backend user model does not carry yet (location, achievements, courses).
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    rollNumber: 'CS21B001',
    branch: 'Computer Science',
    year: '3rd Year',
    location: 'Bhubaneswar, Odisha',
    bio: 'Passionate computer science student with interests in web development and artificial intelligence.',
    avatar: null,
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
    achievements: [
      'First Prize in College Hackathon 2024',
      'Best Project Award in Software Engineering',
      'Google Summer of Code Participant'
    ],
    courses: [
      'Data Structures and Algorithms',
      'Database Management Systems',
      'Software Engineering',
      'Machine Learning'
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setEditForm(profile);
  }, [profile]);

  // Merge the authenticated user's real details over the sample profile.
  useEffect(() => {
    if (!user) return;
    setProfile((prev) => ({
      ...prev,
      name: user.name || prev.name,
      email: user.email || prev.email,
      phone: user.profile?.phone || prev.phone,
      rollNumber: user.studentId || prev.rollNumber,
      branch: DEPARTMENT_LABELS[user.department] || user.department || prev.branch,
      year: ordinalYear(user.year) || prev.year,
      bio: user.profile?.bio || prev.bio,
      avatar: user.avatar || prev.avatar,
      skills: user.profile?.skills?.length ? user.profile.skills : prev.skills,
    }));
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill) => {
    if (skill && !editForm.skills.includes(skill)) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="page-shell">
      <div className="page-container max-w-5xl">
        {/* Identity header */}
        <div className="surface-panel-dark relative mb-4 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-dots-dark mask-fade-b" />
          <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center">
            {/* Avatar */}
            <div className="relative flex-shrink-0 self-start md:self-center">
              <div className="h-24 w-24 rounded-full border-2 border-glow-400 p-1 sm:h-28 sm:w-28">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-brand-200">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-midnight-900" />
                  )}
                </div>
              </div>
              {isEditing && (
                <button aria-label="Change photo" className="absolute bottom-0 right-0 rounded-full border-2 border-midnight-900 bg-glow-400 p-2 text-midnight-900 transition-colors hover:bg-glow-500">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="min-w-0 flex-1">
              <span className="eyebrow-dark">Student dashboard</span>
              {isEditing ? (
                <div className="mt-3 space-y-3">
                  <label htmlFor="profile-name" className="sr-only">Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-display w-full border-b-2 border-glow-400 bg-transparent text-2xl text-surface-50 focus:outline-none sm:text-3xl"
                  />
                  <label htmlFor="profile-bio" className="sr-only">Bio</label>
                  <textarea
                    id="profile-bio"
                    value={editForm.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="form-textarea"
                    rows={2}
                  />
                </div>
              ) : (
                <div className="mt-3">
                  <h1 className="text-display break-words text-2xl text-surface-50 sm:text-3xl">{profile.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-50/70 sm:text-base">{profile.bio}</p>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge bg-glow-400 text-midnight-900">{profile.year}</span>
                <span className="badge bg-brand-200 text-midnight-900">{profile.branch}</span>
                <span className="badge border border-white/20 text-surface-50">{profile.rollNumber}</span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex flex-shrink-0 flex-wrap gap-2 md:self-start">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn-accent">
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn-ghost-dark">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleEdit} className="btn-accent">
                  <Edit3 className="h-4 w-4" />
                  Edit profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats row — counts of the profile's own data */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="surface-panel p-5">
            <Stat icon={BookOpen} value={profile.courses.length} label="Current courses" />
          </div>
          <div className="surface-panel p-5">
            <Stat icon={Award} value={profile.achievements.length} label="Achievements" />
          </div>
          <div className="surface-panel p-5">
            <Stat icon={Briefcase} value={profile.skills.length} label="Skills" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="no-scrollbar mb-4 overflow-x-auto">
          <nav className="tab-list" aria-label="Profile sections">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={activeTab === id ? 'page' : undefined}
                className={activeTab === id ? 'tab-active' : 'tab'}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Contact Information */}
                <section className="surface-panel space-y-4 p-6">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-midnight-900">
                    <span className="icon-tile h-8 w-8"><Mail className="h-4 w-4" /></span>
                    Contact information
                  </h3>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <label htmlFor="profile-email" className="sr-only">Email</label>
                        <input
                          id="profile-email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <label htmlFor="profile-phone" className="sr-only">Phone</label>
                        <input
                          id="profile-phone"
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <label htmlFor="profile-location" className="sr-only">Location</label>
                        <input
                          id="profile-location"
                          type="text"
                          value={editForm.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-midnight-900/10 text-sm">
                      <div className="flex items-center gap-3 py-2.5 text-midnight-700">
                        <Mail className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <span className="min-w-0 break-all">{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2.5 text-midnight-700">
                        <Phone className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 py-2.5 text-midnight-700">
                        <MapPin className="h-4.5 w-4.5 flex-shrink-0 text-midnight-500" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  )}
                </section>

                {/* Academic Information */}
                <section className="surface-lilac space-y-4 p-6">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-midnight-900">
                    <span className="icon-tile-dark h-8 w-8"><BookOpen className="h-4 w-4" /></span>
                    Academic information
                  </h3>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="profile-roll" className="form-label">Roll number</label>
                        <input
                          id="profile-roll"
                          type="text"
                          placeholder="Roll Number"
                          value={editForm.rollNumber}
                          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="profile-branch" className="form-label">Branch</label>
                        <input
                          id="profile-branch"
                          type="text"
                          placeholder="Branch"
                          value={editForm.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div>
                        <label htmlFor="profile-year" className="form-label">Year</label>
                        <input
                          id="profile-year"
                          type="text"
                          placeholder="Year"
                          value={editForm.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-midnight-900/10 text-sm">
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="font-medium text-midnight-600">Roll number:</dt>
                        <dd className="font-semibold text-midnight-900">{profile.rollNumber}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="font-medium text-midnight-600">Branch:</dt>
                        <dd className="text-right font-semibold text-midnight-900">{profile.branch}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="font-medium text-midnight-600">Year:</dt>
                        <dd><span className="rounded-full border border-midnight-900/15 bg-glow-400 px-2.5 py-0.5 font-semibold text-midnight-900">{profile.year}</span></dd>
                      </div>
                    </dl>
                  )}
                </section>
              </div>

              {/* Skills */}
              <section className="surface-panel p-6">
                <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-midnight-900">
                  <span className="icon-tile-lime h-8 w-8"><Briefcase className="h-4 w-4" /></span>
                  Skills
                </h3>
                <div className="mb-3 flex flex-wrap gap-2">
                  {(isEditing ? editForm.skills : profile.skills).map((skill, index) => (
                    <span
                      key={index}
                      className={`rounded-full border border-midnight-900/10 bg-brand-100 px-3 py-1 text-sm font-medium text-midnight-900 ${
                        isEditing ? 'flex items-center gap-1.5' : ''
                      }`}
                    >
                      {skill}
                      {isEditing && (
                        <button onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} className="rounded-full text-midnight-600 hover:text-midnight-900">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <>
                    <label htmlFor="profile-add-skill" className="sr-only">Add a skill</label>
                    <input
                      id="profile-add-skill"
                      type="text"
                      placeholder="Add a skill and press Enter"
                      className="form-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </>
                )}
              </section>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === 'academic' && (
            <section className="surface-panel space-y-5 p-6">
              <h3 className="text-base font-semibold text-midnight-900">Current courses</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {profile.courses.map((course, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl border border-midnight-900/10 bg-surface-50 p-4 transition-colors hover:border-midnight-900/30">
                    <div className="icon-tile h-9 w-9">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-midnight-800">{course}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <section className="surface-panel space-y-5 p-6">
              <h3 className="text-base font-semibold text-midnight-900">Achievements &amp; awards</h3>
              <div className="space-y-3">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-xl border border-midnight-900/10 bg-glow-300 p-4">
                    <div className="icon-tile-dark h-8 w-8">
                      <Award className="h-4 w-4" />
                    </div>
                    <span className="self-center text-sm font-medium text-midnight-900">{achievement}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <section className="surface-panel space-y-5 p-6">
              <h3 className="text-base font-semibold text-midnight-900">Experience &amp; projects</h3>
              <EmptyState
                icon={Briefcase}
                title="No experience added yet"
                description="Add your internships, projects, and work experience here."
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
