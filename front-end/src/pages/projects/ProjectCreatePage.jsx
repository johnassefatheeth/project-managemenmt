import ProjectForm from '../../components/projects/ProjectForm';

const ProjectCreatePage = () => {
  const handleSubmit = (projectData) => {
    // Handle project creation logic here
    console.log('Creating project:', projectData);
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ProjectCreatePage;