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
            ></iframe>
        </div>
    );
};
