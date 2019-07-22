import { BothBundleStats } from "../reducers/schema";

export const fetchBundleData = async (): Promise<BothBundleStats> => {
  return await fetch("./stats.json", {
    mode: "cors"
  }).then(r => r.json()); // TODO read this from URL parameter
};
