import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { GridCard } from "./GridCard";
import { type Icon } from "@tabler/icons-react";

{
  /* <IconWeight className="size-4" aria-hidden="true" /> */
}

interface GridCardBbProps {
  colSpan?: 1 | 2 | 3 | 4;
  title: string;
  TheIcon?: Icon;
  value: string;
  children: React.ReactNode;
}

export function GridCardBb({
  colSpan = 2,
  title,
  TheIcon,
  value,
  children,
}: GridCardBbProps) {
  return (
    <GridCard $colSpan={colSpan}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {/* <Thermometer className="size-4" aria-hidden="true" /> */}
          {TheIcon && <TheIcon className="size-4" aria-hidden="true" />}
          {title}
        </CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </GridCard>
  );
}
