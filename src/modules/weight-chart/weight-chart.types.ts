type CategoryWeightSummary = {
  id: string;
  name: string;
  weight: number;
  items: {
    id: string;
    name: string;
    weight: number;
  };
};
