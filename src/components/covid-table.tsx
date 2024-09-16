import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CountryCovidData } from "../types";
import numeral from "numeral";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type Props = {
  countries: CountryCovidData[];
};

const CovidTable = (props: Props) => {
  return (
    <Table className="">
      <TableCaption>Cases By Country</TableCaption>
      <TableHeader>
        <TableRow className="grid grid-cols-3">
          <TableCell>Country</TableCell>
          <TableCell>Cases</TableCell>
          <TableCell>Critical per Million</TableCell>
        </TableRow>
      </TableHeader>
      <ScrollArea className="h-[300px]">
        <TableBody>
          {props.countries.map((tx) => (
            <TableRow
              key={`${tx.countryInfo.iso2}--${tx.countryInfo.lat}`}
              className="grid grid-cols-3"
            >
              <TableCell className="">{tx.country}</TableCell>
              <TableCell className="">
                {numeral(tx.cases).format("0,0")}
              </TableCell>
              <TableCell>
                {numeral(tx.criticalPerOneMillion).format("0,0")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </ScrollArea>
    </Table>
  );
};

export default CovidTable;
