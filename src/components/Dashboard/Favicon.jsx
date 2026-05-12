import React from 'react';

const DefaultIcon = ({ project, size }) => {
  const sizeClass = size === 'large' ? 'w-16 h-16' : 'w-8 h-8';
  const textClass = size === 'large' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`${sizeClass} bg-indigo-100 rounded-lg flex items-center justify-center`}>
      <span className={`${textClass} font-bold text-indigo-600`}>
        {project.name?.charAt(0)?.toUpperCase() || 'P'}
      </span>
    </div>
  );
};

const getProjectUrl = (project) => {
  return project.targets?.production?.alias?.[0] || null;
};

const getFaviconUrl = (domain) => {
  if (!domain) return null;
  return `https://favicon.so/${domain}`;
};

const Favicon = ({ project, size = 'large', iconErrors, handleIconError }) => {
  const projectUrl = getProjectUrl(project);

  if (!projectUrl || iconErrors[project.id]) {
    return <DefaultIcon project={project} size={size} />;
  }

  const faviconUrl = getFaviconUrl(projectUrl);

  const sizeClass = size === 'large' ? 'w-16 h-16' : 'w-8 h-8';
  const roundedClass = size === 'large' ? 'rounded-lg shadow-md' : 'rounded';

  return (
    <img
      src={faviconUrl}
      alt={`${project.name} favicon`}
      className={`${sizeClass} ${roundedClass}`}
      onError={() => handleIconError(project.id)}
    />
  );
};

export default Favicon;
