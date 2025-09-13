import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginData, RegisterData } from '@/services/auth';
import { queryKeys } from '@/lib/queryClient';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (result) => {
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authService.login(data),
    onSuccess: (result) => {
      if (result.user) {
        queryClient.setQueryData(queryKeys.auth.user, result.user);
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.entries.all,
      });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
