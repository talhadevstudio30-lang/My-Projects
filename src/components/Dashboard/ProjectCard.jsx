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
      className="group backdrop-blur-xl bg-[#ffffffd1] rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 border-2 border-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-60 bg-gray-100 overflow-hidden border-b border-gray-100">
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={`${project.name} screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <Favicon project={project} size="large" iconErrors={iconErrors} handleIconError={handleIconError} />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${latestDeploy?.readyState === 'READY' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
            {latestDeploy?.readyState || 'Unknown'}
          </span>
        </div>
      </div>

      <div className="p-4 grow flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Favicon project={project} size="small" iconErrors={iconErrors} handleIconError={handleIconError} />
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {project.link?.repo || project.name}
          </h3>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {latestDeploy?.creator?.username || project.creator?.username || "Unknown"}
            </span>
            <span>{formatDate(latestDeploy?.createdAt || project.createdAt)}</span>
          </div>

          {projectUrl && (
            <div className="flex gap-2">
              <a
                href={`https://${projectUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                  Open Site
                </button>
              </a>
              <button
                className="px-3 py-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
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
