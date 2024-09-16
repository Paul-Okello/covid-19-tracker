import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "../lib/utils";
import { Label } from "./ui/label";

interface Props {
  title: string;
  cases: string;
  isRed?: boolean;
  total: string;
  active: boolean;
  clickFxn: () => void;
}

export default function InfoBox({
  title,
  cases,
  isRed,
  total,
  active,
  clickFxn,
}: Props) {
  return (
    <Card
      onClick={clickFxn}
      className={cn(
        active && "border-t-emerald-400 border-t-4",
        isRed && "border-t-red-500 border-t-4",
        "flex-1 cursor-pointer"
      )}
    >
      <CardHeader>
        <CardTitle className="">{title}</CardTitle>
        <div className="">
          <CardDescription
            // className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
            className={cn("")}
          >
            {" "}
            {cases}{" "}
          </CardDescription>
          <Label className="font-bold text-sm mt-2">{total} Total</Label>
        </div>
      </CardHeader>
    </Card>
  );
}
