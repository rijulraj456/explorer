// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    UnorderedList,
    Heading,
    Text,
    ListItem,
    Flex,
    Box,
    useClipboard,
    ButtonGroup,
} from '@chakra-ui/react';
// import { CopyIcon } from '@chakra-ui/icons';
import { MdContentCopy } from 'react-icons/md';
import { Step, StepActions, StepBody, StepProps, StepStatus } from '../../Step';

type Props = Pick<StepProps, 'stepNumber'>;

const CopyBoard = ({ command, children }) => {
    const { hasCopied, onCopy } = useClipboard(command);
    return (
        <Flex p={6} bgColor="gray.80" rounded="sm" mt={3} alignItems="center">
            <Box>{children}</Box>{' '}
            {!hasCopied && (
                <Box minH={6} alignSelf="flex-start" ml={2}>
                    <Box
                        as={MdContentCopy}
                        onClick={onCopy}
                        fontSize="xl"
                        minW={6}
                    />
                </Box>
            )}
            {hasCopied && (
                <Text fontSize="sm" ml={2} alignSelf="flex-start">
                    Copied
                </Text>
            )}
        </Flex>
    );
};

const SetUpNode = ({ stepNumber }: Props) => {
    const dockerPullTxt = 'docker pull cartesi/noether';
    const dockerRunTxt = (
        <>
            docker run -it --rm --name cartesi_noether -v
            cartesi_wallet:/root/.ethereum cartesi/noether --url{' '}
            <Text as="span" color="blue.300">
                &lt;https://mainnet.infura.io/v3/project_id&gt;
            </Text>{' '}
            --wallet /root/.ethereum/key --create --verbose;
        </>
    );

    return (
        <Step
            title="Set up Node"
            subtitle="There are a few steps to prepare on your computer"
            stepNumber={stepNumber}
            status={StepStatus.ACTIVE}
        >
            <StepBody>
                <Heading as="h3" size="sm" my={4}>
                    Run Cartesi's node
                </Heading>
                <UnorderedList pl={2}>
                    <ListItem>
                        <Text>
                            Open a terminal and run the following command lines.
                        </Text>
                    </ListItem>
                </UnorderedList>

                <CopyBoard command={dockerPullTxt}>{dockerPullTxt}</CopyBoard>

                <Heading as="h3" size="sm" my={4}>
                    Run your customizing node gateway
                </Heading>
                <Text>
                    Any Ethereum node can be used by replacing that by a local
                    `geth` URL or another service provided by a third-party,
                    like Infura or Alchemy.
                </Text>
                <Text mt={3}>
                    For example, if in the case of using a remote <b>Infura</b>{' '}
                    node you will run:
                </Text>
                <CopyBoard
                    command={
                        'docker run -it --rm --name cartesi_noether -v cartesi_wallet:/root/.ethereum cartesi/noether --url <https://mainnet.infura.io/v3/project_id> --wallet /root/.ethereum/key --create --verbose;'
                    }
                >
                    {dockerRunTxt}
                </CopyBoard>

                <UnorderedList pl={2}>
                    <ListItem>
                        <Heading as="h3" size="sm" my={4} mb={2}>
                            Where &lt;URL&gt; must be replaced by your
                            third-party's URL.
                        </Heading>
                        <Text>
                            The worker node will create a new Ethereum wallet,
                            asking for an encryption password.
                        </Text>
                    </ListItem>
                </UnorderedList>
            </StepBody>
            <StepActions>
                <ButtonGroup spacing={3}>
                    <Button variant="ghost" minW="10rem">
                        PREVIOUS
                    </Button>
                    <Button colorScheme="blue" minW="10rem">
                        NEXT
                    </Button>
                </ButtonGroup>
            </StepActions>
        </Step>
    );
};

export default SetUpNode;