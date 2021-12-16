// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import {
    Table,
    Tbody,
    Td,
    Text,
    Tr,
    Th,
    Thead,
    HStack,
    Spinner,
    Link,
} from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import PoolRowExtended from './PoolRowExtended';
import { StakingPoolFlat, StakingPoolSortExtended } from '../../graphql/models';
import { TableResponsiveHolder } from '../TableResponsiveHolder';

export interface PoolTableExtendedProps {
    chainId: number;
    account?: string;
    loading: boolean;
    data?: StakingPoolFlat[];
    sort?: StakingPoolSortExtended;
    onSort: (order: StakingPoolSortExtended) => void;
}

const PoolTableExtended: FC<PoolTableExtendedProps> = ({
    chainId,
    account,
    data,
    loading,
    sort,
    onSort,
}) => {
    return (
        <TableResponsiveHolder>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Address</Th>

                        <Th isNumeric>
                            <Link onClick={() => onSort('totalUsers')}>
                                Total Users
                            </Link>
                            {sort == 'totalUsers' && <ArrowDownIcon />}
                        </Th>
                        <Th isNumeric>
                            <Link onClick={() => onSort('amount')}>
                                Total Staked
                            </Link>
                            {sort == 'amount' && <ArrowDownIcon />}
                        </Th>
                        <Th isNumeric>Total Rewards</Th>
                        <Th isNumeric>
                            <Link onClick={() => onSort('weekPerformance')}>
                                7-days % (annual)
                            </Link>
                            {sort == 'weekPerformance' && <ArrowDownIcon />}
                        </Th>

                        <Th isNumeric>
                            <Link onClick={() => onSort('monthPerformance')}>
                                30-days % (annual)
                            </Link>
                            {sort == 'monthPerformance' && <ArrowDownIcon />}
                        </Th>

                        <Th>Configured Commission</Th>
                        <Th>
                            <Link
                                onClick={() => onSort('commissionPercentage')}
                            >
                                Accrued Commission
                            </Link>{' '}
                            {sort == 'commissionPercentage' && (
                                <ArrowDownIcon />
                            )}
                        </Th>
                    </Tr>
                </Thead>

                <Tbody>
                    {loading && (
                        <Tr>
                            <Td colSpan={9} textAlign="center">
                                <HStack justify="center">
                                    <Spinner />
                                    <Text>Loading</Text>
                                </HStack>
                            </Td>
                        </Tr>
                    )}
                    {!loading &&
                        (!data ||
                            (data.length === 0 && (
                                <Tr>
                                    <Td colSpan={9} textAlign="center">
                                        <Text>No items</Text>
                                    </Td>
                                </Tr>
                            )))}
                    {!loading &&
                        data &&
                        data.length > 0 &&
                        data.map((pool) => (
                            <PoolRowExtended
                                key={pool.id}
                                chainId={chainId}
                                pool={pool}
                                account={account}
                            />
                        ))}
                </Tbody>
            </Table>
        </TableResponsiveHolder>
    );
};

export default PoolTableExtended;