"use client";

import { usePathname } from "@/i18n/navigation";
import { Globe, Check } from "lucide-react";

import { LOCALES_INFO } from "@/constants/locales";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocale } from "next-intl";
import { cn, getFlag } from "@/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface FlagIconProps {
  countryCode: string;
  className?: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, className }) => {
  return (
    <span
      className={`w-4 h-4 rounded-full flex-shrink-0 ${className}`}
      title={`Flag of ${countryCode}`}
    >
      {getFlag(countryCode)}
    </span>
  );
};

export default FlagIcon;

export function LocaleSwitcher({
  inSheet = false,
  className,
}: {
  inSheet?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    setDialogOpen(false);
    const newHref = `/${newLocale}${pathname}`;
    window.location.replace(newHref);
  };

  const languageList = (
    <div className="flex flex-col gap-2">
      {LOCALES_INFO.map((localeInfo, index) => (
        <button
          key={index}
          onClick={() => handleLocaleChange(localeInfo.locale)}
          suppressHydrationWarning
          className={cn(
            "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md bg-muted/50 cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-0"
          )}
        >
          <div className="flex items-center space-x-3">
            <FlagIcon countryCode={localeInfo.country} />
            <span className={`flex-grow`}>{localeInfo.name}</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            {/* Beta Indicator */}
            {localeInfo.state === "beta" && (
              <span className="px-1 py-0.5 rounded-full bg-yellow-900/50 text-yellow-400">
                BETA
              </span>
            )}
            {/* Current Selection Checkmark */}
            {localeInfo.locale === locale && (
              <Check className="h-4 w-4 text-indigo-400" />
            )}
          </div>
        </button>
      ))}
    </div>
  );

  if (inSheet) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 cursor-pointer focus-visible:outline-none focus-visible:ring-0",
              className
            )}
          >
            <Globe className="!size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#101010] border-border/50">
          <DialogHeader>
            <DialogTitle>{t("locale_switcher_title")}</DialogTitle>
            <DialogDescription>
              {t("locale_switcher_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">{languageList}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 cursor-pointer focus-visible:outline-none focus-visible:ring-0",
            className
          )}
        >
          <Globe className="!size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-3 ml-4 border-border/50 rounded-lg bg-popover/50 backdrop-blur-lg"
      >
        <DropdownMenuLabel className="text-lg p-0">
          {t("locale_switcher_title")}
        </DropdownMenuLabel>
        <div className="text-xs text-muted-foreground mb-5">
          {t("locale_switcher_description")}
        </div>
        {languageList}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
