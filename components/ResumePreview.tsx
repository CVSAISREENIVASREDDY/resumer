
import React from 'react';
import { ResumeData, TemplateType } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
}

// Helper to render HTML safely (for bold text and font styles)
const RichText: React.FC<{ text: string }> = ({ text }) => (
  <span dangerouslySetInnerHTML={{ __html: text || '' }} />
);

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, scale = 1 }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  
  // Apply Global Styles
  const containerStyle: React.CSSProperties = {
    width: '210mm', // A4 Width
    minHeight: '297mm', // A4 Height
    transform: `scale(${scale})`,
    fontFamily: settings.font || 'Arial, sans-serif',
    fontSize: '10.5pt',
    lineHeight: settings.lineHeight,
    backgroundColor: settings.backgroundColor || '#FFFFFF',
    color: '#000000',
  };

  // Render the selected template
  return (
    <div 
      className="shadow-lg print-container origin-top mx-auto"
      style={containerStyle}
    >
      {settings.template === TemplateType.MODERN_SIDEBAR ? (
        <ModernTemplate data={data} />
      ) : settings.template === TemplateType.MINIMALIST ? (
        <MinimalTemplate data={data} />
      ) : settings.template === TemplateType.EXECUTIVE_COLUMN ? (
        <ExecutiveTemplate data={data} />
      ) : settings.template === TemplateType.CREATIVE_HEADER ? (
        <CreativeTemplate data={data} />
      ) : (
        <ClassicalTemplate data={data} />
      )}
    </div>
  );
};

// --- Templates ---

// 1. Admin's Classical Template
const ClassicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  const paddingStyle = {
    paddingTop: `${settings.marginTop}mm`,
    paddingRight: `${settings.marginRight}mm`,
    paddingBottom: `${settings.marginBottom}mm`,
    paddingLeft: `${settings.marginLeft}mm`,
  };
  const sectionMb = { marginBottom: `${settings.sectionSpacing}mm` };
  const accentStyle = { color: settings.accentColor !== '#000000' ? settings.accentColor : undefined };
  const lhStyle = { lineHeight: settings.lineHeight };

  return (
    <div style={paddingStyle} className="h-full">
      {/* Header */}
      <div className="text-center mb-5">
        {/* Removed uppercase class here to respect user typing */}
        <h1 className="text-3xl font-bold tracking-wide mb-2" style={accentStyle}>
            <RichText text={data.profile.fullName} />
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 text-sm mb-1" style={lhStyle}>
          {data.profile.phone && (
            <a href={`tel:${data.profile.phone}`} className="hover:underline text-inherit"><RichText text={data.profile.phone} /></a>
          )}
          {data.profile.email && (
             <a href={`mailto:${data.profile.email}`} className="hover:underline text-inherit"><RichText text={data.profile.email} /></a>
          )}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-3 text-sm text-blue-700 font-medium" style={lhStyle}>
          {data.profile.linkedin && (
            <>
              <a href={`https://${data.profile.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline" style={accentStyle}>LinkedIn</a>
              {(data.profile.github || data.profile.leetcode || data.profile.website) && <span className="text-black">•</span>}
            </>
          )}

          {data.profile.github && (
            <>
              <a href={`https://${data.profile.github}`} target="_blank" rel="noreferrer" className="hover:underline" style={accentStyle}>GitHub</a>
              {(data.profile.leetcode || data.profile.website) && <span className="text-black">•</span>}
            </>
          )}

          {data.profile.leetcode && (
            <>
              <a href={`https://${data.profile.leetcode}`} target="_blank" rel="noreferrer" className="hover:underline" style={accentStyle}>LeetCode</a>
              {data.profile.website && <span className="text-black">•</span>}
            </>
          )}
          
          {data.profile.website && (
            <a href={`https://${data.profile.website}`} target="_blank" rel="noreferrer" className="hover:underline" style={accentStyle}>Portfolio</a>
          )}
        </div>
      </div>

      {/* Education */}
      <div style={sectionMb}>
        <h2 className="font-bold text-lg border-b border-black mb-2 uppercase tracking-wider text-sm" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Education</h2>
        <div className="flex flex-col gap-1">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-sm w-full" style={lhStyle}>
              <div className="flex-1">
                 <span className="font-bold"><RichText text={edu.degree} /></span>
                 {edu.institution && <span>, <RichText text={edu.institution} /></span>}
                 {edu.year && <span>, (<RichText text={edu.year} />)</span>}
              </div>
              <div className="whitespace-nowrap font-medium ml-4">
                 <RichText text={edu.grade} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={sectionMb}>
        <h2 className="font-bold text-lg border-b border-black mb-2 uppercase tracking-wider text-sm" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Skills</h2>
        <div className="flex flex-col gap-1 text-sm">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex" style={lhStyle}>
              <span className="font-bold min-w-[140px] w-[140px]"><RichText text={skill.name} /></span>
              <span className="px-2">:</span>
              <span className="flex-1"><RichText text={skill.items} /></span>
            </div>
          ))}
        </div>
      </div>

       {/* Experience */}
       {data.experience.length > 0 && (
        <div style={sectionMb}>
          <h2 className="font-bold text-lg border-b border-black mb-2 uppercase tracking-wider text-sm" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Experience</h2>
          <div className="flex flex-col gap-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1" style={lhStyle}>
                  <div className="font-bold text-base">
                    <RichText text={exp.company} /> <span className="font-medium italic text-gray-800" style={{ color: settings.accentColor }}> - <RichText text={exp.role} /></span>
                  </div>
                  <div className="text-sm font-medium whitespace-nowrap">
                     <RichText text={exp.duration} />
                  </div>
                </div>
                {exp.location && <div className="text-xs text-gray-600 mb-1 italic"><RichText text={exp.location} /></div>}
                <ul className="list-disc ml-5 text-sm text-justify" style={lhStyle}>
                  {exp.description.map((desc, idx) => (
                    <li key={idx}>
                      <RichText text={desc} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div style={sectionMb}>
        <h2 className="font-bold text-lg border-b border-black mb-2 uppercase tracking-wider text-sm" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Projects</h2>
        <div className="flex flex-col gap-3">
          {data.projects.map((project) => (
            <div key={project.id}>
              <div className="flex justify-between items-baseline mb-1" style={lhStyle}>
                <span className="font-bold text-base"><RichText text={project.title} /></span>
                <div className="text-sm text-blue-700 font-medium whitespace-nowrap">
                   {project.demoLink && <a href={`https://${project.demoLink}`} target="_blank" rel="noreferrer" className="hover:underline mr-3" style={accentStyle}>App</a>}
                   {project.githubLink && <a href={`https://${project.githubLink}`} target="_blank" rel="noreferrer" className="hover:underline" style={accentStyle}>GitHub</a>}
                </div>
              </div>
              <ul className="list-disc ml-5 text-sm text-justify" style={lhStyle}>
                {project.description.map((desc, idx) => (
                  <li key={idx}>
                    <RichText text={desc} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div style={sectionMb}>
        <h2 className="font-bold text-lg border-b border-black mb-2 uppercase tracking-wider text-sm" style={{ borderColor: settings.accentColor, color: settings.accentColor }}>Achievements</h2>
        <ul className="list-disc ml-5 text-sm" style={lhStyle}>
          {data.achievements.map((ach) => (
             <li key={ach.id}><RichText text={ach.description} /></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 2. Modern Sidebar Template
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  const accentColor = settings.accentColor || '#2563eb';
  const lhStyle = { lineHeight: settings.lineHeight };

  return (
    <div className="flex h-full min-h-[297mm]">
      {/* Sidebar */}
      <div className="w-[35%] text-white p-6 flex flex-col gap-6" style={{ backgroundColor: '#2c3e50', ...lhStyle }}>
         <div className="mb-4">
            <h1 className="text-2xl font-bold leading-tight mb-2"><RichText text={data.profile.fullName} /></h1>
            <div className="text-xs opacity-90 space-y-1">
              {data.profile.email && <div><RichText text={data.profile.email} /></div>}
              {data.profile.phone && <div><RichText text={data.profile.phone} /></div>}
              {data.profile.location && <div><RichText text={data.profile.location} /></div>}
            </div>
         </div>

         {/* Links */}
         <div className="text-xs space-y-2">
            <h3 className="font-bold uppercase border-b border-white/30 pb-1 mb-2">Links</h3>
            {data.profile.linkedin && <div className="truncate"><a href={`https://${data.profile.linkedin}`} className="hover:underline">LinkedIn</a></div>}
            {data.profile.github && <div className="truncate"><a href={`https://${data.profile.github}`} className="hover:underline">GitHub</a></div>}
            {data.profile.website && <div className="truncate"><a href={`https://${data.profile.website}`} className="hover:underline">Portfolio</a></div>}
         </div>

         {/* Skills in Sidebar */}
         <div>
            <h3 className="font-bold uppercase border-b border-white/30 pb-1 mb-2">Skills</h3>
            <div className="flex flex-col gap-3 text-xs">
              {data.skills.map(skill => (
                <div key={skill.id}>
                  <div className="font-bold opacity-80"><RichText text={skill.name} /></div>
                  <div className="opacity-90"><RichText text={skill.items}/></div>
                </div>
              ))}
            </div>
         </div>

         {/* Education in Sidebar */}
         <div>
            <h3 className="font-bold uppercase border-b border-white/30 pb-1 mb-2">Education</h3>
            <div className="flex flex-col gap-3 text-xs">
               {data.education.map(edu => (
                 <div key={edu.id}>
                    <div className="font-bold"><RichText text={edu.degree} /></div>
                    <div><RichText text={edu.institution} /></div>
                    <div className="italic opacity-75"><RichText text={edu.year} /></div>
                    {edu.grade && <div><RichText text={edu.grade} /></div>}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-8" style={{ paddingTop: `${settings.marginTop}mm`, paddingRight: `${settings.marginRight}mm`, ...lhStyle }}>
         
         {/* Experience */}
         {data.experience.length > 0 && (
           <div className="mb-8">
              <h2 className="text-xl font-bold uppercase mb-4 border-b-2 pb-1" style={{ color: accentColor, borderColor: accentColor }}>Experience</h2>
              <div className="flex flex-col gap-5">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-gray-800">
                      <span><RichText text={exp.company} /></span>
                      <span className="text-sm font-normal"><RichText text={exp.duration} /></span>
                    </div>
                    <div className="text-sm italic mb-1 font-medium" style={{ color: accentColor }}><RichText text={exp.role} /></div>
                    <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                      {exp.description.map((desc, i) => <li key={i}><RichText text={desc}/></li>)}
                    </ul>
                  </div>
                ))}
              </div>
           </div>
         )}

         {/* Projects */}
         <div className="mb-8">
            <h2 className="text-xl font-bold uppercase mb-4 border-b-2 pb-1" style={{ color: accentColor, borderColor: accentColor }}>Projects</h2>
            <div className="flex flex-col gap-5">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline font-bold text-gray-800">
                      <span><RichText text={proj.title} /></span>
                      <div className="text-xs space-x-2">
                        {proj.demoLink && <a href={`https://${proj.demoLink}`} className="text-blue-600 hover:underline">App</a>}
                        {proj.githubLink && <a href={`https://${proj.githubLink}`} className="text-blue-600 hover:underline">Code</a>}
                      </div>
                    </div>
                    <ul className="list-disc ml-4 text-sm text-gray-700 mt-1 space-y-1">
                      {proj.description.map((desc, i) => <li key={i}><RichText text={desc}/></li>)}
                    </ul>
                  </div>
                ))}
            </div>
         </div>

         {/* Achievements */}
         <div>
            <h2 className="text-xl font-bold uppercase mb-4 border-b-2 pb-1" style={{ color: accentColor, borderColor: accentColor }}>Achievements</h2>
            <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {data.achievements.map(ach => (
                  <li key={ach.id}><RichText text={ach.description}/></li>
                ))}
            </ul>
         </div>

      </div>
    </div>
  );
};

// 3. Minimalist Template
const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  const paddingStyle = {
    paddingTop: `${settings.marginTop}mm`,
    paddingRight: `${settings.marginRight}mm`,
    paddingBottom: `${settings.marginBottom}mm`,
    paddingLeft: `${settings.marginLeft}mm`,
  };
  const accentStyle = { color: settings.accentColor !== '#000000' ? settings.accentColor : undefined };
  const lhStyle = { lineHeight: settings.lineHeight };

  return (
    <div style={paddingStyle} className="h-full max-w-[90%] mx-auto">
       {/* Centered Minimal Header */}
       <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tighter mb-2"><RichText text={data.profile.fullName} /></h1>
          <div className="flex justify-center gap-4 text-sm text-gray-500 tracking-wide" style={lhStyle}>
             <RichText text={data.profile.email} /> <span>|</span> <RichText text={data.profile.phone} />
          </div>
          <div className="flex justify-center gap-4 text-xs text-gray-400 uppercase tracking-widest mt-2">
             {data.profile.linkedin && <a href={`https://${data.profile.linkedin}`}>LinkedIn</a>}
             {data.profile.github && <a href={`https://${data.profile.github}`}>GitHub</a>}
          </div>
       </div>

       {/* Sections Grid */}
       <div className="space-y-8">
          
          {/* Education */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Education</h3>
             <div className="space-y-3">
                {data.education.map(edu => (
                   <div key={edu.id} className="grid grid-cols-[1fr_auto] gap-4" style={lhStyle}>
                      <div>
                         <div className="font-medium" style={accentStyle}><RichText text={edu.degree} /></div>
                         <div className="text-sm text-gray-600"><RichText text={edu.institution} /></div>
                      </div>
                      <div className="text-right">
                         <div className="text-sm font-medium"><RichText text={edu.year} /></div>
                         <div className="text-xs text-gray-500"><RichText text={edu.grade} /></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Skills */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Skills</h3>
             <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                   <div key={skill.id} className="border border-gray-200 rounded px-3 py-1 text-sm">
                      <span className="font-medium mr-2" style={accentStyle}><RichText text={skill.name} />:</span>
                      <span className="text-gray-600"><RichText text={skill.items}/></span>
                   </div>
                ))}
             </div>
          </div>

          {/* Experience */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Experience</h3>
             <div className="space-y-6">
                {data.experience.map(exp => (
                   <div key={exp.id} style={lhStyle}>
                      <div className="flex justify-between items-baseline mb-2">
                         <h4 className="font-serif text-lg" style={accentStyle}><RichText text={exp.company} /></h4>
                         <span className="text-sm text-gray-400"><RichText text={exp.duration} /></span>
                      </div>
                      <div className="text-sm font-medium mb-2"><RichText text={exp.role} /></div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         {exp.description.join(" ")} 
                      </p>
                   </div>
                ))}
             </div>
          </div>
          
          {/* Projects */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Selected Projects</h3>
             <div className="grid grid-cols-1 gap-6">
                {data.projects.map(proj => (
                   <div key={proj.id} style={lhStyle}>
                      <div className="flex items-baseline gap-2 mb-1">
                         <span className="font-medium" style={accentStyle}><RichText text={proj.title} /></span>
                         {proj.githubLink && <a href={`https://${proj.githubLink}`} className="text-xs text-gray-400 hover:text-black">[Code]</a>}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                         {proj.description[0]}
                      </p>
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
};

// 4. Executive Column Template
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  const paddingStyle = {
    paddingTop: `${settings.marginTop}mm`,
    paddingRight: `${settings.marginRight}mm`,
    paddingBottom: `${settings.marginBottom}mm`,
    paddingLeft: `${settings.marginLeft}mm`,
  };
  const lhStyle = { lineHeight: settings.lineHeight };
  const accentStyle = { color: settings.accentColor !== '#000000' ? settings.accentColor : '#2d3748' };

  return (
    <div style={paddingStyle} className="h-full">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6" style={{ borderColor: accentStyle.color }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900"><RichText text={data.profile.fullName} /></h1>
        <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-600">
          {data.profile.email && <span>{data.profile.email}</span>}
          {data.profile.phone && <span>| {data.profile.phone}</span>}
          {data.profile.linkedin && <span>| LinkedIn: {data.profile.linkedin}</span>}
          {data.profile.location && <span>| {data.profile.location}</span>}
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Column (Main) */}
        <div className="w-[70%] space-y-6">
           {/* Experience */}
           <div>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={accentStyle}>
                Professional Experience
              </h2>
              <div className="space-y-5">
                {data.experience.map(exp => (
                  <div key={exp.id} style={lhStyle}>
                    <div className="flex justify-between items-baseline font-bold text-gray-800">
                       <RichText text={exp.company} />
                       <span className="text-sm font-medium text-gray-500"><RichText text={exp.duration} /></span>
                    </div>
                    <div className="text-sm font-semibold mb-2 text-gray-700"><RichText text={exp.role} /></div>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                       {exp.description.map((desc, i) => <li key={i}><RichText text={desc}/></li>)}
                    </ul>
                  </div>
                ))}
              </div>
           </div>

           {/* Projects */}
           <div>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={accentStyle}>
                Key Projects
              </h2>
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <div key={proj.id} style={lhStyle}>
                    <div className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <RichText text={proj.title} />
                      {proj.githubLink && <a href={`https://${proj.githubLink}`} className="text-xs text-blue-600 font-normal underline">GitHub</a>}
                    </div>
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                       {proj.description.map((desc, i) => <li key={i}><RichText text={desc}/></li>)}
                    </ul>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Right Column (Side) */}
        <div className="w-[30%] space-y-6">
           {/* Skills */}
           <div>
             <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={accentStyle}>Skills</h2>
             <div className="space-y-3 text-sm text-gray-600">
               {data.skills.map(skill => (
                 <div key={skill.id}>
                   <div className="font-bold text-gray-800"><RichText text={skill.name} /></div>
                   <div><RichText text={skill.items} /></div>
                 </div>
               ))}
             </div>
           </div>

           {/* Education */}
           <div>
             <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={accentStyle}>Education</h2>
             <div className="space-y-4 text-sm">
               {data.education.map(edu => (
                 <div key={edu.id}>
                   <div className="font-bold text-gray-800"><RichText text={edu.degree} /></div>
                   <div className="text-gray-600"><RichText text={edu.institution} /></div>
                   <div className="text-xs text-gray-500 mt-1"><RichText text={edu.year} /></div>
                 </div>
               ))}
             </div>
           </div>

           {/* Achievements */}
           <div>
             <h2 className="text-lg font-bold uppercase tracking-wider mb-4" style={accentStyle}>Awards</h2>
             <ul className="list-disc ml-4 text-sm text-gray-600 space-y-2">
               {data.achievements.map(ach => (
                 <li key={ach.id}><RichText text={ach.description} /></li>
               ))}
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

// 5. Creative Header Template
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const settings = data.settings || DEFAULT_SETTINGS;
  const accentColor = settings.accentColor !== '#000000' ? settings.accentColor : '#7c3aed';
  const lhStyle = { lineHeight: settings.lineHeight };
  
  return (
    <div className="h-full bg-white">
      {/* Colored Header Block */}
      <div className="p-8 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-4xl font-bold mb-2"><RichText text={data.profile.fullName} /></h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
           {data.profile.phone && <span>{data.profile.phone}</span>}
           {data.profile.email && <span>{data.profile.email}</span>}
           {data.profile.location && <span>{data.profile.location}</span>}
        </div>
        <div className="flex gap-4 mt-4 text-xs font-bold uppercase tracking-wider opacity-80">
            {data.profile.linkedin && <a href={`https://${data.profile.linkedin}`} className="hover:text-white border-b border-transparent hover:border-white transition">LinkedIn</a>}
            {data.profile.github && <a href={`https://${data.profile.github}`} className="hover:text-white border-b border-transparent hover:border-white transition">GitHub</a>}
            {data.profile.website && <a href={`https://${data.profile.website}`} className="hover:text-white border-b border-transparent hover:border-white transition">Portfolio</a>}
        </div>
      </div>

      <div className="p-8 space-y-6" style={{ 
          paddingTop: `${settings.marginTop}mm`, 
          paddingRight: `${settings.marginRight}mm`, 
          paddingBottom: `${settings.marginBottom}mm`, 
          paddingLeft: `${settings.marginLeft}mm`
      }}>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-1 gap-2">
           <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 rounded" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">Technical Skills</h2>
           </div>
           <div className="grid grid-cols-1 gap-y-1 text-sm" style={lhStyle}>
              {data.skills.map(skill => (
                  <div key={skill.id} className="flex gap-2">
                     <span className="font-bold text-gray-700 min-w-[120px]"><RichText text={skill.name} />:</span>
                     <span className="text-gray-600"><RichText text={skill.items} /></span>
                  </div>
              ))}
           </div>
        </div>

        {/* Experience */}
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-8 rounded" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">Experience</h2>
           </div>
           <div className="space-y-6 pl-2 border-l-2 border-gray-100">
              {data.experience.map(exp => (
                <div key={exp.id} className="relative pl-6" style={lhStyle}>
                   {/* Dot on timeline */}
                   <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full border-4 border-white" style={{ backgroundColor: accentColor }}></div>
                   
                   <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800 text-lg"><RichText text={exp.company} /></h3>
                      <span className="text-sm font-semibold text-gray-400"><RichText text={exp.duration} /></span>
                   </div>
                   <div className="text-sm font-medium mb-2" style={{ color: accentColor }}><RichText text={exp.role} /></div>
                   <ul className="list-none text-sm text-gray-600 space-y-1">
                      {exp.description.map((desc, i) => <li key={i} className="relative pl-3 before:content-['-'] before:absolute before:left-0 before:text-gray-400"><RichText text={desc}/></li>)}
                   </ul>
                </div>
              ))}
           </div>
        </div>

        {/* Education & Projects Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Education */}
           <div>
              <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 rounded" style={{ backgroundColor: accentColor }}></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">Education</h2>
              </div>
              <div className="space-y-4">
                 {data.education.map(edu => (
                   <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: accentColor }}>
                      <div className="font-bold text-gray-800"><RichText text={edu.degree} /></div>
                      <div className="text-sm text-gray-600"><RichText text={edu.institution} /></div>
                      <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
                         <span><RichText text={edu.year} /></span>
                         <span><RichText text={edu.grade} /></span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Projects */}
           <div>
              <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-8 rounded" style={{ backgroundColor: accentColor }}></div>
                  <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">Projects</h2>
              </div>
              <div className="space-y-4">
                 {data.projects.slice(0, 2).map(proj => (
                   <div key={proj.id} className="space-y-1" style={lhStyle}>
                      <div className="font-bold text-gray-800"><RichText text={proj.title} /></div>
                      <p className="text-xs text-gray-600 line-clamp-2">{proj.description[0]}</p>
                      {proj.githubLink && <a href={`https://${proj.githubLink}`} className="text-xs hover:underline" style={{ color: accentColor }}>View Code &rarr;</a>}
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
