import React from "react";

import { Bar, BarChart, CartesianGrid, LabelList, YAxis } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import "./Main.css";

const chartConfig = {
  answerA: {
    label: "Answer A",
    color: "#2EB67D",
  },
  answerB: {
    label: "Answer B",
    color: "#ECB22E",
  },
  answerC: {
    label: "Answer C",
    color: "#E01E5B",
  },
  answerD: {
    label: "Answer D",
    color: "#36C5F0",
  },
} satisfies ChartConfig;

interface ChartData {
  answerA: number;
  answerB: number;
  answerC: number;
  answerD: number;
}

interface StatsProps {
  chartData: ChartData[];
  correctAnswer: number;
  falseAnswerClassChart: string;
}

const Stats: React.FC<StatsProps> = ({
  chartData,
  correctAnswer,
  falseAnswerClassChart,
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="w-full aspect-w-16 aspect-h-9 z-10 statsChart mb-8"
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <YAxis hide domain={[0, "dataMax + 5"]} />
        <Bar
          dataKey="answerA"
          fill="var(--color-answerA)"
          radius={4}
          className={correctAnswer !== 0 ? falseAnswerClassChart : ""}
        >
          <LabelList dataKey="answerA" position="top" className="text-xl" />
        </Bar>
        <Bar
          dataKey="answerB"
          fill="var(--color-answerB)"
          radius={4}
          className={correctAnswer !== 1 ? falseAnswerClassChart : ""}
        >
          <LabelList dataKey="answerB" position="top" className="text-xl" />
        </Bar>
        <Bar
          dataKey="answerC"
          fill="var(--color-answerC)"
          radius={4}
          className={correctAnswer !== 2 ? falseAnswerClassChart : ""}
        >
          <LabelList dataKey="answerC" position="top" className="text-xl" />
        </Bar>
        <Bar
          dataKey="answerD"
          fill="var(--color-answerD)"
          radius={4}
          className={correctAnswer !== 3 ? falseAnswerClassChart : ""}
        >
          <LabelList dataKey="answerD" position="top" className="text-xl" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export default Stats;
