import React from 'react';
import Favicon from './Favicon';

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleString();
};

const getScreenshotUrl = (projectId, screenshots) => {
  return screenshots[projectId] || null;
};

const ProjectDetailModal = ({ selectedProject, selectedDeployment, screenshots, iconErrors, handleIconError, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center bg-white sm:bg-transparent justify-center p-0 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white sm:border border-gray-200 rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl max-w-2xl w-full max-h-[99vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Favicon project={selectedProject} size="small" iconErrors={iconErrors} handleIconError={handleIconError} />
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {selectedProject.link?.repo || selectedProject.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {getScreenshotUrl(selectedProject.id, screenshots) && (
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={getScreenshotUrl(selectedProject.id, screenshots)}
                alt={`${selectedProject.name} preview`}
                className="w-full h-auto"
              />
            </div>
          )}

          {selectedDeployment ? (
            <div className="space-y-6">
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
  );
};

export default ProjectDetailModal;
