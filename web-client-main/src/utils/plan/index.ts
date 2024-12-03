import { Plan } from "../../api/Plan/Plan";
import { Studio } from "../../api/Studio/Studio";

const PLAN_LABEL: { [key: string]: string; } = {
    both: "Aplica para we ride y we train",
    "we-ride": "Aplica para we ride",
    "we-hiit": "Aplica para we train",
  }

/**
 * 
 * @param plan Util in card to plan
 * @param studios 
 * @returns 
 */
export const getLabelPlanBystudio = (plan: Plan, studios: Studio[]): string => {
    if(studios.length) { 
      if(!plan.studio_id) {
        return PLAN_LABEL.both;
      }
      const studio = studios.find(({ id }) => id === plan.studio_id) as unknown as Studio | null;
      if(studio) {
        return PLAN_LABEL[studio.slug];
      }
    }

    return ''
   }