import useMutationHelpers from "@/app/hooks/use-mutation-helpers";
import { useMutation } from "@tanstack/react-query";
import { actions } from "astro:actions";

export default function useFeedbackMutations() {
  const { toastSuccess } = useMutationHelpers();
  const addFeedback = useMutation({
    mutationFn: actions.feedback.create.orThrow,
    onSuccess: () => {
      toastSuccess("Feedback submitted");
    },
  });

  return { addFeedback };
}
