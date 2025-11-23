"use client";

import React from "react";
import { ConfigProvider, Calendar, Badge } from "antd";
import type { BadgeProps, CalendarProps } from "antd";
import type { Dayjs } from "dayjs";

const getListData = (value: Dayjs) => {
  let listData: { type: string; content: string }[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "This is warning event." },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event......" },
        { type: "error", content: "This is error event 1." },
        { type: "error", content: "This is error event 2." },
        { type: "error", content: "This is error event 3." },
        { type: "error", content: "This is error event 4." },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

export const MyCalendar: React.FC = () => {
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month text-white">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge
              status={item.type as BadgeProps["status"]}
              text={<span className="text-gray-200">{item.content}</span>}
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#171717",
          colorBgElevated: "#1a1a1d", // dropdown + card bg
          controlOutline: "rgba(22, 119, 255, 0.4)",
          colorPrimary: "#1677ff",
          colorText: "rgba(255,255,255,0.88)",
          colorTextSecondary: "rgba(255,255,255,0.65)",
          colorSplit: "rgba(255,255,255,0.12)",
          colorBorder: "rgba(255,255,255,0.2)",
          colorTextDisabled: "rgba(255,255,255,0.25)",
          colorBgSpotlight: "#1e1e22",
          controlItemBgHover: "rgba(255,255,255,0.1)",
          controlItemBgActive: "#1677ff22",
          colorBgTextActive: "rgba(255,255,255,0.88)",
          borderRadiusLG: 10,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <Calendar cellRender={cellRender} />
    </ConfigProvider>
  );
};
