'use client';

import { useState, useEffect } from 'react';
import {
  Database, Settings, Home, Navigation, Info, BookOpen,
  Globe, Star, FileText, Phone, Map, Users, MessageSquare,
  Loader, AlertCircle, Inbox, Trash2
} from 'lucide-react';

import NavbarAdmin from './components/navbar';
import FooterAdmin from './components/footer';
import HomeAdmin from './components/home';
import AboutAdmin from './components/about';
import ServicesAdmin from './components/services';
import CoursesAdmin from './components/courses';
import CountriesAdmin from './components/countries';
import SuccessStoriesAdmin from './components/success-stories';
import BlogAdmin from './components/blogs';
import ContactAdmin from './components/contact';

function PlaceholderAdmin({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
        <Settings size={36} className="text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-400">This section is under development</p>
    </div>
  );
}

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/data?collection=auth')
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Error fetching users'); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
      <Loader className="animate-spin mx-auto" size={48} />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100">
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-900">
          <Users size={28} /> Registered Users
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{users.length}</span>
        </h2>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-6 py-4 rounded-xl bg-red-500 text-white flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500">#</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500">Password</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500">ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                  <td className="py-3 px-4 text-blue-600">{user.email}</td>
                  <td className="py-3 px-4 font-mono text-gray-500 text-xs">{user.password}</td>
                  <td className="py-3 px-4 font-mono text-gray-400 text-xs">{user._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-400">No users registered yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormSubmissionsAdmin() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/api/data?collection=form')
      .then(r => r.json())
      .then(data => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Error fetching submissions'); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
      <Loader className="animate-spin mx-auto text-blue-500" size={48} />
      <p className="mt-4 text-gray-400 font-medium">Loading submissions...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-blue-900">
          <Inbox size={28} /> Form Submissions
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{submissions.length}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">Messages sent via the contact form</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 px-6 py-4 rounded-xl bg-red-500 text-white flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Submission Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Name',    value: selected.name },
                { label: 'Email',   value: selected.email },
                { label: 'Phone',   value: selected.phone },
                { label: 'Service', value: selected.service || '—' },
                { label: 'Message', value: selected.message || '—', multiline: true },
                { label: 'ID',      value: selected._id, mono: true },
              ].map(({ label, value, multiline, mono }) => (
                <div key={label}>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
                  <p className={`mt-1 text-gray-800 ${mono ? 'font-mono text-xs' : 'text-sm'} ${multiline ? 'whitespace-pre-wrap bg-gray-50 rounded-xl p-3' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="p-6">
        {submissions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Inbox size={48} className="mx-auto mb-3 opacity-30" />
            <p>No submissions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Message</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, idx) => (
                  <tr key={sub._id} className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{sub.name || '—'}</td>
                    <td className="py-3 px-4 text-blue-600">{sub.email || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{sub.phone || '—'}</td>
                    <td className="py-3 px-4">
                      {sub.service
                        ? <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{sub.service}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-[180px] truncate">{sub.message || '—'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelected(sub)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home',             name: 'Home',             icon: Home,          component: HomeAdmin },
    { id: 'navbar',           name: 'Navbar',           icon: Navigation,    component: NavbarAdmin },
    { id: 'footer',           name: 'Footer',           icon: Info,          component: FooterAdmin },
    { id: 'about',            name: 'About',            icon: Users,         component: AboutAdmin },
    { id: 'services',         name: 'Services',         icon: Star,          component: ServicesAdmin },
    { id: 'courses',          name: 'Courses',          icon: BookOpen,      component: CoursesAdmin },
    { id: 'countries',        name: 'Countries',        icon: Globe,         component: CountriesAdmin },
    { id: 'success_stories',  name: 'Success Stories',  icon: MessageSquare, component: SuccessStoriesAdmin },
    { id: 'blog',             name: 'Blog',             icon: FileText,      component: BlogAdmin },
    { id: 'contact',          name: 'Contact',          icon: Phone,         component: ContactAdmin },
    { id: 'users',            name: 'Users',            icon: Users,         component: UsersAdmin },
    { id: 'form_submissions', name: 'Form Submissions', icon: Inbox,         component: FormSubmissionsAdmin }, // ✅ جديد
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || HomeAdmin;

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      <div className="shadow-lg bg-gradient-to-r from-blue-700 to-purple-700 border-b-4 border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database size={30} className="animate-pulse" />
              Edumaster Admin Panel
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-5 sticky top-4 border border-gray-200">
              <h2 className="text-lg font-bold mb-5 pb-3 border-b flex items-center gap-2 text-gray-700">
                <Settings size={20} className="text-blue-500" />
                Sections
              </h2>
              <div className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ActiveComponent />
          </div>

        </div>
      </div>
    </div>
  );
}