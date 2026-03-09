"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Listing = {
  detected_at: string;
  current_rent: number;
  ended_at: string | null;
  status: string;
};

type Props = {
  listings: Listing[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP");
}

type TooltipPayloadItem = {
  value: number;
  payload: {
    fullDate: string;
    status: string;
    endedAt: string | null;
  };
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0];
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
      <p className="text-sm font-semibold text-gray-900">
        {data.value.toFixed(1)}万円
      </p>
      <p className="text-xs text-gray-500">
        検知日: {data.payload.fullDate}
      </p>
      <p className="text-xs text-gray-500">
        状態: {data.payload.status === "active" ? "募集中" : "終了"}
      </p>
      {data.payload.endedAt && (
        <p className="text-xs text-gray-500">
          終了日: {formatFullDate(data.payload.endedAt)}
        </p>
      )}
    </div>
  );
}

export function RentHistoryChart({ listings }: Props) {
  if (listings.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <p className="text-sm text-gray-400">賃料推移データなし</p>
      </div>
    );
  }

  const chartData = [...listings]
    .sort(
      (a, b) =>
        new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime()
    )
    .map((l) => ({
      date: formatDate(l.detected_at),
      fullDate: formatFullDate(l.detected_at),
      rent: Number((l.current_rent / 10000).toFixed(1)),
      status: l.status,
      endedAt: l.ended_at,
    }));

  const rents = chartData.map((d) => d.rent);
  const minRent = Math.floor(Math.min(...rents) - 1);
  const maxRent = Math.ceil(Math.max(...rents) + 1);
  const avgRent =
    Number((rents.reduce((a, b) => a + b, 0) / rents.length).toFixed(1));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">賃料推移</h3>
        <p className="text-xs text-gray-500">
          平均: {avgRent}万円 / {chartData.length}件
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
          />
          <YAxis
            domain={[minRent, maxRent]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickLine={false}
            tickFormatter={(v: number) => `${v}万`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgRent}
            stroke="#d1d5db"
            strokeDasharray="4 4"
            label={{
              value: `平均 ${avgRent}万`,
              position: "right",
              fontSize: 11,
              fill: "#9ca3af",
            }}
          />
          <Line
            type="monotone"
            dataKey="rent"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#1d4ed8", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
