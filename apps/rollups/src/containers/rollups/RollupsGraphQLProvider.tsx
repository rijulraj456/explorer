// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

import {
    Icon,
    Input,
    InputGroup,
    InputLeftAddon,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { GrGraphQl } from 'react-icons/gr';
import { Provider } from 'urql';
import { useRollupsGraphQL } from '../../services/useRollupsGraphQL';

type Props = {
    address: string;
    chainId: number;
    children?: React.ReactNode;
};

const networks: Record<number, string> = {
    5: 'goerli',
    421613: 'arbitrum-goerli',
};

const mockPort = 4000;
const shouldUseMock = process.env.NEXT_PUBLIC_USE_GRAPHQL_MOCK === 'true';

const GraphQLProvider: FC<Props> = ({ children, address, chainId }) => {
    const barBgColor = useColorModeValue('white', 'header');
    const [url, setUrl] = useState<string>('');
    const client = useRollupsGraphQL(address, url);
    console.log(url);

    useEffect(() => {
        const networkName = networks[chainId];
        const env = 'staging';
        const url = shouldUseMock
            ? `http://localhost:${mockPort}/graphql`
            : `https://${address}.${networkName}.rollups.${env}.cartesi.io/graphql`;
        setUrl(url);
    }, [address, chainId]);

    if (!client) {
        return <div />;
    }
    return (
        <VStack align="stretch">
            <InputGroup
                position="sticky"
                top="100px"
                bg={barBgColor}
                zIndex="var(--chakra-zIndices-xxl)"
            >
                <InputLeftAddon>
                    <Icon as={GrGraphQl} />
                </InputLeftAddon>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} />
            </InputGroup>
            <Provider value={client}>{children}</Provider>
        </VStack>
    );
};

export default GraphQLProvider;
