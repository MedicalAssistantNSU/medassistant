// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Alert, Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Stack } from '@mui/system';
import { FormikProvider, useFormik } from 'formik';
import useAuth from 'src/guards/authGuard/UseAuth';
import useMounted from 'src/guards/authGuard/UseMounted';
import { registerType } from 'src/types/auth/auth';
import * as Yup from 'yup';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const mounted = useMounted();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),

    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      policy: true,
      submit: null,
      acceptTerms: true,
    },

    validationSchema: registerSchema,

    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        console.log("register")
        await signup(values.email, values.password, values.name);
        navigate('/auth/login');
        if (mounted.current) {
          setStatus({ success: true });
          setSubmitting(true);
        }
      } catch (err: any) {
        if (mounted.current) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }
    },
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

        {errors.submit && (
          <Box mt={1}>
            <Alert severity="error">{errors.submit}</Alert>
          </Box>
        )}
        <FormikProvider value={formik}>
        <form onSubmit={handleSubmit}>
          <Stack>
          <Box>
              <CustomFormLabel htmlFor="name">Имя</CustomFormLabel>
              <CustomTextField
                id="name"
                variant="outlined"
                fullWidth
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="email">Почта</CustomFormLabel>
              <CustomTextField
                id="email"
                variant="outlined"
                fullWidth
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box>
              <CustomFormLabel htmlFor="password">Пароль</CustomFormLabel>
              <CustomTextField
                id="password"
                type="password"
                variant="outlined"
                fullWidth
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
            
          </Stack>
          <Box mt={2}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              Создать аккаунт
            </Button>
          </Box>
        </form>
      </FormikProvider>
      <Box m={"0 25%"}>
        {subtitle}
      </Box>
    </>
  );
};

export default AuthRegister;
