import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required')
});

export const projectSchema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  description: yup.string()
});