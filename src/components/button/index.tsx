import React from 'react';
import { Button } from 'antd';
// import Button from 'antd/es/button';

export default function ZanghuiButton(props: React.ComponentProps<typeof Button>) {
    return <>Zanghui's button<Button {...props} /></>;
}
