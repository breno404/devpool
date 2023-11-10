/* eslint-disable camelcase */
import { Box, Button } from '@mui/material';
import React, { useCallback } from 'react';
import { TextInput } from '@components/TextInput';
import { FormProvider, useForm } from 'react-hook-form';
import { PassInput } from '@components/PassInput';
import { useCreateUser, useFeedback } from '@/hooks';
import { Loading } from '@components/Loading';
import { EmptyState } from '@components/EmptyState';
import Image from 'next/image';
import { useUpload } from '@hooks/useUpload';
import { getGitHubUserByToken } from '@services/getGitHubUserByToken.service';
import { parseCookies } from 'nookies';
import { Select } from '@components/Select';
import { useGetRoles } from '@hooks/useGetRoles';
import { useSession } from '@hooks/useSession';
import { IStepsBaseProps } from '../types';
import {
  ActionsContainer, StepContainer, StepContent, StepTitle,
} from '../styles';
import { AvatarContainer, FormContainer, GridContainer } from './AccountForm.styles';

interface IAccountProps extends IStepsBaseProps {
  isVisible: boolean;
  onNext: () => void;
}

type UserType = 'admin' | 'developer' | 'recruiter' ;

interface IFormValues {
    name: string;
    email: string;
    type: UserType
    username: string
    bio: string
    role: string
    avatar_url: string
    cover_url: string
    password: string
    confirmPassword: string
}

const INITIAL_VALUES:IFormValues = {
  name: '',
  email: '',
  type: 'developer',
  username: '',
  bio: '',
  avatar_url: '',
  cover_url: '',
  password: '',
  role: '',
  confirmPassword: '',
};

export function AccountForm({ isVisible, onNext, onPrevious }:IAccountProps) {
  const methods = useForm<IFormValues>({ defaultValues: INITIAL_VALUES });

  const avatar_url = methods.watch('avatar_url');

  const acessToken = parseCookies().accessToken;

  const getGitHubUser = useCallback(async () => {
    if (acessToken) {
      const user = await getGitHubUserByToken(acessToken);
      methods.setValue('name', user?.name || '');
      methods.setValue('username', user?.login || '');
      methods.setValue('email', user?.email || '');
      methods.setValue('avatar_url', user?.avatar_url || '');
      methods.setValue('bio', user?.bio || '');
    }
    return null;
  }, [acessToken, methods]);

  const { status } = useSession();
  const { showMessage } = useFeedback();
  const { data: roles } = useGetRoles();

  const isLogged = status === 'authenticated';

  const mapedRoles = roles?.map((role) => ({
    value: role.name,
    label: role.name,
  }));

  const { createUser, loading: createuserLoading } = useCreateUser({
    input: {
      name: methods.watch('name'),
      email: methods.watch('email'),
      type: 'developer',
      username: methods.watch('username'),
      avatar_url: methods.watch('avatar_url'),
      cover_url: methods.watch('cover_url'),
      password: methods.watch('password'),
      role: methods.watch('role'),
      bio: methods.watch('bio'),
    },
  });
  const { url, openUpload } = useUpload();

  const isLoading = createuserLoading || status === 'loading';

  const onSubmit = methods.handleSubmit(async () => {
    const { data: createUserData } = await createUser();
    if (createUserData?.createUser?.status === 'success') {
      showMessage({
        message: 'Usuário criado com sucesso!',
        type: 'success',
      });
      if (onNext) {
        onNext();
      }
    } else {
      showMessage({
        message: 'Erro ao criar usuário',
        type: 'error',
      });
    }
  });

  React.useEffect(() => {
    if (url) {
      methods.setValue('avatar_url', url);
    }
  }, [url, methods]);

  React.useEffect(() => {
    getGitHubUser();
  }, [getGitHubUser]);

  return isVisible ? (
    <StepContainer>
      <StepTitle>Informações da Conta</StepTitle>

      <StepContent>
        {isLoading && <Loading />}
        {!isLoading && !isLogged && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
          >
            <FormProvider {...methods}>
              <FormContainer>
                <AvatarContainer>
                  <Image
                    src={avatar_url || '/avatar.svg'}
                    width={120}
                    height={120}
                    alt="avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={openUpload}
                  />
                </AvatarContainer>
                <GridContainer>
                  <TextInput
                    name="name"
                    label="Nome"
                    required
                  />

                  <TextInput
                    name="username"
                    label="Username"
                    disabled
                    required
                  />

                  <PassInput
                    name="password"
                    label="Senha"
                    required
                  />

                  <PassInput
                    label="Confirmar senha"
                    name="confirmPassword"
                  />
                  <TextInput
                    name="email"
                    label="E-mail"
                    disabled
                  />
                  <Select
                    name="role"
                    label="Area de Atuação"
                    placeholder="Área de atuação"
                    options={mapedRoles || []}
                  />

                </GridContainer>

                <TextInput
                  name="bio"
                  label="Sobre você"
                  placeholder="Fale um pouco sobre você e o seu trabalho."
                  multiline
                  rows={4}
                />

              </FormContainer>
            </FormProvider>
          </Box>
        )}
        {!isLoading && isLogged && (
          <EmptyState
            type="success"
            message="Etapa concluída. Continue para prosseguir com o cadastro"
          />
        )}

      </StepContent>
      <ActionsContainer>
        <Button
          fullWidth
          variant="outlined"
          onClick={onPrevious}
          color="primary"
        >
          Voltar
        </Button>
        <Button
          fullWidth
          disabled={isLoading}
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit();
          }}
        >
          Continuar
        </Button>
      </ActionsContainer>
    </StepContainer>
  ) : null;
}
