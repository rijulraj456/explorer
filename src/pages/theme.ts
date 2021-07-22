// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    components: {
        Button: {
            baseStyle: {
                borderRadius: 0,
                fontWeight: 'normal',
            },
            variants: {
                solid: {
                    bg: 'gray.800',
                    color: 'white',
                    _hover: {
                        bg: 'gray.700',
                    },
                },
            },
            defaultProps: {
                size: 'lg',
            },
        },
        Link: {
            baseStyle: {
                _hover: { color: '#007bff', textDecoration: 'none' },
            },
        },
        Table: {
            variants: {
                simple: {
                    th: {
                        fontFamily: 'Rubik',
                        backgroundColor: 'black',
                        color: 'white',
                        textTransform: 'none',
                    },
                },
            },
            sizes: {
                sm: {
                    th: {
                        lineHeight: '40px',
                    },
                    td: {
                        fontSize: 'small',
                        lineHeight: '40px',
                    },
                },
            },
        },
    },
    fonts: {
        body: 'Rubik',
        heading: 'Rubik',
    },
});

export default theme;