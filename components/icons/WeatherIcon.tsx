
import React from 'react';

const WeatherIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-2.666-2.886 3 3 0 00-2.666 2.886 3 3 0 00-2.583 2.583 3 3 0 00-2.886 2.666A4.5 4.5 0 002.25 15z" />
    </svg>
);

export default WeatherIcon;
