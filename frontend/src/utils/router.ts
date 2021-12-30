import { useLocation } from 'react-router-dom';
import { NonEmptyArray } from './array';

type QueryParameters<Parameter extends string> = Record<
  Parameter,
  string | null
>;

export const useQueryParams = <Parameter extends string>(
  ...params: NonEmptyArray<Parameter>
): QueryParameters<Parameter> => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  return params.reduce((acc, param) => {
    return {
      ...acc,
      [param]: searchParams.get(param),
    };
  }, {} as QueryParameters<Parameter>);
};

export const generatePostUrl = (postId: string): string => {
  return `${window.location.origin}/post/${postId}`;
};
