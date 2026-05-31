"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"

import { MEAL_TIMES } from "@/core/domain/meal-time.vo"
import { useAddFoodLog } from "@/lib/api/queries/useFood"
import { useSearchFood } from "@/lib/api/queries/useNutrition"
import {
  foodEntryFormSchema,
  type FoodEntryFormValues,
} from "@/lib/validators/food.schema"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FoodEntryForm() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [comboboxOpen, setComboboxOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: searchData, isFetching: isSearching } =
    useSearchFood(debouncedQuery)

  const form = useForm<FoodEntryFormValues>({
    resolver: zodResolver(foodEntryFormSchema),
    defaultValues: {
      foodName: "",
      grams: 100,
      mealTime: "昼食",
    },
  })

  const selectedFoodName = form.watch("foodName")

  const { mutate, isPending } = useAddFoodLog({
    onSuccess: () => {
      toast.success("食事を記録しました")
      form.reset({ foodName: "", grams: 100, mealTime: form.getValues("mealTime") })
      setSearchQuery("")
    },
    onError: (error) => {
      toast.error(error.message || "記録に失敗しました")
    },
  })

  const onSubmit = (values: FoodEntryFormValues) => {
    mutate(values)
  }

  const suggestions = searchData?.results ?? []

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>食事を記録</CardTitle>
        <CardDescription>
          食材名・量・時間帯を入力して Notion に保存します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="foodName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>食材名</FormLabel>
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value || "食材を検索..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="例: 卵、米..."
                          value={searchQuery}
                          onValueChange={(value) => {
                            setSearchQuery(value)
                            field.onChange(value)
                          }}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {isSearching ? "検索中..." : "該当する食材がありません"}
                          </CommandEmpty>
                          <CommandGroup>
                            {suggestions.map((food) => (
                              <CommandItem
                                key={food.name}
                                value={food.name}
                                onSelect={() => {
                                  field.onChange(food.name)
                                  setSearchQuery(food.name)
                                  setComboboxOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedFoodName === food.name
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                <span>{food.name}</span>
                                {food.nameEn && (
                                  <span className="ml-2 text-muted-foreground text-xs">
                                    {food.nameEn}
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>量 (g)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mealTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>時間帯</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="時間帯を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MEAL_TIMES.map((meal) => (
                        <SelectItem key={meal} value={meal}>
                          {meal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  記録する
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
