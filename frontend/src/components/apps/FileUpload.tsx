import { Box, Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import img1 from 'src/assets/images/products/plus.jpg';
import axios from '../../utils/axios';


function FileUpload({load} : {load : React.Dispatch<React.SetStateAction<string>>}) {
    const [file, setFile] = useState();
    const [_, setUploadedFile] = useState();
    const [error, setError] = useState();

    function handleChange(event: any) {
        setFile(event.target.files[0]);
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        const url = '/api/v1/files/upload';
        const formData = new FormData();
        formData.append('file', file ? file : '');
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios
            .post(url, formData, config)
            .then((response) => {
                console.log(response.data);
                setUploadedFile(response.data.url);
                load(response.data.url);
                toast.success("Документ прикреплен.")
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
                setError(error);
                toast.error("Произошла ошибка при загрузке файла.")
            });
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <h1>Загрузка файла</h1>
            
            <Grid container>
                <Grid item xs={12} container >
                    <Grid item xs={7}>
            <Button
                variant="contained"
                component="label"
                color={"secondary"}
            >
                Выбрать
            <input type="file" onChange={handleChange} hidden/>
            </Button>
            </Grid>
            <Grid item xs={5}>
            {file ? 
                <>
                <Button
                color={"error"}
                onClick={()=>setFile(undefined)}
                >
                    Удалить
                </Button>
                <Button type="submit"
                >
                    Прикрепить
                </Button>
                </>
            : <></>}
                </Grid>
            </Grid>
            
            <Grid xs={12}>
            <br />

            <Box justifyContent={'center'}>
                    <img  width={"100%"} src={file ? URL.createObjectURL(file) : img1}  />
                </Box>
            </Grid>
            </Grid>    
            {error && <p>Error uploading file: {error}</p>}
                
            </form>
            
        </div>
    );
}

export default FileUpload;