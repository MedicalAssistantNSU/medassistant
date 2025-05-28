import { Box, Button, Typography } from '@mui/material';
import { FormikProvider, useFormik } from 'formik';

import toast from 'react-hot-toast';
import axiosServices from 'src/utils/axios';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { ProfileType } from 'src/types/apps/profile';
import { fetchProfile } from 'src/store/apps/profile/ProfileSlice';
import { useDispatch } from 'src/store/Store';

const UpdateProfile = ({profile, setUpdateProfile} : {profile: ProfileType,setUpdateProfile: (value: React.SetStateAction<boolean>) => void}) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            profession: profile.profession ? profile.profession : '',
            gender: profile.gender ? profile.gender : ``,
            weight: profile.weight ? profile.weight : 0,
            age: profile.age ? profile.age : 0,
            height: profile.height ? profile.height : 0,
        },

        onSubmit: async (values) => {
            try {

                const data = {
                    "age": Number(values.age),
                    "avatar_url": ``,
                    "gender": values.gender ? values.gender : ``,
                    "height": Number(values.height),
                    "profession": values.profession ? values.profession : ``,
                    "weight": Number(values.weight)
                };
                console.log(data)
                const response = await axiosServices.put('/api/v1/account/profile', data, {
                   headers: {
                        'Content-type': 'application/json',
                    },
                });

                
                toast.success('Информация обновлена.');
                console.log(response);
            } catch (err: any) {
                toast.error('Произошла ошибка.');
                console.log(err);
            }
            await dispatch(fetchProfile())
            setUpdateProfile(() => false)
        },
    });

    return (
        <>
            <Box
                p={4}
                sx={
                    {
                        width: "90%",
                        margin: "auto"
                    }
                }
            >
                <Box mb={3}>
                    <Typography fontSize={18} fontWeight={600}>
                        Обновление данных
                    </Typography>
                </Box>
                <FormikProvider value={formik}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            formik.handleSubmit(e);
                        }}
                    >
                        <Box mb={2}>
                            <CustomTextField
                                id="profession"
                                variant="outlined"
                                placeholder="Профессия"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.profession}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <CustomTextField
                                id="gender"
                                variant="outlined"
                                placeholder="Пол"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.gender}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <CustomTextField
                                id="age"
                                variant="outlined"
                                placeholder="Возраст"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.age}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <CustomTextField
                                id="weight"
                                variant="outlined"
                                placeholder="Вес"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.weight}
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <CustomTextField
                                id="height"
                                variant="outlined"
                                placeholder="Рост"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.height}
                                fullWidth
                            />
                        </Box>
                        <Button
                            type="submit"
                            sx={{
                                color: 'white',
                                backgroundColor: 'black',
                            }}
                        >
                            Обновить
                        </Button>
                    </form>
                </FormikProvider>
            </Box>
        </>
    )
}

export default UpdateProfile;