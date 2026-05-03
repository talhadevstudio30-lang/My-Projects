import React, { useEffect, useState } from 'react';

function App() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  // Detail modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState(null);

  // Image loading states
  const [iconErrors, setIconErrors] = useState({});
  const [screenshots, setScreenshots] = useState({});

  useEffect(() => {
    const token = import.meta.env.VITE_VERCEL_TOKEN;

    fetch("https://api.vercel.com/v9/projects?withDeployments=true", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then(data => {
        setProjects(data.projects || []);
        console.log(data)
        // Fetch screenshots for all projects
        data.projects?.forEach(project => {
          const alias = project.targets?.production?.alias?.[0];
          if (alias) {
            fetchScreenshot(project.id, alias);
          }
        });
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  const fetchScreenshot = async (projectId, domain) => {
    try {
      const fullUrl = `https://${domain}`;
      const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=true&meta=false`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.screenshot?.url) {
        setScreenshots(prev => ({
          ...prev,
          [projectId]: data.data.screenshot.url
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch screenshot for ${domain}:`, error);
    }
  };

  const openDetail = (project) => {
    const latestDeploy = project.latestDeployments?.[0] || null;
    setSelectedProject(project);
    setSelectedDeployment(latestDeploy);
  };

  const closeDetail = () => {
    setSelectedProject(null);
    setSelectedDeployment(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const getProjectUrl = (project) => {
    return project.targets?.production?.alias?.[0] || null;
  };

  const getFaviconUrl = (domain) => {
    if (!domain) return null;
    return `https://favicon.so/${domain}`;
  };

  const getScreenshotUrl = (projectId) => {
    return screenshots[projectId] || null;
  };

  const handleIconError = (projectId) => {
    setIconErrors(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  // Favicon component with fallback
  const Favicon = ({ project, size = 'large' }) => {
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
  
  // Default fallback icon
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedProject && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              My Projects
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Click a project to see deployment details.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const latestDeploy = project.latestDeployments?.[0];
              const projectUrl = getProjectUrl(project);
              const screenshotUrl = getScreenshotUrl(project.id);

              return (
                <div
                  key={project.id}
                  onClick={() => openDetail(project)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden"
                >
                  {/* Screenshot or Favicon Section */}
                  {screenshotUrl ? (
                    <div className="relative h-60 bg-gray-100 overflow-hidden">
                      <img
                        src={screenshotUrl}
                        alt={`${project.name} screenshot`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                      <Favicon project={project} size="large" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Favicon project={project} size="small" />
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {project.link?.repo || project.name}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        {latestDeploy?.creator?.username ||
                          latestDeploy?.creator?.email ||
                          project.creator?.username ||
                          "Unknown creator"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(latestDeploy?.createdAt || project.createdAt)}
                      </p>
                      {projectUrl && (
                        <a
                          href={`https://${projectUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="mt-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                            Visit
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Favicon project={selectedProject} size="small" />
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {selectedProject.link?.repo || selectedProject.name}
                </h2>
              </div>
              <button
                onClick={closeDetail}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Screenshot in modal */}
              {getScreenshotUrl(selectedProject.id) && (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getScreenshotUrl(selectedProject.id)}
                    alt={`${selectedProject.name} preview`}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {selectedDeployment ? (
                <>
                  {/* Aliases */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 tracking-wider">DEPLOYMENT URLs</h3>
                    {selectedDeployment.alias?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {selectedDeployment.alias.map((url, idx) => (
                          <li key={idx}>
                            <a
                              href={`https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline break-all"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">No alias</span>
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Project ID</h3>
                      <p className="text-gray-800 font-mono text-sm break-all">{selectedProject.id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Created</h3>
                      <p className="text-gray-800">{formatDate(selectedDeployment.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Framework</h3>
                      <p className="text-gray-800">
                        {selectedProject.framework ? (
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                            {selectedProject.framework}
                          </span>
                        ) : (
                          <span className="italic text-gray-400">none</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Creator</h3>
                      <p className="text-gray-800">
                        {selectedDeployment.creator?.username || selectedDeployment.creator?.email || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* GitHub meta */}
                  {selectedDeployment.meta && (
                    <div className="border-t border-gray-200 pt-5">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">GitHub Repository</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-gray-400">Repo</span>
                          <p className="text-gray-800 font-medium">{selectedDeployment.meta.githubCommitRepo || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Organization</span>
                          <p className="text-gray-800 font-medium">{selectedDeployment.meta.githubCommitOrg || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Branch</span>
                          <p className="text-gray-800 font-mono text-sm">{selectedDeployment.meta.githubCommitRef || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-400">Commit Message</span>
                          <p className="text-gray-800 truncate">{selectedDeployment.meta.githubCommitMessage || "N/A"}</p>
                        </div>
                        <div className="col-span-full">
                          <span className="text-xs text-gray-400">Commit SHA</span>
                          <p className="text-gray-800 font-mono text-sm break-all">{selectedDeployment.meta.githubCommitSha || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-400 py-6">No deployment data available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;