
import React, { useState, useRef } from 'react';
import { ResumeData, Education, SkillCategory, Project, Achievement, Experience, FormattingSettings, TemplateType } from '../types';
import { improveText } from '../services/gemini';
import { Trash2, Plus, Sparkles, ChevronDown, ChevronUp, Bold, Italic, Layout, Settings, Palette, Type } from 'lucide-react';
import { DEFAULT_SETTINGS, AVAILABLE_FONTS } from '../constants';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string | null>('profile');
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  // Settings handler
  const settings = data.settings || DEFAULT_SETTINGS;
  
  const updateSettings = (field: keyof FormattingSettings, value: any) => {
    onChange({ ...data, settings: { ...settings, [field]: value } });
  };

  const updateProfile = (field: keyof typeof data.profile, value: string) => {
    onChange({ ...data, profile: { ...data.profile, [field]: value } });
  };

  const handleEnhanceText = async (text: string, context: string, callback: (newText: string) => void, id: string) => {
    setEnhancingId(id);
    const enhanced = await improveText(text.replace(/<[^>]*>?/gm, ''), context);
    callback(enhanced);
    setEnhancingId(null);
  };

  // --- Education Handlers ---
  const addEducation = () => {
    const newEdu: Education = { id: Date.now().toString(), degree: '', institution: '', year: '', grade: '' };
    onChange({ ...data, education: [...data.education, newEdu] });
  };
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };
  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  // --- Experience Handlers ---
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), company: 'Company Name', role: 'Role', duration: '', description: ['Captured requirements...'] };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    });
  };
  const updateExperienceDesc = (expId: string, index: number, value: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (exp) {
      const newDesc = [...exp.description];
      newDesc[index] = value;
      updateExperience(expId, 'description', newDesc);
    }
  };
  const addExperienceDescLine = (expId: string) => {
    const exp = data.experience.find(e => e.id === expId);
    if (exp) {
      updateExperience(expId, 'description', [...exp.description, '']);
    }
  };
  const removeExperienceDescLine = (expId: string, index: number) => {
    const exp = data.experience.find(e => e.id === expId);
    if (exp) {
      const newDesc = exp.description.filter((_, i) => i !== index);
      updateExperience(expId, 'description', newDesc);
    }
  };
  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  // --- Skill Handlers ---
  const addSkill = () => {
    const newSkill: SkillCategory = { id: Date.now().toString(), name: 'Category', items: '' };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };
  const updateSkill = (id: string, field: keyof SkillCategory, value: string) => {
    onChange({
      ...data,
      skills: data.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    });
  };
  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
  };

  // --- Project Handlers ---
  const addProject = () => {
    const newProj: Project = { id: Date.now().toString(), title: 'New Project', description: ['Description line 1'] };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };
  const updateProject = (id: string, field: keyof Project, value: any) => {
     onChange({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };
  const updateProjectDesc = (projId: string, index: number, value: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (proj) {
      const newDesc = [...proj.description];
      newDesc[index] = value;
      updateProject(projId, 'description', newDesc);
    }
  };
  const addProjectDescLine = (projId: string) => {
    const proj = data.projects.find(p => p.id === projId);
    if (proj) {
      updateProject(projId, 'description', [...proj.description, '']);
    }
  };
  const removeProjectDescLine = (projId: string, index: number) => {
     const proj = data.projects.find(p => p.id === projId);
    if (proj) {
      const newDesc = proj.description.filter((_, i) => i !== index);
      updateProject(projId, 'description', newDesc);
    }
  };
  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  // --- Achievement Handlers ---
  const addAchievement = () => {
    onChange({ ...data, achievements: [...data.achievements, { id: Date.now().toString(), description: '' }] });
  };
  const updateAchievement = (id: string, value: string) => {
    onChange({
      ...data,
      achievements: data.achievements.map(a => a.id === id ? { ...a, description: value } : a)
    });
  };
  const removeAchievement = (id: string) => {
    onChange({ ...data, achievements: data.achievements.filter(a => a.id !== id) });
  };

  const SectionHeader = ({ title, id, icon }: { title: string, id: string, icon?: React.ReactNode }) => (
    <button 
      onClick={() => setActiveSection(activeSection === id ? null : id)}
      className="w-full flex justify-between items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-gray-800">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 overflow-y-auto custom-scrollbar">
      
      <div className="p-6 border-b bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-900">Resume Editor</h2>
      </div>

      {/* Profile Section */}
      <div>
        <SectionHeader title="Profile Information" id="profile" />
        {activeSection === 'profile' && (
          <div className="p-5 bg-white space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RichInput id="prof-name" label="Full Name" value={data.profile.fullName} onChange={(v) => updateProfile('fullName', v)} />
              <RichInput id="prof-phone" label="Phone" value={data.profile.phone} onChange={(v) => updateProfile('phone', v)} />
              <RichInput id="prof-email" label="Email" value={data.profile.email} onChange={(v) => updateProfile('email', v)} />
              <RichInput id="prof-loc" label="Location" value={data.profile.location || ''} onChange={(v) => updateProfile('location', v)} placeholder="City, Country" />
              <RichInput id="prof-li" label="LinkedIn (url)" value={data.profile.linkedin || ''} onChange={(v) => updateProfile('linkedin', v)} placeholder="linkedin.com/in/..." />
              <RichInput id="prof-gh" label="GitHub (url)" value={data.profile.github || ''} onChange={(v) => updateProfile('github', v)} placeholder="github.com/..." />
              <RichInput id="prof-lc" label="LeetCode (url)" value={data.profile.leetcode || ''} onChange={(v) => updateProfile('leetcode', v)} placeholder="leetcode.com/..." />
              <RichInput id="prof-web" label="Portfolio/Website" value={data.profile.website || ''} onChange={(v) => updateProfile('website', v)} placeholder="myportfolio.com" />
            </div>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div>
        <SectionHeader title="Education" id="education" />
        {activeSection === 'education' && (
          <div className="p-5 bg-white space-y-6 animate-fadeIn">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="relative p-4 border border-gray-200 rounded-lg bg-gray-50 group">
                 <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 gap-3">
                  <RichInput id={`edu-deg-${edu.id}`} label="Degree (Course)" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                  <RichInput id={`edu-inst-${edu.id}`} label="Institution (University)" value={edu.institution} onChange={(v) => updateEducation(edu.id, 'institution', v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <RichInput id={`edu-grade-${edu.id}`} label="Grade/CGPA" value={edu.grade} onChange={(v) => updateEducation(edu.id, 'grade', v)} />
                    <RichInput id={`edu-year-${edu.id}`} label="Year (Tenure)" value={edu.year} onChange={(v) => updateEducation(edu.id, 'year', v)} />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addEducation} icon={<Plus size={16} />}>Add Education</Button>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div>
        <SectionHeader title="Experience" id="experience" />
        {activeSection === 'experience' && (
          <div className="p-5 bg-white space-y-8 animate-fadeIn">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="border-l-4 border-orange-500 pl-4 ml-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700">Experience #{idx + 1}</h3>
                  <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                </div>

                <div className="space-y-3 mb-4">
                   <RichInput id={`exp-co-${exp.id}`} label="Company Name" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                   <RichInput id={`exp-role-${exp.id}`} label="Role / Title" value={exp.role} onChange={(v) => updateExperience(exp.id, 'role', v)} />
                   <div className="grid grid-cols-2 gap-3">
                      <RichInput id={`exp-dur-${exp.id}`} label="Duration" value={exp.duration} onChange={(v) => updateExperience(exp.id, 'duration', v)} placeholder="Jan 2023 - Present" />
                      <RichInput id={`exp-loc-${exp.id}`} label="Location" value={exp.location || ''} onChange={(v) => updateExperience(exp.id, 'location', v)} placeholder="New York, NY" />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase">Bullet Points</label>
                  {exp.description.map((desc, dIdx) => (
                    <div key={dIdx} className="flex gap-2 items-start">
                      <RichTextArea 
                        id={`exp-${exp.id}-${dIdx}`}
                        value={desc}
                        onChange={(val) => updateExperienceDesc(exp.id, dIdx, val)}
                        onEnhance={() => handleEnhanceText(desc, 'Job Description Bullet Point', (val) => updateExperienceDesc(exp.id, dIdx, val), `exp-${exp.id}-${dIdx}`)}
                        isEnhancing={enhancingId === `exp-${exp.id}-${dIdx}`}
                      />
                      <button onClick={() => removeExperienceDescLine(exp.id, dIdx)} className="mt-2 text-gray-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addExperienceDescLine(exp.id)} className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Bullet Point
                  </button>
                </div>
              </div>
            ))}
            <Button onClick={addExperience} icon={<Plus size={16} />}>Add Experience</Button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <SectionHeader title="Skills" id="skills" />
        {activeSection === 'skills' && (
          <div className="p-5 bg-white space-y-4 animate-fadeIn">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex gap-3 items-start">
                <div className="w-1/3">
                  <RichInput id={`skill-name-${skill.id}`} value={skill.name} onChange={(v) => updateSkill(skill.id, 'name', v)} placeholder="Category" />
                </div>
                <div className="w-2/3">
                   <RichTextArea 
                        id={`skill-items-${skill.id}`}
                        value={skill.items}
                        onChange={(val) => updateSkill(skill.id, 'items', val)}
                        onEnhance={() => {}}
                        isEnhancing={false}
                        rows={2}
                      />
                </div>
                <button onClick={() => removeSkill(skill.id)} className="mt-2 text-gray-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
             <Button onClick={addSkill} icon={<Plus size={16} />}>Add Skill Category</Button>
          </div>
        )}
      </div>

       {/* Projects Section */}
       <div>
        <SectionHeader title="Projects" id="projects" />
        {activeSection === 'projects' && (
          <div className="p-5 bg-white space-y-8 animate-fadeIn">
            {data.projects.map((proj) => (
              <div key={proj.id} className="border-l-4 border-blue-500 pl-4 ml-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-700">Project #{data.projects.indexOf(proj) + 1}</h3>
                  <button onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                </div>
                
                <div className="space-y-3 mb-4">
                   <RichInput id={`proj-title-${proj.id}`} label="Project Title" value={proj.title} onChange={(v) => updateProject(proj.id, 'title', v)} />
                   <div className="grid grid-cols-2 gap-3">
                      <RichInput id={`proj-gh-${proj.id}`} label="GitHub Link" value={proj.githubLink || ''} onChange={(v) => updateProject(proj.id, 'githubLink', v)} placeholder="github.com/..." />
                      <RichInput id={`proj-demo-${proj.id}`} label="Demo Link" value={proj.demoLink || ''} onChange={(v) => updateProject(proj.id, 'demoLink', v)} placeholder="your-app.com" />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase">Bullet Points</label>
                  {proj.description.map((desc, dIdx) => (
                    <div key={dIdx} className="flex gap-2 items-start">
                      <RichTextArea 
                        id={`proj-${proj.id}-${dIdx}`}
                        value={desc}
                        onChange={(val) => updateProjectDesc(proj.id, dIdx, val)}
                        onEnhance={() => handleEnhanceText(desc, 'Project Description', (val) => updateProjectDesc(proj.id, dIdx, val), `proj-${proj.id}-${dIdx}`)}
                        isEnhancing={enhancingId === `proj-${proj.id}-${dIdx}`}
                      />
                      <button onClick={() => removeProjectDescLine(proj.id, dIdx)} className="mt-2 text-gray-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addProjectDescLine(proj.id)} className="text-blue-600 text-sm hover:underline flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Bullet Point
                  </button>
                </div>
              </div>
            ))}
            <Button onClick={addProject} icon={<Plus size={16} />}>Add Project</Button>
          </div>
        )}
      </div>

       {/* Achievements Section */}
       <div>
        <SectionHeader title="Achievements" id="achievements" />
        {activeSection === 'achievements' && (
          <div className="p-5 bg-white space-y-4 animate-fadeIn">
            {data.achievements.map((ach) => (
               <div key={ach.id} className="flex gap-2 items-start">
                 <RichTextArea 
                    id={`ach-${ach.id}`}
                    value={ach.description}
                    onChange={(val) => updateAchievement(ach.id, val)}
                    onEnhance={() => handleEnhanceText(ach.description, 'Professional Achievement', (val) => updateAchievement(ach.id, val), ach.id)}
                    isEnhancing={enhancingId === ach.id}
                  />
                 <button onClick={() => removeAchievement(ach.id)} className="mt-2 text-gray-300 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
               </div>
            ))}
            <Button onClick={addAchievement} icon={<Plus size={16} />}>Add Achievement</Button>
          </div>
        )}
      </div>

      <div className="mt-8 mb-4 flex items-center justify-center">
          <div className="h-px w-full bg-gray-200"></div>
          <span className="px-4 text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Theme & Layout</span>
          <div className="h-px w-full bg-gray-200"></div>
      </div>

      {/* Layout Settings */}
      <div>
        <SectionHeader title="Layout & Formatting" id="settings" icon={<Layout size={16} className="text-gray-500"/>} />
        {activeSection === 'settings' && (
          <div className="p-5 bg-white space-y-6 animate-fadeIn">
            
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Page Margins (mm)</h4>
              <div className="grid grid-cols-2 gap-4">
                <RangeInput label="Top Margin" value={settings.marginTop} min={0} max={50} onChange={(v) => updateSettings('marginTop', v)} />
                <RangeInput label="Bottom Margin" value={settings.marginBottom} min={0} max={50} onChange={(v) => updateSettings('marginBottom', v)} />
                <RangeInput label="Left Margin" value={settings.marginLeft} min={0} max={50} onChange={(v) => updateSettings('marginLeft', v)} />
                <RangeInput label="Right Margin" value={settings.marginRight} min={0} max={50} onChange={(v) => updateSettings('marginRight', v)} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Spacing & Density</h4>
              <div className="space-y-4">
                <RangeInput label="Line Height (Density)" value={settings.lineHeight} min={1.0} max={2.0} step={0.1} onChange={(v) => updateSettings('lineHeight', v)} />
                <RangeInput label="Space Between Sections (mm)" value={settings.sectionSpacing} min={0} max={20} onChange={(v) => updateSettings('sectionSpacing', v)} />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Design & Templates */}
      <div>
        <SectionHeader title="Design & Templates" id="design" icon={<Palette size={16} className="text-purple-500"/>} />
        {activeSection === 'design' && (
          <div className="p-5 bg-white space-y-6 animate-fadeIn">
             
             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Template</label>
                <select 
                  value={settings.template || TemplateType.ADMIN_CLASSICAL}
                  onChange={(e) => updateSettings('template', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={TemplateType.ADMIN_CLASSICAL}>Admin's Classical (Default)</option>
                  <option value={TemplateType.MODERN_SIDEBAR}>Modern Sidebar</option>
                  <option value={TemplateType.MINIMALIST}>Minimalist Clean</option>
                  <option value={TemplateType.EXECUTIVE_COLUMN}>Executive Column</option>
                  <option value={TemplateType.CREATIVE_HEADER}>Creative Header</option>
                </select>
             </div>

             <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Global Font</label>
                <select 
                  value={settings.font}
                  onChange={(e) => updateSettings('font', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {AVAILABLE_FONTS.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Page Color</label>
                  <div className="flex items-center gap-2">
                     <input type="color" value={settings.backgroundColor} onChange={(e) => updateSettings('backgroundColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                     <span className="text-xs text-gray-500">{settings.backgroundColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Accent Color</label>
                  <div className="flex items-center gap-2">
                     <input type="color" value={settings.accentColor} onChange={(e) => updateSettings('accentColor', e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0" />
                     <span className="text-xs text-gray-500">{settings.accentColor}</span>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

    </div>
  );
};

// --- UI Components ---

const RangeInput = ({ label, value, onChange, min, max, step = 1 }: { label: string, value: number, onChange: (val: number) => void, min: number, max: number, step?: number }) => (
  <div className="w-full">
     <div className="flex justify-between mb-1">
       <label className="block text-xs font-medium text-gray-500 uppercase">{label}</label>
       <span className="text-xs text-gray-600 font-mono">{value}</span>
     </div>
     <input 
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
     />
  </div>
);

// Enhanced Input for "Every Field" Formatting
const RichInput = ({ label, value, onChange, placeholder, id }: { label?: string, value: string, onChange: (val: string) => void, placeholder?: string, id: string }) => {
    const [showFonts, setShowFonts] = useState(false);
    
    const handleFormat = (type: 'bold' | 'italic' | 'font', fontValue?: string) => {
        const input = document.getElementById(id) as HTMLTextAreaElement;
        if (!input) return;
        
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;

        if (start === end) return; 

        const selectedText = text.substring(start, end);
        let newText = '';
        let offset = 0;

        if (type === 'bold') {
            newText = text.substring(0, start) + `<b>${selectedText}</b>` + text.substring(end);
            offset = 7; 
        } else if (type === 'italic') {
            newText = text.substring(0, start) + `<i>${selectedText}</i>` + text.substring(end);
            offset = 7; 
        } else if (type === 'font' && fontValue) {
            newText = text.substring(0, start) + `<span style="font-family: ${fontValue}">${selectedText}</span>` + text.substring(end);
            offset = 28 + fontValue.length + 7; 
        }
        
        onChange(newText);
        setShowFonts(false);
        
        setTimeout(() => {
            input.focus();
            input.setSelectionRange(start, end + offset); 
        }, 0);
    };

    return (
      <div className={`w-full group relative ${showFonts ? 'z-30' : 'z-0'}`}>
        {label && <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{label}</label>}
        
        <textarea 
          id={id}
          rows={1}
          className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none overflow-hidden whitespace-nowrap custom-scrollbar"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: '38px' }} // Match input height
        />
        
        {/* Hover Toolbar */}
        <div className="absolute top-0 right-0 flex bg-white border border-gray-200 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 transform -translate-y-1/2 translate-x-[-5px]">
            <button 
                onClick={() => handleFormat('bold')} 
                className="p-1 hover:bg-gray-100 text-gray-600" 
                title="Bold Selection"
            >
                <Bold size={12} />
            </button>
            <button 
                onClick={() => handleFormat('italic')} 
                className="p-1 hover:bg-gray-100 text-gray-600" 
                title="Italic Selection"
            >
                <Italic size={12} />
            </button>
            <div className="relative">
                <button 
                    onClick={() => setShowFonts(!showFonts)} 
                    className="p-1 hover:bg-gray-100 text-gray-600" 
                    title="Change Font"
                >
                    <Type size={12} />
                </button>
                {showFonts && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded z-50 py-1 text-xs">
                        {AVAILABLE_FONTS.map((font) => (
                            <button 
                                key={font.name}
                                onClick={() => handleFormat('font', font.value)}
                                className="block w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 truncate"
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    );
};

const RichTextArea = ({ id, value, onChange, onEnhance, isEnhancing, rows = 3 }: { 
  id: string, 
  value: string, 
  onChange: (val: string) => void, 
  onEnhance: () => void, 
  isEnhancing: boolean,
  rows?: number
}) => {
  const [showFonts, setShowFonts] = useState(false);
  
  const handleFormat = (type: 'bold' | 'italic' | 'font', fontValue?: string) => {
        const input = document.getElementById(id) as HTMLTextAreaElement;
        if (!input) return;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const text = input.value;
        if (start === end) return; 

        const selectedText = text.substring(start, end);
        let newText = '';
        if (type === 'bold') {
            newText = text.substring(0, start) + `<b>${selectedText}</b>` + text.substring(end);
        } else if (type === 'italic') {
            newText = text.substring(0, start) + `<i>${selectedText}</i>` + text.substring(end);
        } else if (type === 'font' && fontValue) {
            newText = text.substring(0, start) + `<span style="font-family: ${fontValue}">${selectedText}</span>` + text.substring(end);
        }
        onChange(newText);
        setShowFonts(false);
  };

  return (
  <div className={`flex-1 relative group ${showFonts ? 'z-30' : 'z-0'}`}>
    <textarea 
      id={id}
      className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
    />
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-0.5 rounded border border-gray-100">
        <button 
          onClick={() => handleFormat('bold')}
          className="bg-gray-50 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
          title="Bold Selection"
        >
          <Bold size={14} />
        </button>
        <button 
          onClick={() => handleFormat('italic')}
          className="bg-gray-50 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
          title="Italic Selection"
        >
          <Italic size={14} />
        </button>
         <div className="relative">
            <button 
                onClick={() => setShowFonts(!showFonts)} 
                className="bg-gray-50 text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors" 
                title="Change Font"
            >
                <Type size={14} />
            </button>
            {showFonts && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 shadow-lg rounded z-50 py-1 text-xs">
                    {AVAILABLE_FONTS.map((font) => (
                        <button 
                            key={font.name}
                            onClick={() => handleFormat('font', font.value)}
                            className="block w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 truncate"
                            style={{ fontFamily: font.value }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <button 
          onClick={onEnhance}
          className="bg-purple-50 text-purple-600 p-1 rounded hover:bg-purple-100 transition-colors"
          title="Enhance with AI"
        >
          {isEnhancing ? <div className="animate-spin h-3.5 w-3.5 border-2 border-purple-600 rounded-full border-t-transparent"></div> : <Sparkles size={14} />}
        </button>
    </div>
  </div>
  );
};

const Button = ({ onClick, children, icon }: { onClick: () => void, children?: React.ReactNode, icon?: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm bg-white"
  >
    {icon} {children}
  </button>
);
