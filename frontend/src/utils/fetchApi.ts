import { UserStatus } from './useUserStatus';

export interface FetchError {
  status: number;
  statusText: string;
  apiError: unknown;
}

const getUserToken = async (
  userStatus?: UserStatus
): Promise<string | undefined> => {
  if (userStatus?.type === 'AUTHENTICATED') {
    return await userStatus.user.getIdToken();
  }
  return undefined;
};

const getHeaders = async (
  options: RequestInit = {},
  userStatus?: UserStatus
): Promise<HeadersInit> => {
  const { headers = {} } = options;
  const userToken = await getUserToken(userStatus);
  if (userToken) {
    return {
      ...headers,
      Authorization: `Bearer ${userToken}`,
    };
  }
  return headers;
};

interface OptionsProps<Type = void>
  extends Omit<RequestInit, 'body'> {
  body?: unknown;
  userStatus?: UserStatus;
  parseResponse?: (response: Response) => Type;
}

const genericFetch = async <Type = void>(
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  url: string,
  optionsProps?: OptionsProps<Type>
) => {
  const { userStatus, parseResponse, body, ...options } =
    optionsProps || {};

  const bodyString = JSON.stringify(body);

  const response = await fetch(url, {
    ...options,
    method,
    body: bodyString,
    headers: await getHeaders(options, userStatus),
  });
  if (parseResponse) {
    return parseResponse(response);
  }
  if (response.ok) {
    const { status } = response;
    if (status === 200) {
      return (await response.json()) as Type;
    }
  }
  const error: FetchError = {
    status: response.status,
    statusText: response.statusText,
    apiError: await response.json(),
  };
  return Promise.reject(error);
};

export const fetchApi = {
  get: async <Type>(
    url: string,
    optionsProps?: OptionsProps<Type>
  ) => {
    return genericFetch<Type>('GET', url, optionsProps);
  },
  post: async <Type>(
    url: string,
    optionsProps?: OptionsProps<Type>
  ) => {
    return genericFetch('POST', url, optionsProps);
  },
  put: async <Type>(
    url: string,
    optionsProps?: OptionsProps<Type>
  ) => {
    return genericFetch<Type>('PUT', url, optionsProps);
  },
  delete: async <Type>(
    url: string,
    optionsProps?: OptionsProps<Type>
  ) => {
    return genericFetch<Type>('DELETE', url, optionsProps);
  },
};
