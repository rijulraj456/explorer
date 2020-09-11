// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useContext, useState, useEffect } from 'react';
import Web3Context from '../components/Web3Context';
import { WorkerManager } from '../contracts/WorkerManager';
import { WorkerManagerFactory } from '../contracts/WorkerManagerFactory';
import { parseUnits } from '@ethersproject/units';

type AbiMap = Record<number, any>;
const workerManagerJson: AbiMap = {
    31337: require('@cartesi/util/deployments/localhost/WorkerManagerImpl.json'),
};

/*
export const useManager = () => {
    const { provider, chain } = useContext(Web3Context);
    const [workerManager, setWorkerManager] = useState<WorkerManager>();
    const [error, setError] = useState('');

    useEffect(() => {
        if (provider) {
            const address = workerManagerJson[chain.chainId]?.address;
            if (!address) {
                setError(
                    `WorkerManager not deployed at network '${chain.name}'`
                );
            }
            console.log(
                `Attaching WorkerManager to address '${address}' deployed at network '${chain.name}'`
            );
            setWorkerManager(
                WorkerManagerFactory.connect(address, provider.getSigner())
            );
            setError('');
        }
    }, [provider, chain]);

    return {
        workerManager,
        error,
    };
};
*/

export const useWorkerManager = (worker: string) => {
    const { provider, chain } = useContext(Web3Context);
    const [workerManager, setWorkerManager] = useState<WorkerManager>();

    const [user, setUser] = useState<string>('');
    const [owned, setOwned] = useState<boolean>(false);
    const [available, setAvailable] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const [retired, setRetired] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the WorkerManager, asynchronously
    useEffect(() => {
        if (provider) {
            const address = workerManagerJson[chain.chainId]?.address;
            if (!address) {
                setError(
                    `WorkerManager not deployed at network '${chain.name}'`
                );
                return;
            }
            console.log(
                `Attaching WorkerManager to address '${address}' deployed at network '${chain.name}'`
            );
            setWorkerManager(
                WorkerManagerFactory.connect(address, provider.getSigner())
            );
        }
    }, [provider, chain]);

    const updateState = async (
        workerManager: WorkerManager,
        worker: string
    ) => {
        if (workerManager) {
            const available = await workerManager.isAvailable(worker);
            const owned = await workerManager.isOwned(worker);
            const retired = await workerManager.isRetired(worker);
            setAvailable(available);
            setOwned(owned);
            setRetired(retired);
            setPending(!available && !owned && !retired);
            setUser(await workerManager.getUser(worker));
        }
    };

    useEffect(() => {
        if (workerManager) {
            setLoading(true);
            setError('');
            updateState(workerManager, worker)
                .then(() => setLoading(false))
                .catch((e) => setError(e.message));
        }
    }, [workerManager, worker]);

    const hire = async () => {
        if (workerManager) {
            // XXX: move this to a parameter
            const value = parseUnits('1', 'finney');

            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await workerManager.hire(worker, {
                    value,
                });

                // wait for confirmation
                await transaction.wait(1);

                // query owner again
                await updateState(workerManager, worker);
                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const cancelHire = async () => {
        if (workerManager) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await workerManager.cancelHire(worker);

                // wait for confirmation
                await transaction.wait(1);

                // query owner again
                await updateState(workerManager, worker);
                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const retire = async () => {
        if (workerManager) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await workerManager.retire(worker);

                // wait for confirmation
                await transaction.wait(1);

                // query owner again
                await updateState(workerManager, worker);
                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    return {
        workerManager,
        user,
        available,
        pending,
        owned,
        retired,
        loading,
        submitting,
        error,
        hire,
        cancelHire,
        retire,
    };
};

export const useUserWorkers = (worker: string, user: string) => {
    const { workerManager } = useWorkerManager(worker);
    const [workers, setWorkers] = useState<string[]>([]);

    useEffect(() => {
        if (workerManager) {
            Promise.all([
                workerManager.queryFilter(
                    workerManager.filters.JobAccepted(null, user)
                ),
                workerManager.queryFilter(
                    workerManager.filters.Retired(null, user)
                ),
            ]).then(([hires, retires]) => {
                // merge claim and release events into a single list
                // and sort by block number
                const events = [...hires, ...retires].sort(
                    (a, b) => a.blockNumber - b.blockNumber
                );

                // build final list of proxies considering every claim and release event
                // in history for the user
                const proxies = events.reduce((array: string[], ev) => {
                    const args: any = ev.args;
                    const worker = args.worker;
                    if (ev.event === 'JobAccepted') {
                        array.push(worker);
                    } else if (ev.event === 'Retired') {
                        array.splice(array.indexOf(worker), 1);
                    }
                    return array;
                }, []);
                setWorkers(workers);
            });
        }
    }, [workerManager, user]);

    return workers;
};