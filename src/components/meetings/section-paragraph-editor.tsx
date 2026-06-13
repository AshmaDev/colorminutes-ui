"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  Info,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { RichTextEditor } from "@/components/meetings/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import type { ParagraphVariant } from "@/lib/schemas";
import {
  PARAGRAPH_VARIANTS,
  paragraphVariantDotClass,
  paragraphVariantLabelKey,
} from "@/lib/paragraph-variants";
import { cn } from "@/lib/utils";

const variantIcons: Record<
  ParagraphVariant,
  ComponentType<{ className?: string }>
> = {
  normal: Circle,
  important: Sparkles,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
  danger: TriangleAlert,
};

export type EditableParagraph = {
  clientId: string;
  id?: string;
  content: string;
  sortOrder: number;
  variant: ParagraphVariant;
};

type SectionParagraphEditorProps = {
  paragraph: EditableParagraph;
  index: number;
  canRemove: boolean;
  onChange: (patch: Partial<Pick<EditableParagraph, "content" | "variant">>) => void;
  onRemove: () => void;
};

export function SectionParagraphEditor({
  paragraph,
  index,
  canRemove,
  onChange,
  onRemove,
}: SectionParagraphEditorProps) {
  const t = useTranslations("meetings");
  const VariantIcon = variantIcons[paragraph.variant];

  return (
    <div className="space-y-2 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="text-sm text-foreground/70">
          {t("paragraphLabel", { number: index + 1 })}
        </Label>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-foreground/80"
                />
              }
            >
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  paragraphVariantDotClass[paragraph.variant],
                )}
                aria-hidden
              />
              <VariantIcon className="size-4" aria-hidden />
              {t(paragraphVariantLabelKey(paragraph.variant))}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PARAGRAPH_VARIANTS.map((variant) => {
                const Icon = variantIcons[variant];
                return (
                  <DropdownMenuItem
                    key={variant}
                    onClick={() => onChange({ variant })}
                  >
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        paragraphVariantDotClass[variant],
                      )}
                      aria-hidden
                    />
                    <Icon className="size-4" aria-hidden />
                    {t(paragraphVariantLabelKey(variant))}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          {canRemove && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0 text-foreground/60 hover:text-destructive"
                    aria-label={t("deleteParagraph")}
                  />
                }
              >
                <Trash2 className="size-4" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" onClick={onRemove}>
                  <Trash2 className="size-4" aria-hidden />
                  {t("deleteParagraph")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <RichTextEditor
        value={paragraph.content}
        onChange={(html) => onChange({ content: html })}
        placeholder={t("paragraphContentPlaceholder")}
      />
    </div>
  );
}
