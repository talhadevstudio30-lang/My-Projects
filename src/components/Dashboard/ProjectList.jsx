import React, { useState } from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, loading, searchTerm, onSearchChange, screenshots, iconErrors, handleIconError, onOpenDetail, onRefresh, firstName, lastName, onLogout }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProjects = projects.filter(project => {
    const search = searchTerm.toLowerCase();
    const name = project.name?.toLowerCase() || '';
    const repo = project.link?.repo?.toLowerCase() || '';
    return name.includes(search) || repo.includes(search);
  });

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  return (
    <>
      <div className='flex justify-center items-center border-b bg-white/40 border-white/60 px-6.5'>
        <div className="mt-4 mb-4 relative lg:w-2xl md:w-full w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search projects by name or repository..."
            className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setVisibleCount(6);
            }}
          />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-2.5 md:px-7 py-8 md:py-10">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {lastName === "" ? `${firstName}${lastName}'s Projects`
                  : `${firstName} ${lastName}'s Projects`}
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Hey {`${firstName} ${lastName}`} 👋 Ready to manage your Vercel deployments.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="text-gray-500 border px-3 py-2 rounded-[9px] shadow-sm cursor-pointer hover:bg-white/60 border-white/60 bg-white/70 transition-colors disabled:opacity-50"
                title="Refresh projects"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Hi ${lastName === "" ? `${firstName}${lastName} 👋`
                    : `${firstName} ${lastName} 👋`}

Are you sure you want to log out?

Thanks for using our web app 💙
If you face any issues, feel free to report them.`)) {
                    onLogout();
                  }
                }}
                className="px-4 py-2 text-sm font-medium bg-red-100 text-red-600 hover:bg-red-300 cursor-pointer rounded-[9px] transition-colors flex items-center gap-2 border border-red-200 hover:border-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>

            </div>
          </div>

        </header>

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  screenshots={screenshots}
                  iconErrors={iconErrors}
                  handleIconError={handleIconError}
                  onOpenDetail={onOpenDetail}
                />
              ))}
            </div>
            <div>
              {filteredProjects.length > 6 && (
                <div className="mt-10 text-center">
                  {hasMoreProjects ? (
                    <button
                      onClick={() => setVisibleCount(prev => Math.min(prev + 6, filteredProjects.length))}
                      className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                      Show More ({filteredProjects.length - visibleCount} remaining)
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleCount(6)}
                      className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
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
              onClick={() => onSearchChange('')}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectList;
