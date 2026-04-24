'use client';

import { useState, useEffect } from 'react';
import {
  Save, RefreshCw, Loader, AlertCircle, CheckCircle,
  ChevronDown, ChevronUp, Globe, Languages, Image,
  BookOpen, Star, BarChart2, Target, Eye, Lightbulb, Users
} from 'lucide-react';

const API_BASE_URL = '/api/data';

const DEFAULT_CONFIG = {
  hero: { backgroundImage: '' },
  stats: {
    backgroundImage: '',
    items: [{ value: '' }, { value: '' }, { value: '' }, { value: '' }]
  },
  countries: [{
    id: 'spain',
    image: '',
    flag: '',
    color: '',
    ctaHref: '',
    sections: {
      educationSystem: { image: '' },
      admissionRequirements: { image: '' },
      costOfLiving: { image: '' },
      partTimeWork: { image: '' },
      visaProcess: { image: '' },
      lifeInSpain: { image: '' }
    }
  }],
  i18n: {}
};

export default function CountriesAdmin() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    images: false,
    stats: false,
    translations: false
  });

  useEffect(() => { fetchConfig(); }, []);

  const showMessage = (message, type = 'success') => {
    setSuccess(type === 'success' ? message : '');
    setError(type === 'error' ? message : '');
    setTimeout(() => { setSuccess(''); setError(''); }, 4000);
  };

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?collection=countries`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const data = Array.isArray(result) && result.length > 0 ? result[0] : null;
      setConfig(data || { ...DEFAULT_CONFIG, _id: 'temp' });
    } catch (err) {
      showMessage('Error fetching countries data: ' + err.message, 'error');
    }
    setLoading(false);
  };

  const saveConfig = async () => {
    if (!config) return;
    setLoading(true);
    try {
      const isNew = config._id === 'temp' || !config._id;
      const url = `${API_BASE_URL}?collection=countries${isNew ? '' : `&id=${config._id}`}`;
      const method = isNew ? 'POST' : 'PUT';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      showMessage('✓ Configuration saved successfully');
      fetchConfig();
    } catch (err) {
      showMessage('Error saving: ' + err.message, 'error');
    }
    setLoading(false);
  };

  const updateConfig = (path, value) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined || current[keys[i]] === null) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get all language codes from i18n keys
  const languages = config ? Object.keys(config.i18n || {}) : [];

  if (!config) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
        {loading ? <Loader className="animate-spin mx-auto" size={48} /> : <p>No data</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-100">
      {/* Header */}
      <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-900">
            <Globe size={28} />
            Countries Page Configuration
          </h2>
          <div className="flex gap-3">
            <button
              onClick={fetchConfig}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={saveConfig}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              Save All
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(success || error) && (
        <div className={`mx-6 mt-4 px-6 py-4 rounded-xl flex items-center gap-3 ${success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {success ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <span className="font-medium">{success || error}</span>
        </div>
      )}

      <div className="p-6 space-y-6">

        {/* Images & Media */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('images')}>
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <Image size={20} /> Images & Media
            </h3>
            {expandedSections.images ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.images && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Background */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Background Image</label>
                <input
                  type="url"
                  value={config.hero?.backgroundImage || ''}
                  onChange={e => updateConfig('hero.backgroundImage', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.hero?.backgroundImage && (
                  <img src={config.hero.backgroundImage} alt="Hero preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Stats Background */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stats Background Image</label>
                <input
                  type="url"
                  value={config.stats?.backgroundImage || ''}
                  onChange={e => updateConfig('stats.backgroundImage', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.stats?.backgroundImage && (
                  <img src={config.stats.backgroundImage} alt="Stats preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Country Main Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Main Image (Spain)</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.image || ''}
                  onChange={e => updateConfig('countries.0.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.image && (
                  <img src={config.countries[0].image} alt="Country preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Country Flag */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Flag (emoji)</label>
                <input
                  type="text"
                  value={config.countries?.[0]?.flag || ''}
                  onChange={e => updateConfig('countries.0.flag', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 text-4xl text-center"
                  placeholder="🇪🇸"
                />
              </div>

              {/* Country Color */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Country Brand Color</label>
                <input
                  type="text"
                  value={config.countries?.[0]?.color || ''}
                  onChange={e => updateConfig('countries.0.color', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="#C8102E"
                />
                {config.countries?.[0]?.color && (
                  <div 
                    className="mt-3 w-12 h-12 rounded-xl border-2 border-gray-300 shadow-inner"
                    style={{ backgroundColor: config.countries[0].color }}
                  />
                )}
              </div>

              {/* CTA Href */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Link</label>
                <input
                  type="text"
                  value={config.countries?.[0]?.ctaHref || ''}
                  onChange={e => updateConfig('countries.0.ctaHref', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="/contact"
                />
              </div>

              {/* Education System Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Education System – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.educationSystem?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.educationSystem.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.educationSystem?.image && (
                  <img src={config.countries[0].sections.educationSystem.image} alt="Education preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Admission Requirements Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Requirements – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.admissionRequirements?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.admissionRequirements.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.admissionRequirements?.image && (
                  <img src={config.countries[0].sections.admissionRequirements.image} alt="Admission preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Cost of Living Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cost of Living – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.costOfLiving?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.costOfLiving.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.costOfLiving?.image && (
                  <img src={config.countries[0].sections.costOfLiving.image} alt="Cost preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Part-Time Work Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Part-Time Work – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.partTimeWork?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.partTimeWork.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.partTimeWork?.image && (
                  <img src={config.countries[0].sections.partTimeWork.image} alt="Part-time preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Visa Process Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Visa Process – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.visaProcess?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.visaProcess.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.visaProcess?.image && (
                  <img src={config.countries[0].sections.visaProcess.image} alt="Visa preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>

              {/* Life in Spain Image */}
              <div className="p-4 bg-white rounded-lg border-2 border-purple-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Life in Spain – Image</label>
                <input
                  type="url"
                  value={config.countries?.[0]?.sections?.lifeInSpain?.image || ''}
                  onChange={e => updateConfig('countries.0.sections.lifeInSpain.image', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="https://..."
                />
                {config.countries?.[0]?.sections?.lifeInSpain?.image && (
                  <img src={config.countries[0].sections.lifeInSpain.image} alt="Life preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Values */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('stats')}>
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <BarChart2 size={20} /> Stats Values
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {(config.stats?.items || []).length}
              </span>
            </h3>
            {expandedSections.stats ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {expandedSections.stats && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {(config.stats?.items || []).map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-2 border-blue-100">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Item {idx + 1} Value</label>
                  <input
                    type="text"
                    value={item.value || ''}
                    onChange={e => {
                      const newItems = [...(config.stats?.items || [])];
                      newItems[idx] = { ...newItems[idx], value: e.target.value };
                      updateConfig('stats.items', newItems);
                    }}
                    className="w-full px-3 py-2 border rounded text-center font-bold text-lg"
                    placeholder="10+"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Translations */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('translations')}>
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <Languages size={20} /> Translations
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{languages.length} langs</span>
            </h3>
            {expandedSections.translations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedSections.translations && languages.map(langCode => {
            const t = config.i18n?.[langCode] || {};
            return (
              <div key={langCode} className="mt-6 p-5 bg-white rounded-xl border-2 border-purple-100">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-800">
                  <Globe size={18} /> {langCode.toUpperCase()}
                </h4>

                <div className="space-y-6">

                  {/* Hero */}
                  <Section title="Hero" icon={<Star size={16} />}>
                    <Field label="Badge" value={t.hero?.badge || ''} onChange={v => updateConfig(`i18n.${langCode}.hero.badge`, v)} />
                    <Field label="Headline" value={t.hero?.headline || ''} onChange={v => updateConfig(`i18n.${langCode}.hero.headline`, v)} />
                    <Field label="Subheadline" value={t.hero?.subheadline || ''} onChange={v => updateConfig(`i18n.${langCode}.hero.subheadline`, v)} textarea />
                  </Section>

                  {/* Spain Info */}
                  <Section title="Spain Info" icon={<Globe size={16} />}>
                    <Field label="Name" value={t.countries?.spain?.name || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.name`, v)} />
                    <Field label="Tagline" value={t.countries?.spain?.tagline || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.tagline`, v)} />
                    <Field label="Description" value={t.countries?.spain?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.desc`, v)} textarea />
                    <Field label="CTA Text" value={t.countries?.spain?.cta || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.cta`, v)} />
                  </Section>

                  {/* Education System */}
                  <Section title="Education System" icon={<BookOpen size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.educationSystem?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.educationSystem.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.educationSystem?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.educationSystem.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.educationSystem?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.educationSystem.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.educationSystem?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.educationSystem?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.educationSystem.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Admission Requirements */}
                  <Section title="Admission Requirements" icon={<Target size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.admissionRequirements?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.admissionRequirements.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.admissionRequirements?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.admissionRequirements.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.admissionRequirements?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.admissionRequirements.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.admissionRequirements?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.admissionRequirements?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.admissionRequirements.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Cost of Living */}
                  <Section title="Cost of Living" icon={<Lightbulb size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.costOfLiving?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.costOfLiving.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.costOfLiving?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.costOfLiving.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.costOfLiving?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.costOfLiving.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.costOfLiving?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.costOfLiving?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.costOfLiving.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Part-Time Work */}
                  <Section title="Part-Time Work" icon={<Users size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.partTimeWork?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.partTimeWork.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.partTimeWork?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.partTimeWork.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.partTimeWork?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.partTimeWork.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.partTimeWork?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.partTimeWork?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.partTimeWork.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Visa Process */}
                  <Section title="Visa Process" icon={<Eye size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.visaProcess?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.visaProcess.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.visaProcess?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.visaProcess.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.visaProcess?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.visaProcess.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.visaProcess?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.visaProcess?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.visaProcess.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Life in Spain */}
                  <Section title="Life in Spain" icon={<Lightbulb size={16} />}>
                    <Field label="Label" value={t.countries?.spain?.lifeInSpain?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.lifeInSpain.label`, v)} />
                    <Field label="Title" value={t.countries?.spain?.lifeInSpain?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.lifeInSpain.title`, v)} />
                    <Field label="Description" value={t.countries?.spain?.lifeInSpain?.desc || ''} onChange={v => updateConfig(`i18n.${langCode}.countries.spain.lifeInSpain.desc`, v)} textarea />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Points</p>
                      {(t.countries?.spain?.lifeInSpain?.points || []).map((point, idx) => (
                        <Field
                          key={idx}
                          label={`Point ${idx + 1}`}
                          value={point || ''}
                          onChange={v => {
                            const newPoints = [...(t.countries?.spain?.lifeInSpain?.points || [])];
                            newPoints[idx] = v;
                            updateConfig(`i18n.${langCode}.countries.spain.lifeInSpain.points`, newPoints);
                          }}
                          textarea
                        />
                      ))}
                    </div>
                  </Section>

                  {/* Stats */}
                  <Section title="Stats Section" icon={<BarChart2 size={16} />}>
                    <Field label="Label" value={t.stats?.label || ''} onChange={v => updateConfig(`i18n.${langCode}.stats.label`, v)} />
                    <Field label="Title" value={t.stats?.title || ''} onChange={v => updateConfig(`i18n.${langCode}.stats.title`, v)} />
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Item Labels</p>
                      <div className="grid grid-cols-2 gap-2">
                        {(t.stats?.items || []).map((label, idx) => (
                          <Field
                            key={idx}
                            label={`Item ${idx + 1}`}
                            value={label || ''}
                            onChange={v => {
                              const newItems = [...(t.stats?.items || [])];
                              newItems[idx] = v;
                              updateConfig(`i18n.${langCode}.stats.items`, newItems);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </Section>

                  {/* Navigation */}
                  <Section title="Navigation Menu" icon={<ChevronDown size={16} />}>
                    <Field label="Education System" value={t.nav?.educationSystem || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.educationSystem`, v)} />
                    <Field label="Admission Requirements" value={t.nav?.admissionRequirements || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.admissionRequirements`, v)} />
                    <Field label="Cost of Living" value={t.nav?.costOfLiving || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.costOfLiving`, v)} />
                    <Field label="Part-Time Work" value={t.nav?.partTimeWork || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.partTimeWork`, v)} />
                    <Field label="Visa Process" value={t.nav?.visaProcess || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.visaProcess`, v)} />
                    <Field label="Life in Spain" value={t.nav?.lifeInSpain || ''} onChange={v => updateConfig(`i18n.${langCode}.nav.lifeInSpain`, v)} />
                  </Section>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Reusable sub-components
function Section({ title, icon, children }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <h5 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
        {icon} {title}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 text-sm resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-400 text-sm"
        />
      )}
    </div>
  );
}