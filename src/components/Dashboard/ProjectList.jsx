import React, { useState, useMemo, useCallback } from 'react';
import ProjectCard from './ProjectCard';
import Dash_Header from './Dash_Header';
import Account_Btn from './Account_Btn';

const ProjectList = ({ projects, loading, searchTerm, onSearchChange, screenshots, iconErrors, handleIconError, onOpenDetail, onRefresh, firstName, lastName, onLogout, fetchScreenshotIfNeeded }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProjects = useMemo(() => {
    const search = (searchTerm || '').toLowerCase();
    return projects.filter(project => {
      const name = project.name?.toLowerCase() || '';
      const repo = project.link?.repo?.toLowerCase() || '';
      return name.includes(search) || repo.includes(search);
    });
  }, [projects, searchTerm]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  // Debounced input handler to reduce re-renders while typing
  const handle_input_change = useCallback((e) => {
    const value = e.target.value;
    onSearchChange(value);
    setVisibleCount(6);
  }, [onSearchChange]);

  const logout_alert = () => {
    if (window.confirm(`Hi ${lastName === "" ? `${firstName}${lastName} 👋`
      : `${firstName} ${lastName} 👋`}

Are you sure you want to log out?

Thanks for using our web app 💙
If you face any issues, feel free to report them.`)) {
      onLogout();
    }
  }

  return (
    <>
      <div className='hidden md:block'>
        <Dash_Header searchTerm={searchTerm} handle_input_change={handle_input_change} />
      </div>
      <div className='block md:hidden'>
        <Account_Btn onRefresh={onRefresh} loading={loading} logout_alert={logout_alert} />
      </div>
      <div className="max-w-7xl mx-auto px-4 mb-2.5 md:px-7 py-8 md:py-10">
        <header className="mb-4 md:mb-10">
          <div className="grid md:flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {lastName === "" ? `${firstName}${lastName}'s Projects`
                  : `${firstName} ${lastName}'s Projects`}
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                Hey {`${firstName} ${lastName}`} 👋 Ready to manage your Vercel deployments.
              </p>
            </div>
          </div>
          <div className='hidden md:block'>
            <Account_Btn onRefresh={onRefresh} loading={loading} logout_alert={logout_alert} />
          </div>
        </header>
        <div className='block md:hidden'>
          <Dash_Header searchTerm={searchTerm} handle_input_change={handle_input_change} />
        </div>

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
                  fetchScreenshotIfNeeded={fetchScreenshotIfNeeded}
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
