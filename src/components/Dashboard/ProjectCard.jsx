import React, { useEffect, useRef, useState, memo, useCallback, useMemo } from 'react';
import Favicon from './Favicon';

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString();
};

const getProjectUrl = (project) => {
  return project.targets?.production?.alias?.[0] || null;
};

// const getScreenshotUrl = (projectId, screenshots) => {
//   return screenshots[projectId] || null;
// };

const ProjectCard = ({ project, screenshots = {}, iconErrors, handleIconError, onOpenDetail, fetchScreenshotIfNeeded }) => {
  const latestDeploy = project.latestDeployments?.[0];
  const projectUrl = useMemo(() => getProjectUrl(project), [project]);
  const cardRef = useRef(null);
  const [screenshotUrl, setScreenshotUrl] = useState(() => screenshots?.[project.id] || null);

  // Observe when card enters viewport to lazy-load screenshot
  useEffect(() => {
    if (screenshotUrl) return; // already have it
    if (!cardRef.current) return;
    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // fetch screenshot via provided callback which will cache in parent
          if (typeof fetchScreenshotIfNeeded === 'function') {
            fetchScreenshotIfNeeded(project.id, projectUrl).then(url => {
              if (url) setScreenshotUrl(url);
            }).catch(() => {});
          }
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(cardRef.current);
    return () => {
      observer?.disconnect();
    };
  }, [cardRef, screenshotUrl, project.id, projectUrl, fetchScreenshotIfNeeded]);

  const handleCardClick = useCallback(() => onOpenDetail && onOpenDetail(project), [onOpenDetail, project]);
  const handleOpenDetailBtn = useCallback((e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(project); }, [onOpenDetail, project]);
  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl shadow-xs hover:shadow-md transition-shadow duration-200 border border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-60 bg-gray-100 overflow-hidden border-b border-gray-100">
        {screenshotUrl ? (
          <img
            src={screenshotUrl}
            alt={`${project.name} screenshot`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <Favicon project={project} size="large" iconErrors={iconErrors} handleIconError={handleIconError} />
          </div>
        )}
        <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${latestDeploy?.readyState === 'READY' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }`}>
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
                onClick={stopPropagation}
              >
                <button className="w-full py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                  Open Site
                </button>
              </a>
              <button
                className="px-3 py-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                onClick={(e) => {
                  handleOpenDetailBtn(e);
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

// Safer memo compare: check stable keys that matter for rerendering
const areEqual = (prev, next) => {
  if (prev.project?.id !== next.project?.id) return false;
  // If basic metadata changed, re-render
  const prevLatest = prev.project?.latestDeployments?.[0];
  const nextLatest = next.project?.latestDeployments?.[0];
  if ((prevLatest?.readyState) !== (nextLatest?.readyState)) return false;
  if ((prevLatest?.createdAt) !== (nextLatest?.createdAt)) return false;
  if ((prev.project?.name) !== (next.project?.name)) return false;
  // screenshots may be undefined; compare the entry for this project id
  const prevShot = prev.screenshots?.[prev.project.id];
  const nextShot = next.screenshots?.[next.project.id];
  if (prevShot !== nextShot) return false;
  // icon errors can affect favicon render
  if (prev.iconErrors !== next.iconErrors) return false;
  return true;
};

export default memo(ProjectCard, areEqual);
