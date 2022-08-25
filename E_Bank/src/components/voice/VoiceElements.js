import styled from "styled-components";

export const ComponentWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 110px repeat(4, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
`;

export const DeleteText = styled.h5`
    color: red;
    cursor: pointer;
`;

export const Heading = styled.div`
    grid-area: 1 / 2 / 2 / 6; 
`;

export const useless = styled.h5`
    border-radius: 50px;
    background: black;
    white-space: nowrap;
    padding: 10px 22px;
    color: white;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
`;

export const trans = styled.h4`

`;