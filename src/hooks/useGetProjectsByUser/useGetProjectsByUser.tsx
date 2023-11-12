import { IProjects } from '@/app/api/types/ProjectTypes';
import { gql, useQuery } from '@apollo/client';
import { useSession } from '../useSession';

const GET_PROJECTS_BY_USER = gql`
  query GetProjectsByUser($input: GetProjectsByUserInput!) {
    getProjectsByUser(input: $input) {
      projects {
        id
        name
        description
        image_url
        repo_url
        deployed_url
        technologies{
          id
          name
        }
      }
      status
      message
      
    }
  }
`;

interface IVariables {
  input:{
    userId:string
  }
}

interface IResult {
  getProjectsByUser: {
    projects: IProjects[];
    status: string;
    message: string;
  };
  }

export const useGetProjectsByUser = (userId?:string) => {
  const { user } = useSession();
  const {
    data, loading, error, refetch,
  } = useQuery<IResult, IVariables>(GET_PROJECTS_BY_USER, {
    variables: { input: { userId: `${userId ?? user?.id}` } },
    skip: !userId,
  });

  return {
    data: data?.getProjectsByUser.projects || [],
    loading,
    error,
    refetch,
  };
};