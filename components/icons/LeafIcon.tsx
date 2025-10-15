
import React from 'react';

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.156 5.342 13.01 5.56 12 5.823c-1.16.29-2.228.665-3.21 1.09A8.25 8.25 0 006.038 7.048c.24-2.122 1.86-3.75 3.962-3.998 2.102-.248 4.143.924 5.36 2.166z" />
    </svg>
);

export default LeafIcon;
