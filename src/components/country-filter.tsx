"use client";

import React, { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Country = {
  name: string;
  value: string;
};

type Props = {
  countries: Country[];
  onCountryChange: (value: string) => void;
};

const CountryFilter: React.FC<Props> = ({ countries, onCountryChange }) => {
  const [country, setCountry] = useState("worldwide");

  // Handle country selection
  const handleCountryChange = (value: string) => {
    setCountry(value);
    onCountryChange(value);
  };

  return (
    <Card className="flex flex-col items-center justify-start">
      <CardHeader>
        <CardTitle>COVID - 19 TRACKER</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 items-center justify-start">
          <Label>By Country</Label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((cx) => (
                <SelectItem key={cx.value} value={cx.value}>
                  {cx.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryFilter;
