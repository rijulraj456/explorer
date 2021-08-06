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
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
} from '@chakra-ui/react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useForm } from 'react-hook-form';
import BigNumberText from '../BigNumberText';

type AvailableNodeProps = {
    balance: BigNumber;
    onHire: (deposit: BigNumberish) => void;
};

const AvailableNode: FC<AvailableNodeProps> = ({ balance, onHire }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ deposit: number }>();

    const toBigNumber = (value: number, decimals = 18) =>
        ethers.utils.parseUnits(value.toString(), decimals);

    const validate = (value: number) => {
        if (value <= 0) {
            return 'Value must be greater than 0';
        } else if (toBigNumber(value).gt(balance)) {
            return 'Insufficient ETH balance';
        }
        return true;
    };

    return (
        <HStack p={10} spacing={10}>
            <BigNumberText
                value={balance}
                unit="eth"
                color={errors.deposit ? 'red' : undefined}
            >
                <Text>Your Balance</Text>
            </BigNumberText>
            <FormControl isInvalid={!!errors.deposit} w={300}>
                <FormLabel>Deposit</FormLabel>
                <InputGroup>
                    <Input
                        {...register('deposit', {
                            required: true,
                            valueAsNumber: true,
                            validate: validate,
                        })}
                    />
                    <InputRightAddon children="ETH" />
                </InputGroup>
                {!errors.deposit && (
                    <FormHelperText>
                        Amount of ETH to transfer to node on hire
                    </FormHelperText>
                )}
                <FormErrorMessage>{errors.deposit?.message}</FormErrorMessage>
            </FormControl>
            <Button
                onClick={handleSubmit((data) =>
                    onHire(toBigNumber(data.deposit))
                )}
            >
                Hire Node
            </Button>
        </HStack>
    );
};

export default AvailableNode;