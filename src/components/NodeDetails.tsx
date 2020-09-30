// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useContext, useEffect, useState } from 'react';
import { formatEther } from '@ethersproject/units';
import { Button, Descriptions, Spin, Row, Col } from 'antd';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useBalance, useAccount, NULL_ADDRESS } from '../services/eth';
import { useWorkerManager } from '../services/workerManager';
import { useWorkerAuthManager } from '../services/workerAuthManager';

import { DataContext } from './DataContext';
import { networks } from '../utils/networks';

const NodeDetails = ({ address }) => {
    const { chainId } = useWeb3React<Web3Provider>();

    const account = useAccount(0);
    const [posAddress, setPosAddress] = useState<string>(null);

    useEffect(() => {
        if (chainId) {
            const network = networks[chainId];
            const posArtifact = require(`@cartesi/pos/deployments/${network}/PoS.json`);
            setPosAddress(posArtifact?.address);
        }
    }, [chainId]);

    const {
        user,
        available,
        pending,
        owned,
        retired,
        loading,
        hire,
        cancelHire,
        retire,
    } = useWorkerManager(address);

    const {
        authorize
    } = useWorkerAuthManager(address);

    const {
        submitting,
    } = useContext(DataContext);

    // make balance depend on owner, so if it changes we update the balance
    const balance = useBalance(address, [user]);

    return (
        <Row align='middle' gutter={16}>
            <Col>
                <Descriptions
                    bordered
                    size='small'
                    column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Address">{address}</Descriptions.Item>
                    <Descriptions.Item label="Balance">
                        {formatEther(balance)} ETH
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner">
                        {loading && <Spin />}
                        {user === NULL_ADDRESS ? <i>&lt;none&gt;</i> : user}{' '}
                        {pending && <i>(pending)</i>}
                        {retired && <i>(retired)</i>}
                    </Descriptions.Item>
                </Descriptions>
            </Col>

            <Col>
                {account && available && (
                    <Button
                        onClick={hire}
                        type="primary"
                        style={{ marginTop: '16px' }}
                        loading={submitting}
                    >
                        Hire node
                    </Button>
                )}
                {account && pending && (
                    <Button
                        onClick={cancelHire}
                        type="primary"
                        style={{ marginTop: '16px' }}
                        loading={submitting}
                    >
                        Cancel hire
                    </Button>
                )}
                {account && owned && (
                    <>
                        <Button
                            onClick={() => authorize(posAddress)}
                            type="primary"
                            style={{ marginTop: '16px' }}
                            loading={submitting}
                        >
                            Authorize
                        </Button>

                        <Button
                            onClick={retire}
                            type="primary"
                            style={{ marginTop: '16px' }}
                            loading={submitting}
                        >
                            Retire node
                    </Button>
                    </>
                )}
            </Col>
        </Row>
    );
};

export default NodeDetails;