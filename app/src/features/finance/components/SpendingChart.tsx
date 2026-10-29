import React from "react";
import { CashflowChart, type CashflowChartProps } from "./CashflowChart";

export const SpendingChart: React.FC<CashflowChartProps> = (props) => {
  return <CashflowChart {...props} />;
};

export default SpendingChart;
