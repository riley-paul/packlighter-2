import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";

export default function useUsersMutations() {
  const deleteUser = useMutation({
    mutationFn: actions.users.remove.orThrow,
    onSuccess: () => {
      window.location.reload();
    },
  });

  return { deleteUser };
}
