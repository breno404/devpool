'use client';

import { styled, Box, Typography } from '@mui/material';

export const StepContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  flex: 1;
`;

export const StepTitle = styled(Typography)`
  font-size: ${({ theme }) => theme.typography.h5.fontSize};
  font-weight: bold;
`;

export const ActionsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: 2rem;


`;

export const StepContent = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex:1;
`;

export const StepSubtitle = styled(Typography)`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: bold;
`;
