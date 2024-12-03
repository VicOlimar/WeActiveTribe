import React from 'react';
import { Form } from 'react-bootstrap';
const { Label } = Form;

type Props = { text: string, link: string, linkText: string };
const CheckboxLabel = ({ text, link, linkText }: Props) => {
    return <Label>{text} <a href={link}>{linkText}</a></Label>
}

export default CheckboxLabel;