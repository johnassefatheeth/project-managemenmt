export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'warning';
    default: return 'default';
  }
};