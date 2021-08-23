// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import StakeForm from '../../components/staking/StakeForm';
import { parseUnits } from 'ethers/lib/utils';

export default {
    title: 'Staking/StakeForm',
    component: StakeForm,
    argTypes: {},
} as ComponentMeta<typeof StakeForm>;

const Template: ComponentStory<typeof StakeForm> = (args) => (
    <StakeForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
    disabled: false,
    allowance: parseUnits('10000', 18),
    releasing: parseUnits('0', 18),
    totalStaked: parseUnits('20000000', 18),
};

export const NoAllowance = Template.bind({});
NoAllowance.args = {
    disabled: false,
    allowance: parseUnits('0', 18),
    releasing: parseUnits('0', 18),
    totalStaked: parseUnits('20000000', 18),
};

export const Releasing = Template.bind({});
Releasing.args = {
    disabled: false,
    allowance: parseUnits('10000', 18),
    releasing: parseUnits('20000', 18),
    totalStaked: parseUnits('20000000', 18),
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
    allowance: parseUnits('10000', 18),
    releasing: parseUnits('20000', 18),
    totalStaked: parseUnits('20000000', 18),
};
