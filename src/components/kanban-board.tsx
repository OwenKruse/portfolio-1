"use client";

import { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type KanbanLabelColor =
  | "blue"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "zinc";

export interface KanbanLabel {
  text: string;
  color?: KanbanLabelColor;
}

export interface KanbanAssignee {
  name: string;
  avatar?: string;
}

export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  label?: KanbanLabel;
  assignee?: KanbanAssignee;
  dueDate?: string;
  order?: number;
}

export interface KanbanColumn {
  id: string;
  title: string;
  accent?: KanbanLabelColor;
  emptyText?: string;
}

export interface KanbanBoardData {
  columns: KanbanColumn[];
  cards: KanbanCard[];
}

export interface KanbanBoardProps {
  initialData: KanbanBoardData;
  variant?: "soft" | "minimal" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  columnClassName?: string;
  cardClassName?: string;
  onChange?: (data: KanbanBoardData) => void;
}

const boardVariants = cva(
  "w-full rounded-3xl border border-border/60 p-6",
  {
    variants: {
      variant: {
        soft: "bg-zinc-50/60 dark:bg-zinc-950/40",
        minimal: "bg-transparent border-transparent p-0",
        glass:
          "bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const columnVariants = cva(
  "relative flex flex-1 flex-col gap-4 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm transition-colors duration-200",
  {
    variants: {
      variant: {
        soft: "bg-white/80 dark:bg-zinc-900/60",
        minimal: "bg-background border-border/50 shadow-none",
        glass: "bg-white/40 dark:bg-zinc-900/40 backdrop-blur",
      },
      size: {
        sm: "min-w-[15rem] max-w-[19rem]",
        md: "min-w-[18rem] max-w-[22rem]",
        lg: "min-w-[20rem] max-w-[24rem]",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const cardVariants = cva(
  "group rounded-xl border border-border/60 bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
  {
    variants: {
      variant: {
        soft: "bg-white dark:bg-zinc-950",
        minimal: "bg-background",
        glass: "bg-white/70 dark:bg-zinc-950/70 backdrop-blur",
      },
      size: {
        sm: "p-3 text-sm",
        md: "p-4",
        lg: "p-5 text-base",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const labelClasses: Record<KanbanLabelColor, string> = {
  blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/30",
  violet:
    "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500/30",
  emerald:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30",
  amber:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-500/30",
  rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-200 dark:border-rose-500/30",
  zinc:
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-500/20 dark:text-zinc-200 dark:border-zinc-500/30",
};

const accentClasses: Record<KanbanLabelColor, string> = {
  blue: "bg-blue-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  zinc: "bg-zinc-400",
};

const emptyGridStyle = {
  backgroundImage:
    "radial-gradient(var(--kanban-dot) 1px, transparent 1px)",
  backgroundSize: "16px 16px",
};

function sortCards(cards: KanbanCard[]) {
  return [...cards].sort((a, b) => {
    const aOrder = a.order ?? 0;
    const bOrder = b.order ?? 0;
    if (aOrder === bOrder) {
      return a.title.localeCompare(b.title);
    }
    return aOrder - bOrder;
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function KanbanBoard({
  initialData,
  variant = "soft",
  size = "md",
  className,
  columnClassName,
  cardClassName,
  onChange,
}: KanbanBoardProps) {
  const [cards, setCards] = useState<KanbanCard[]>(() => initialData.cards);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<{
    columnId: string;
    index: number;
  } | null>(null);

  const cardsByColumn = useMemo(() => {
    return initialData.columns.reduce<Record<string, KanbanCard[]>>(
      (acc, column) => {
        acc[column.id] = sortCards(
          cards.filter((card) => card.columnId === column.id)
        );
        return acc;
      },
      {}
    );
  }, [cards, initialData.columns]);

  const moveCard = (
    cardId: string,
    targetColumnId: string,
    targetIndex?: number
  ) => {
    setCards((prev) => {
      const card = prev.find((item) => item.id === cardId);
      if (!card) {
        return prev;
      }
      const remaining = prev.filter((item) => item.id !== cardId);
      const targetCards = sortCards(
        remaining.filter((item) => item.columnId === targetColumnId)
      );
      const insertIndex = clamp(
        targetIndex ?? targetCards.length,
        0,
        targetCards.length
      );
      const nextTargetCards = [...targetCards];
      nextTargetCards.splice(insertIndex, 0, {
        ...card,
        columnId: targetColumnId,
      });
      const nextCards = initialData.columns.flatMap((column) => {
        const columnCards =
          column.id === targetColumnId
            ? nextTargetCards
            : sortCards(
                remaining.filter((item) => item.columnId === column.id)
              );
        return columnCards.map((item, index) => ({
          ...item,
          order: index + 1,
        }));
      });
      onChange?.({ columns: initialData.columns, cards: nextCards });
      return nextCards;
    });
  };

  const getDropIndex = (
    event: React.DragEvent<HTMLDivElement>,
    columnId: string
  ) => {
    const columnCards = cardsByColumn[columnId] ?? [];
    const target = event.target as HTMLElement;
    const cardEl = target.closest<HTMLElement>("[data-kanban-card]");
    if (!cardEl) {
      return columnCards.length;
    }
    const index = Number(cardEl.dataset.index ?? "0");
    const rect = cardEl.getBoundingClientRect();
    const shouldInsertAfter = event.clientY > rect.top + rect.height / 2;
    return shouldInsertAfter ? index + 1 : index;
  };

  const renderDropIndicator = (columnId: string, index: number) => {
    if (dropPosition?.columnId !== columnId || dropPosition.index !== index) {
      return null;
    }
    return (
      <motion.div
        layout
        className="h-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/60 to-primary/10"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
    );
  };

  return (
    <div className={cn(boardVariants({ variant, size }), className)}>
      <div className="flex gap-6 overflow-x-auto pb-6 md:flex-wrap md:overflow-visible">
        {initialData.columns.map((column) => {
          const columnCards = cardsByColumn[column.id] ?? [];
          const isActive =
            activeColumn === column.id ||
            dropPosition?.columnId === column.id;
          return (
            <motion.div
              key={column.id}
              layout
              className={cn(
                columnVariants({ variant, size }),
                columnClassName,
                isActive && "border-primary/40 bg-primary/5"
              )}
              onDragEnter={() => setActiveColumn(column.id)}
              onDragLeave={(event) => {
                if (
                  event.relatedTarget &&
                  event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  return;
                }
                setActiveColumn(null);
                setDropPosition(null);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setActiveColumn(column.id);
                setDropPosition({
                  columnId: column.id,
                  index: getDropIndex(event, column.id),
                });
              }}
              onDrop={(event) => {
                event.preventDefault();
                const cardId = event.dataTransfer.getData("text/plain");
                if (cardId) {
                  moveCard(
                    cardId,
                    column.id,
                    dropPosition?.columnId === column.id
                      ? dropPosition.index
                      : undefined
                  );
                }
                setActiveColumn(null);
                setDropPosition(null);
              }}
            >
              {isActive ? (
                <motion.div
                  layout
                  className="pointer-events-none absolute inset-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              ) : null}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      column.accent ? accentClasses[column.accent] : "bg-zinc-300"
                    )}
                  />
                  <h3 className="text-sm font-semibold">{column.title}</h3>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {columnCards.length}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {columnCards.length === 0 ? (
                  <div
                    className={cn(
                      "flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground transition-colors",
                      "[--kanban-dot:rgba(161,161,170,0.35)] dark:[--kanban-dot:rgba(161,161,170,0.2)]",
                      isActive && "border-primary/40 text-primary"
                    )}
                    style={emptyGridStyle}
                  >
                    <span className="font-medium">
                      {column.emptyText ?? "Drop here"}
                    </span>
                  </div>
                ) : null}
                {columnCards.map((card, index) => (
                  <div key={card.id} className="flex flex-col gap-3">
                    {renderDropIndicator(column.id, index)}
                    <motion.div
                      layout
                      data-kanban-card
                      data-index={index}
                      className={cn(
                        cardVariants({ variant, size }),
                        cardClassName,
                        draggingCard === card.id &&
                          "scale-[0.98] opacity-60 shadow-none"
                      )}
                      draggable
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      onDragStart={(event) => {
                        setDraggingCard(card.id);
                        event.dataTransfer.setData("text/plain", card.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDraggingCard(null);
                        setDropPosition(null);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground">
                          {card.title}
                        </h4>
                        {card.label ? (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "border text-[11px] font-semibold uppercase tracking-wide",
                              labelClasses[card.label.color ?? "zinc"]
                            )}
                          >
                            {card.label.text}
                          </Badge>
                        ) : null}
                      </div>
                      {card.description ? (
                        <p className="text-sm text-muted-foreground">
                          {card.description}
                        </p>
                      ) : null}
                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        {card.dueDate ? <span>{card.dueDate}</span> : <span />}
                        {card.assignee ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {card.assignee.name}
                            </span>
                            <Avatar className="h-7 w-7 border border-border/60">
                              {card.assignee.avatar ? (
                                <AvatarImage
                                  src={card.assignee.avatar}
                                  alt={card.assignee.name}
                                />
                              ) : null}
                              <AvatarFallback className="text-[10px]">
                                {card.assignee.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ) : (
                          <span />
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
                {renderDropIndicator(column.id, columnCards.length)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
