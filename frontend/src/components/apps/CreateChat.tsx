import { Box, Button, Typography } from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { AppendChat } from 'src/store/apps/chat/ChatSlice';
import axiosServices from '../../utils/axios';
import CustomTextField from '../forms/theme-elements/CustomTextField';
import toast from 'react-hot-toast';

const CreateChat = ({setCreateChat} : {setCreateChat: (value: React.SetStateAction<boolean>) => void}) => {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
        },

        onSubmit: async (values) => {
            try {

                const data = JSON.stringify({
                    "name": values.name,
                  });
                const response = await axiosServices.post('/api/v1/chats/', data, {
                   headers: {
                        'Content-type': 'application/json',
                    },
                });

                const newChat = {
                    id: response.data.id,
                    name: values.name,
                    messages: []
                }
                console.log(newChat)
                await dispatch(AppendChat(newChat))
                toast.success('Чат создан.');
                console.log(response);
            } catch (err: any) {
                toast.error('Чат не создался.');
                console.log(err);
            }
            setCreateChat(() => false)
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
                        Создать чат
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
                                id="name"
                                variant="outlined"
                                placeholder="Название"
                                color="primary"
                                onChange={formik.handleChange}
                                value={formik.values.name}
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
                            Создать
                        </Button>
                    </form>
                </FormikProvider>
            </Box>
        </>
    )
}

export default CreateChat;