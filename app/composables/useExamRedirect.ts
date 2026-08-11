import type { Timeslot } from "~~/shared/types/exams";

export const useExamRedirect = () => {
  const getRedirectUrl = (_timeslot: Timeslot) => {
    return "";
  };

  return {
    getRedirectUrl,
  };
};
