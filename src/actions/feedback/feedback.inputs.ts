import { z } from "zod";

const feedbackInputs = {
  create: z.object({
    feedback: z.string(),
  }),
};
export default feedbackInputs;
