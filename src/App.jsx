import React, { useEffect, useState } from 'react';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('VERCEL_TOKEN') || import.meta.env.VITE_VERCEL_TOKEN || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Detail modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDeployment, setSelectedDeployment] = useState(null);

  // Image loading states
  const [iconErrors, setIconErrors] = useState({});
  const [screenshots, setScreenshots] = useState({});

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
   try {
      const res = await fetch("https://api.vercel.com/v9/projects?withDeployments=true", {
        headers: { Authorization: `Bearer ${token || import.meta.env.VITE_VERCEL_TOKEN}` },
      });


      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid or expired Vercel token");
        }
        throw new Error("Failed to fetch projects");
      }

      const data = await res.json();
      setProjects(data.projects || []);

      // Fetch screenshots for all projects
      data.projects?.forEach(project => {
        const alias = project.targets?.production?.alias?.[0];
        if (alias) {
          fetchScreenshot(project.id, alias);
        }
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = (newToken) => {
    localStorage.setItem('VERCEL_TOKEN', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('VERCEL_TOKEN');
    setToken('');
    setProjects([]);
  };

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

  const filteredProjects = projects.filter(project => {
    const search = searchTerm.toLowerCase();
    const name = project.name?.toLowerCase() || '';
    const repo = project.link?.repo?.toLowerCase() || '';
    return name.includes(search) || repo.includes(search);
  });

const Demo_Btn = (e) => {
  e.preventDefault();

  const demoToken = import.meta.env.VITE_VERCEL_TOKEN;

  if (!demoToken) return;

  setToken(demoToken);
  fetchProjects(); // optional
  console.log(demoToken)
};
 
  // Token Input View
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Project Manager</h1>
            <p className="text-gray-500 mt-2">Enter your Vercel Personal Access Token to continue.</p>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (e.target.elements.token.value.trim()) handleSaveToken(e.target.elements.token.value.trim());
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                  <input
                    type="password"
                    id="token"
                    name="token"
                    required
                    placeholder="vercel_token_..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                >
                  Connect Account
                </button>
              </div>
            </form>
              <div className="space-y-4 mt-2">
                <button onClick={Demo_Btn}
                  type="submit"
                  className="w-full hover:bg-gray-200 border-2 text-gray-800 border-gray-800 font-semibold py-3 rounded-lg transition-colors shadow-sm"
                >
                  Demo
                </button>
              </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://vercel.com/account/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline"
            >
              How to get your own token?
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md text-center border border-red-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Occurred</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => fetchProjects()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Use different token
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedProject && (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  My Projects
                </h1>
                <p className="mt-2 text-lg text-gray-500">
                  Manage and explore your Vercel deployments.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchProjects}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh projects"
                >
                  <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects by name or repository..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 h-80 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-xl" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded w-2/3" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => {
                const latestDeploy = project.latestDeployments?.[0];
                const projectUrl = getProjectUrl(project);
                const screenshotUrl = getScreenshotUrl(project.id);

                return (
                  <div
                    key={project.id}
                    onClick={() => openDetail(project)}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden flex flex-col h-full"
                  >
                    {/* Screenshot or Favicon Section */}
                    <div className="relative h-60 bg-gray-100 overflow-hidden border-b border-gray-100">
                      {screenshotUrl ? (
                        <img
                          src={screenshotUrl}
                          alt={`${project.name} screenshot`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                          <Favicon project={project} size="large" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${latestDeploy?.readyState === 'READY' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {latestDeploy?.readyState || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 grow flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <Favicon project={project} size="small" />
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {project.link?.repo || project.name}
                        </h3>
                      </div>

                      <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
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
                              className="px-3 py-2 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-600  rounded-lg transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(project);
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
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search term or refresh the list.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeDetail}
        >
          <div
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <Favicon project={selectedProject} size="small" />
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {selectedProject.link?.repo || selectedProject.name}
                </h2>
              </div>
              <button
                onClick={closeDetail}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Screenshot in modal */}
              {getScreenshotUrl(selectedProject.id) && (
                <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={getScreenshotUrl(selectedProject.id)}
                    alt={`${selectedProject.name} preview`}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {selectedDeployment ? (
                <div className="space-y-6">
                  {/* Aliases */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Deployment URLs</h3>
                    {selectedDeployment.alias?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDeployment.alias.map((url, idx) => (
                          <a
                            key={idx}
                            href={`https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
                          >
                            <span className="text-sm text-gray-700 truncate mr-2 font-medium">{url}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No production aliases available.</p>
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</h3>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${selectedDeployment.readyState === 'READY' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <p className="text-gray-900 font-semibold text-sm">{selectedDeployment.readyState}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Created</h3>
                      <p className="text-gray-900 font-semibold text-sm">{formatDate(selectedDeployment.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Framework</h3>
                      {selectedProject.framework ? (
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase border border-indigo-100">
                          {selectedProject.framework}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-sm">Not detected</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Creator</h3>
                      <p className="text-gray-900 font-semibold text-sm">
                        {selectedDeployment.creator?.username || selectedDeployment.creator?.email || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* GitHub meta */}
                  {selectedDeployment.meta && (
                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Source Control</h3>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Repository</span>
                            <p className="text-gray-900 text-sm font-medium truncate">{selectedDeployment.meta.githubCommitRepo || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Branch</span>
                            <p className="text-gray-900 text-sm font-mono">{selectedDeployment.meta.githubCommitRef || "N/A"}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Commit Message</span>
                          <p className="text-gray-900 text-sm italic line-clamp-2">"{selectedDeployment.meta.githubCommitMessage || "No message"}"</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200/50">
                          <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Commit SHA</span>
                          <p className="text-gray-400 font-mono text-[10px] break-all">{selectedDeployment.meta.githubCommitSha || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 italic">No deployment data available for this project.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 