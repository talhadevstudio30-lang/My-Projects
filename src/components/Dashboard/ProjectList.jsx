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
      {/* Search Bar */}
      <div className='flex justify-center items-center border-b bg-white/20 backdrop-blur-xl border-white/30 px-6.5
        shadow-[0_2px_16px_rgba(99,102,241,0.06),inset_0_-1px_0_rgba(255,255,255,0.4)]'>
        <div className="mt-4 mb-4 relative lg:w-2xl md:w-full w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search projects by name or repository..."
            className="block w-full pl-10 pr-3 py-3 rounded-full leading-5
              bg-white/40 backdrop-blur-sm
              border border-white
              placeholder-gray-400 text-gray-700
              shadow-[0_2px_12px_rgba(99,102,241,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]
              focus:outline-none focus:placeholder-gray-400
              focus:ring-1 focus:ring-indigo-400/60 focus:border-indigo-400/60
              focus:bg-white/60
              transition-all duration-200 sm:text-sm"
            value={searchTerm}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setVisibleCount(6);
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-2.5 md:px-7 py-8 md:py-8">
        {/* Header */}
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
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onRefresh}
                disabled={loading}
                className="text-gray-500 border px-3 py-2 rounded-[9px] cursor-pointer
                  bg-white/30 backdrop-blur-sm border-white/50
                  shadow-[0_2px_10px_rgba(99,102,241,0.07),inset_0_1px_0_rgba(255,255,255,0.6)]
                  hover:bg-white/50 hover:border-white/70 hover:shadow-[0_2px_14px_rgba(99,102,241,0.12)]
                  transition-all duration-150 disabled:opacity-50"
                title="Refresh projects"
              >
                <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={() => {
                  if (window.confirm(`Hi ${lastName === "" ? `${firstName}${lastName} 👋` : `${firstName} ${lastName} 👋`}

Are you sure you want to log out?

Thanks for using our web app 💙
If you face any issues, feel free to report them.`)) {
                    onLogout();
                  }
                }}
                className="px-4 py-2 text-sm font-medium cursor-pointer rounded-[9px]
                  bg-red-500/10 backdrop-blur-sm text-red-600
                  border border-red-200/60
                  shadow-[0_2px_10px_rgba(239,68,68,0.07),inset_0_1px_0_rgba(255,255,255,0.5)]
                  hover:bg-red-500/20 hover:border-red-300/70
                  hover:shadow-[0_2px_14px_rgba(239,68,68,0.14)]
                  transition-all duration-150 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Loading Skeletons */}
        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl h-80 animate-pulse
                bg-white/30 backdrop-blur-sm
                border border-white/40
                shadow-[0_2px_16px_rgba(99,102,241,0.07)]">
                <div className="h-40 bg-white/40 rounded-t-xl" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/50 rounded" />
                    <div className="h-6 bg-white/50 rounded w-2/3" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/50 rounded w-1/2" />
                    <div className="h-4 bg-white/50 rounded w-1/3" />
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

            {/* Show More / Show Less */}
            {filteredProjects.length > 6 && (
              <div className="mt-10 text-center">
                {hasMoreProjects ? (
                  <button
                    onClick={() => setVisibleCount(prev => Math.min(prev + 6, filteredProjects.length))}
                    className="px-6 py-3 font-semibold rounded-xl
                      bg-white/30 backdrop-blur-sm text-indigo-600
                      border-2 border-indigo-400/40
                      shadow-[0_2px_16px_rgba(99,102,241,0.10),inset_0_1px_0_rgba(255,255,255,0.6)]
                      hover:bg-white/50 hover:border-indigo-500/60
                      hover:shadow-[0_4px_20px_rgba(99,102,241,0.18)]
                      transition-all duration-150"
                  >
                    Show More ({filteredProjects.length - visibleCount} remaining)
                  </button>
                ) : (
                  <button
                    onClick={() => setVisibleCount(6)}
                    className="px-6 py-3 font-semibold rounded-xl
                      bg-white/30 backdrop-blur-sm text-gray-600
                      border-2 border-white/50
                      shadow-[0_2px_16px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6)]
                      hover:bg-white/50 hover:border-gray-300/70
                      transition-all duration-150"
                  >
                    Show Less
                  </button>
                )}
              </div>
            )}
          </>

        ) : (
          /* Empty State */
          <div className="text-center py-20 rounded-2xl
            bg-white/20 backdrop-blur-sm
            border border-dashed border-white/50
            shadow-[0_2px_20px_rgba(99,102,241,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4
              bg-white/40 backdrop-blur-sm border border-white/50
              shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
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