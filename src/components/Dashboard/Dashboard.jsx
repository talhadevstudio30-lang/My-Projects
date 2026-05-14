import React, { useEffect, useState } from 'react';
import LoginPage from './LoginPage';
import ProjectList from './ProjectList';
import ProjectDetailModal from './ProjectDetailModal';
import { encryptToken, decryptToken, getProjectUrl } from './utils';

function Dashboard({
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    firstName, lastName, setFirstName, setLastName
}) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [iconErrors, setIconErrors] = useState({});
    const [screenshots, setScreenshots] = useState({});
    const [loginError, setLoginError] = useState(null);

    const validateToken = async (tokenToValidate) => {
        try {
            const res = await fetch("https://api.vercel.com/v9/projects?withDeployments=true", {
                headers: { Authorization: `Bearer ${tokenToValidate}` },
            });

            if (res.status === 401) {
                return { valid: false, message: "Invalid or expired Vercel token. Please check and try again." };
            }

            if (!res.ok) {
                return { valid: false, message: "Failed to connect to Vercel. Please try again." };
            }

            const data = await res.json();
            return { valid: true, projects: data.projects || [] };
        } catch (err) {
            return { valid: false, message: "Network error. Please check your connection." };
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://api.vercel.com/v9/projects?withDeployments=true", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    throw new Error("Invalid or expired Vercel token. Please login again.");
                }
                throw new Error("Failed to fetch projects");
            }

            const data = await res.json();
            setProjects(data.projects || []);
            data.projects?.forEach(project => {
                const alias = getProjectUrl(project);
                if (alias) fetchScreenshot(project.id, alias);
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && token) {
            fetchProjects();
        }
    }, [isLoggedIn, token]);

    useEffect(() => {
        const savedLoginState = localStorage.getItem('VERCEL_LOGIN_STATE');
        const encryptedToken = localStorage.getItem('VERCEL_SECURE_TOKEN');

        if (savedLoginState === 'true' && encryptedToken) {
            const decryptedToken = decryptToken(encryptedToken);
            if (decryptedToken) {
                setToken(decryptedToken);
            }
        }
    }, []);

    const handleSaveToken = (newToken) => {
        const encryptedToken = encryptToken(newToken);
        if (encryptedToken) {
            localStorage.setItem('VERCEL_SECURE_TOKEN', encryptedToken);
            localStorage.setItem('VERCEL_LOGIN_STATE', 'true');
        }
        setToken(newToken);
        setIsLoggedIn(true);
        setProjects([]);
        setSearchTerm("");
        setIconErrors({});
        setScreenshots({});
    };

    const Handle_Create_Account_Btn = async (e) => {
        e.preventDefault();
        setLoginError(null);

        const formToken = e.target.elements.token.value.trim();
        const userFirstName = e.target.elements.firstName.value.trim();
        const userLastName = e.target.elements.lastName.value.trim();

        if (!formToken || !userFirstName) {
            setLoginError("Please enter your name and token.");
            return;
        }

        setLoading(true);
        const result = await validateToken(formToken);
        setLoading(false);

        if (!result.valid) {
            setLoginError(result.message);
            return;
        }


        if (userLastName) {
            localStorage.setItem('USER_LAST_NAME', userLastName);
            setLastName(userLastName);
        }
        localStorage.setItem('USER_FIRST_NAME', userFirstName);
        setFirstName(userFirstName);
        handleSaveToken(formToken);


    };

    const fetchScreenshot = async (projectId, domain) => {
        try {
            const fullUrl = `https://${domain}`;
            const response = await fetch(
                `https://api.microlink.io/?url=${encodeURIComponent(fullUrl)}&screenshot=true&meta=false`
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) throw new Error('Response is not JSON');
            const data = await response.json();
            if (data.status === 'success' && data.data?.screenshot?.url) {
                setScreenshots(prev => ({ ...prev, [projectId]: data.data.screenshot.url }));
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

    const handleIconError = (projectId) => {
        setIconErrors(prev => ({ ...prev, [projectId]: true }));
    };

    if (!isLoggedIn) {
        return (
            <LoginPage
                Handle_Create_Account_Btn={Handle_Create_Account_Btn}
                loginError={loginError}
                isValidating={loading}
            />
        );
    }

    return (
        <>

            <div className="min-h-screen">
                {!selectedProject && (
                    <ProjectList
                        projects={projects}
                        loading={loading}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        screenshots={screenshots}
                        iconErrors={iconErrors}
                        handleIconError={handleIconError}
                        onOpenDetail={openDetail}
                        onRefresh={fetchProjects}
                        firstName={firstName}
                        lastName={lastName}
                        onLogout={handleLogout}
                    />
                )}

                {selectedProject && (
                    <ProjectDetailModal
                        selectedProject={selectedProject}
                        selectedDeployment={selectedDeployment}
                        screenshots={screenshots}
                        iconErrors={iconErrors}
                        handleIconError={handleIconError}
                        onClose={closeDetail}
                    />
                )}
            </div>
        </>
    );
}

export default Dashboard;