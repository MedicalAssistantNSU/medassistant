import React, { useState } from 'react';
import axios from '../../utils/axios';


function FileUpload({load} : {load : React.Dispatch<React.SetStateAction<string>>}) {
    const [file, setFile] = useState();
    const [uploadedFile, setUploadedFile] = useState();
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
            })
            .catch((error) => {
                console.error('Error uploading file: ', error);
                setError(error);
            });
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <h1>Загрузка файла</h1>
                <input type="file" onChange={handleChange} />
                <button type="submit">Прикрепить</button>
            </form>
            {uploadedFile && <img width={'90%'} src={uploadedFile} alt="Uploaded content" />}
            {error && <p>Error uploading file: {error}</p>}
        </div>
    );
}

export default FileUpload;