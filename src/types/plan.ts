export type Plan = {
  id: number;
  name: string;
  monthlyPrice: number;
  activeSubscriptions: number;
};

export type PlanInput = {
  name: string;
  monthlyPrice: number;
};
