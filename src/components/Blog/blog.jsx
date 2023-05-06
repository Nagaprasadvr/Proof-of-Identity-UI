import React from 'react';
import '../../App.css';

export const Blog = () => {
    return (
        <div className="App">
            <iframe
                title="blog"
                src="./blog.pdf"
                frameBorder={'0'}
                scrolling="auto"
                height="800px"
                width="100%"
                style={{marginTop:"10px"}}
            ></iframe>
        </div>
    );
};
