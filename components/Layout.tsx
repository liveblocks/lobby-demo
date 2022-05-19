import Head from 'next/head';
import React, { ReactNode } from 'react';

type Props = {
    children?: ReactNode;
    title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
    return (
        <div className="flex flex-col">
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default Layout;
