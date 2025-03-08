import { weightUnitsInfo, type Unit } from "@/db/schema";

class Convertible {
  units: Unit[] = [];
  baseUnit: Unit;

  constructor(units: Unit[], baseUnit?: Unit) {
    this.units = units;
    this.baseUnit = baseUnit ?? units[0];
  }

  convert(value: number, from: string, to: string): number {
    const fromUnit = this.units.find((unit) => unit.symbol === from);
    const toUnit = this.units.find((unit) => unit.symbol === to);
    if (!fromUnit || !toUnit) {
      return NaN;
    }
    return (value * fromUnit.multiplier) / toUnit.multiplier;
  }
}

export const WeightConvertible = new Convertible(weightUnitsInfo);
