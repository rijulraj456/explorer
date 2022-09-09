// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FunctionComponent } from 'react';
import {
    HStack,
    Icon,
    Td,
    Tooltip,
    Tr,
    useColorModeValue,
    Button,
    Box,
    Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { LockIcon } from '@chakra-ui/icons';
import { useFlag } from '@unleash/proxy-client-react';
import { StakingPool } from '../../../graphql/models';
import Address from '../../../components/Address';
import { formatCTSI } from '../../../utils/token';
import labels from '../../../utils/labels';
import { StakeInfo } from '../../Icons';

export interface PoolPerformanceTableRowProps {
    chainId: number;
    pool: StakingPool;
    account?: string;
}

const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
});

const PoolPerformanceTableRow: FunctionComponent<
    PoolPerformanceTableRowProps
> = ({ chainId, account, pool }) => {
    const borderColor = useColorModeValue('gray.100', 'header');
    const newPoolPageEnabled = useFlag('newPoolPageEnabled');

    // accured commission
    const accuredCommissionLabel =
        pool.commissionPercentage !== null
            ? numberFormat.format(pool.commissionPercentage)
            : '-';

    let flatRate = pool.fee.commission > 0;
    const gasTax = pool.fee.gas > 0;

    // XXX: if both are zero, currently we don't which is it, for now let's assume it's flat rate
    if (!flatRate && !gasTax) {
        flatRate = true;
    }

    // commission label
    let commissionLabel = '';
    if (flatRate) {
        commissionLabel = `${(pool.fee.commission / 100).toFixed(2)} %`;
    } else if (gasTax) {
        commissionLabel = `${pool.fee.gas} Gas`;
    }

    // commission help tooptip
    let commissionTooltip: string = undefined;
    if (flatRate) {
        commissionTooltip = labels.flatRateCommission;
    } else if (gasTax) {
        commissionTooltip = labels.gasTaxCommission;
    }

    // poor manager is logged user, allow edit
    const edit = account && account.toLowerCase() === pool.manager;

    return (
        <Tr key={pool.id}>
            <Td borderColor={borderColor}>
                <HStack>
                    <Address
                        ens
                        address={pool.id}
                        chainId={chainId}
                        truncated
                        borderRadius="full"
                        size="md"
                        bg="blue.50"
                        px="0.5rem"
                        py="0.25rem"
                        color="gray.900"
                        minWidth="120px"
                    />

                    {edit && (
                        <Box ml={10}>
                            <NextLink href={`/pools/${pool.id}/edit`}>
                                <Button size="sm">Manage</Button>
                            </NextLink>
                        </Box>
                    )}

                    {pool.paused && (
                        <Tooltip
                            placement="top"
                            label="This pool is not accepting stake at the moment"
                            fontSize="small"
                            bg="black"
                            color="white"
                        >
                            <LockIcon w={2.5} h={2.5} />
                        </Tooltip>
                    )}
                </HStack>
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {pool.totalUsers}
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(pool.amount, 2)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(pool.user.totalReward, 2)} CTSI
            </Td>
            <Td borderColor={borderColor}>
                {commissionLabel}{' '}
                {commissionTooltip && (
                    <Tooltip
                        placement="top"
                        label={commissionTooltip}
                        fontSize="small"
                        bg="black"
                        color="white"
                        size="md"
                    >
                        <Icon w={2.5} h={2.5} />
                    </Tooltip>
                )}
            </Td>
            <Td borderColor={borderColor}>{accuredCommissionLabel}</Td>
            <Td
                isNumeric
                borderColor={borderColor}
                position={['sticky', 'sticky', 'initial', 'initial']}
                top={0}
                right={0}
                backgroundColor={['white', 'white', 'transparent']}
                padding={0}
            >
                <Box
                    shadow={['md', 'md', 'none', 'none']}
                    padding={[0, 0, 8, 8]}
                    minHeight={['71px', '71px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display={['flex', 'flex', 'block', 'block']}
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <Link href={`/stake/${pool.id}`} mr={[0, 0, 3]}>
                        <StakeInfo w={8} h={8} />
                    </Link>
                </Box>
            </Td>
        </Tr>
    );
};

export default PoolPerformanceTableRow;