// components/NextLink.js
import React from 'react';
import Link from 'next/link';

const NextLink = ({ href, children }) => (
<div className='w-full flex justify-end'>
  <Link href={href} className='block'>
    <p style={{ backgroundColor: '#218380' }} className=" text-white px-4 py-2 rounded">
      {children}
    </p>
        </Link>
        </div>
);

export default NextLink;
