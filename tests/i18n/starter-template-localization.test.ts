import { describe, expect, it } from "vitest";

import {
  localizeMeasurementUnit,
  localizeStarterItemName,
  localizeStarterTemplateName,
  localizeSystemCategoryName,
} from "@/lib/i18n/starter-template-localization";

describe("starter template localization", () => {
  it("localizes starter template names across locales", () => {
    expect(localizeStarterTemplateName("1-day trip essentials", "es")).toBe(
      "Imprescindibles para 1 día",
    );
    expect(localizeStarterTemplateName("Imprescindibles para 1 día", "ca")).toBe(
      "Imprescindibles per a 1 dia",
    );
    expect(localizeStarterTemplateName("Imprescindibles per a 1 dia", "ru")).toBe(
      "Необходимое на 1 день",
    );
  });

  it("localizes starter item names, categories, and units", () => {
    expect(localizeStarterItemName("Passport", "ru")).toBe("Паспорт");
    expect(localizeStarterItemName("Pasaporte", "ca")).toBe("Passaport");
    expect(localizeSystemCategoryName("Documents", "es")).toBe("Documentos");
    expect(localizeSystemCategoryName("Разное", "en")).toBe("Misc");
    expect(localizeMeasurementUnit("pairs", "ru")).toBe("пар");
    expect(localizeMeasurementUnit("parells", "en")).toBe("pairs");
  });

  it("leaves unknown values untouched", () => {
    expect(localizeStarterTemplateName("My Custom Template", "es")).toBe(
      "My Custom Template",
    );
    expect(localizeStarterItemName("Camera cube", "ru")).toBe("Camera cube");
    expect(localizeMeasurementUnit("liters", "ca")).toBe("liters");
  });
});
