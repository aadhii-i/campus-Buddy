import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Camera, Award, BookOpen, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/common';

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
    <div className="min-h-screen bg-surface-50 pb-20 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="surface-panel mb-6 overflow-hidden">
          <div className="relative h-32 overflow-hidden bg-midnight-950">
            <div className="pointer-events-none absolute inset-0 bg-mesh-dark" />
            <div className="pointer-events-none absolute inset-0 bg-noise" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-white p-1.5 shadow-card-hover">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className="h-16 w-16 text-white" />
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-1 right-1 rounded-full bg-brand-600 p-2 text-white transition-colors hover:bg-brand-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-display border-b-2 border-brand-500 bg-transparent text-2xl focus:outline-none"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-display text-2xl text-midnight-900">{profile.name}</h1>
                    <p className="mt-1 text-midnight-500">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn-primary !bg-emerald-600 hover:!bg-emerald-700">
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button onClick={handleCancel} className="btn-secondary">
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={handleEdit} className="btn-primary">
                    <Edit3 className="h-4 w-4" />
                    Edit profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="surface-panel">
          <div className="border-b border-midnight-100">
            <nav className="flex gap-1 overflow-x-auto px-4">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative flex flex-shrink-0 items-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === id ? 'text-brand-700' : 'text-midnight-400 hover:text-midnight-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {activeTab === id && (
                    <motion.span layoutId="profile-tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-midnight-900">Contact information</h3>

                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4.5 w-4.5 flex-shrink-0 text-midnight-400" />
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="form-input flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-4.5 w-4.5 flex-shrink-0 text-midnight-400" />
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="form-input flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4.5 w-4.5 flex-shrink-0 text-midnight-400" />
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="form-input flex-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-midnight-600">
                          <Mail className="h-4.5 w-4.5 text-midnight-400" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-midnight-600">
                          <Phone className="h-4.5 w-4.5 text-midnight-400" />
                          <span>{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-midnight-600">
                          <MapPin className="h-4.5 w-4.5 text-midnight-400" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-midnight-900">Academic information</h3>

                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Roll Number"
                          value={editForm.rollNumber}
                          onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Branch"
                          value={editForm.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={editForm.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm text-midnight-600">
                        <p><span className="font-medium text-midnight-900">Roll number:</span> {profile.rollNumber}</p>
                        <p><span className="font-medium text-midnight-900">Branch:</span> {profile.branch}</p>
                        <p><span className="font-medium text-midnight-900">Year:</span> {profile.year}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="mb-4 text-base font-semibold text-midnight-900">Skills</h3>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(isEditing ? editForm.skills : profile.skills).map((skill, index) => (
                      <span
                        key={index}
                        className={`rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 ${
                          isEditing ? 'flex items-center gap-1.5' : ''
                        }`}
                      >
                        {skill}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill)} className="text-brand-500 hover:text-brand-800">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <input
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
                  )}
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-midnight-900">Current courses</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {profile.courses.map((course, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-midnight-100 bg-white p-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-midnight-800">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-midnight-900">Achievements &amp; awards</h3>
                <div className="space-y-3">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                      <Award className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-amber-600" />
                      <span className="text-sm text-amber-900">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-midnight-900">Experience &amp; projects</h3>
                <EmptyState
                  icon={Briefcase}
                  title="No experience added yet"
                  description="Add your internships, projects, and work experience here."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
