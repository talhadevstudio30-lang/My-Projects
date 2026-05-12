import React from 'react';
import Favicon from './Favicon';

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString();
};

const getProjectUrl = (project) => {
  return project.targets?.production?.alias?.[0] || null;
};

const getScreenshotUrl = (projectId, screenshots) => {
  return screenshots[projectId] || null;
};

const ProjectCard = ({ project, screenshots, iconErrors, handleIconError, onOpenDetail }) => {
  const latestDeploy = project.latestDeployments?.[0];
  const projectUrl = getProjectUrl(project);
  const screenshotUrl = getScreenshotUrl(project.id, screenshots);

  return (
    <div
      onClick={() => onOpenDetail(project)}
      className="group relative
        backdrop-blur-xl bg-white/25
        rounded-2xl overflow-hidden flex flex-col h-full
        border border-white/50
        shadow-[0_4px_24px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]
        hover:shadow-[0_8px_32px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]
        hover:bg-white/35 hover:border-white/70
        transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
    >
      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />

      {/* Screenshot / Preview */}
      <div className="relative h-60 overflow-hidden border-b border-white/30">
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={`${project.name} screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-50/60 to-purple-50/60 backdrop-blur-sm flex items-center justify-center">
            <Favicon project={project} size="large" iconErrors={iconErrors} handleIconError={handleIconError} />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`
    relative px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest
    backdrop-blur-md
    before:absolute before:inset-0 before:rounded-full
    before:bg-gradient-to-b before:from-white/40 before:to-transparent before:pointer-events-none
    ${latestDeploy?.readyState === 'READY'
              ? `bg-gradient-to-br from-green-300/20 via-emerald-200/15 to-green-400/10
         text-emerald-700
         border border-green-300/40
         shadow-[0_2px_12px_rgba(52,211,153,0.20),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(52,211,153,0.15)]`
              : `bg-gradient-to-br from-amber-300/20 via-yellow-200/15 to-amber-400/10
         text-amber-700
         border border-amber-300/40
         shadow-[0_2px_12px_rgba(251,191,36,0.20),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(251,191,36,0.15)]`
            }
  `}>
            {latestDeploy?.readyState || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 grow flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Favicon project={project} size="small" iconErrors={iconErrors} handleIconError={handleIconError} />
          <h3 className="text-lg font-bold truncate
            text-transparent bg-clip-text
            bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500
            [filter:drop-shadow(0_1px_1px_rgba(255,255,255,0.9))_drop-shadow(0_1px_4px_rgba(99,102,241,0.10))]">
            {project.link?.repo || project.name}
          </h3>
        </div>

        <div className="mt-auto space-y-3">
          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-gray-500/80">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {latestDeploy?.creator?.username || project.creator?.username || "Unknown"}
            </span>
            <span>{formatDate(latestDeploy?.createdAt || project.createdAt)}</span>
          </div>

          {/* Action buttons */}
          {projectUrl && (
            <div className="flex gap-2">
              <a
                href={`https://${projectUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full py-2 text-sm font-semibold rounded-lg transition-all duration-150
                  bg-gray-900/80 backdrop-blur-sm text-white
                  border border-white/10
                  shadow-[0_2px_10px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]
                  hover:bg-black/90 hover:shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
                  Open Site
                </button>
              </a>
              <button
                className="px-3 py-2 rounded-lg transition-all duration-150
                  bg-white/30 backdrop-blur-sm text-indigo-600
                  border border-indigo-200/50
                  shadow-[0_2px_8px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]
                  hover:bg-white/50 hover:border-indigo-300/60
                  hover:shadow-[0_2px_12px_rgba(99,102,241,0.15)]"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(project);
                }}
              >
                <svg className="w-6 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;