// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { FC } from 'react';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import {
    FormControl,
    FormErrorMessage,
    HStack,
    IconButton,
    Input,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { GrAdd } from 'react-icons/gr';
import Title from './Title';

export interface StakeProps {
    balance: BigNumber;
    onChange: (value: BigNumberish) => void;
    onCancel: () => void;
    onSubmit: (value: BigNumberish) => void;
}

const Stake: FC<StakeProps> = ({ balance, onChange, onCancel, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ stake: number }>({
        defaultValues: {
            stake: parseFloat(formatUnits(balance, 18)),
        },
        mode: 'onChange',
    });

    const validate = (value: number) => {
        const bn = parseUnits(value.toString(), 18);
        if (bn.isZero()) {
            return 'Value must be greater than 0';
        } else if (bn.gt(balance)) {
            return 'Not enough balance';
        }
        return true;
    };

    // notify changes to input values to outside
    watch((data) => onChange(parseUnits(data.stake.toString(), 18)));

    return (
        <HStack justify="space-between">
            <Title
                title="Stake"
                icon={<GrAdd />}
                help="Amount of tokens to stake"
            />
            <HStack align="baseline">
                <FormControl isInvalid={!!errors.stake}>
                    <Input
                        fontSize="xx-large"
                        textAlign="right"
                        type="number"
                        min={0}
                        autoFocus
                        isInvalid={!!errors.stake}
                        {...register('stake', {
                            required: true,
                            valueAsNumber: true,
                            validate,
                        })}
                    />
                    <FormErrorMessage>{errors.stake?.message}</FormErrorMessage>
                </FormControl>
                <Text fontSize="small">CTSI</Text>
                <HStack minW={100}>
                    <Tooltip label="Save" placement="top">
                        <IconButton
                            icon={<CheckIcon />}
                            aria-label="Save"
                            size="md"
                            onClick={handleSubmit((data) =>
                                onSubmit(parseUnits(data.stake.toString(), 18))
                            )}
                        />
                    </Tooltip>
                    <Tooltip label="Cancel" placement="top">
                        <IconButton
                            icon={<CloseIcon />}
                            aria-label="Cancel"
                            size="md"
                            onClick={onCancel}
                        />
                    </Tooltip>
                </HStack>
            </HStack>
        </HStack>
    );
};

export default Stake;
