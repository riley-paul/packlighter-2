import { z } from "zod";

const userInputs = {
  getMe: z.any(),
  remove: z.any(),
};
export default userInputs;
