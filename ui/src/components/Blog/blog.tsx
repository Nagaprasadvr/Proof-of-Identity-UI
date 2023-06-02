import React from 'react';
import { Box } from '@mui/material';
import '../../App.css';

export const Blog = () => {
    return (
        <Box className="App" sx={{width: "100vw", height: "100vh"}}>
            <iframe
                title="blog"
                src="./blog.pdf"
                frameBorder={'0'}
                scrolling="auto"
                height="800px"
                width="100%"
                style={{ marginTop: "10px" }}
            ></iframe>
        </Box>
    );
};