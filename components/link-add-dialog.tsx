"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Link2, Type, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Zod Schema for validation
const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "제목은 최소 2자 이상이어야 합니다." })
    .max(30, { message: "제목은 최대 30자까지 입력 가능합니다." }),
  url: z
    .string()
    .min(1, { message: "URL을 입력해주세요." })
    .regex(
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/,
      { message: "올바른 URL 형식이 아닙니다 (예: example.com)" }
    ),
})

type FormData = z.infer<typeof formSchema>

interface LinkAddDialogProps {
  onAdd: (link: { title: string; url: string }) => void
}

export function LinkAddDialog({ onAdd }: LinkAddDialogProps) {
  const [open, setOpen] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
    },
  })

  const onSubmit = (data: FormData) => {
    // Standardize URL
    const formattedUrl = data.url.startsWith("http") 
      ? data.url 
      : `https://${data.url}`

    onAdd({
      title: data.title,
      url: formattedUrl,
    })
    
    // Reset and close
    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) reset()
    }}>
      <DialogTrigger
        render={
          <Button 
            className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
            <span>새 링크 추가</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[400px] bg-card/95 backdrop-blur-2xl border-muted-foreground/20 rounded-2xl p-0 overflow-hidden shadow-2xl">
        <div className="bg-primary/5 p-6 pb-4 border-b border-muted-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
               링크 추가
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/60 font-medium">
              새로운 채널이나 웹사이트 주소를 등록하세요.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-8 grid gap-8">
          {/* Title Field */}
          <div className="grid gap-2.5 relative">
            <Label 
              htmlFor="title" 
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors",
                errors.title ? "text-destructive" : "text-muted-foreground/50"
              )}
            >
              <div className="flex items-center gap-1.5">
                <Type className="w-3 h-3" />
                제목
              </div>
            </Label>
            <Input
              id="title"
              placeholder="예: 인스타그램, 포트폴리오 등"
              {...register("title")}
              className={cn(
                "bg-muted/30 border-muted-foreground/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all h-12 rounded-xl text-sm font-semibold px-4",
                errors.title && "border-destructive/40 focus:border-destructive/60 focus:ring-destructive/20 bg-destructive/5"
              )}
            />
            {errors.title && (
              <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                {errors.title.message}
              </div>
            )}
          </div>

          {/* URL Field */}
          <div className="grid gap-2.5 relative mt-2">
            <Label 
              htmlFor="url" 
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors",
                errors.url ? "text-destructive" : "text-muted-foreground/50"
              )}
            >
               <div className="flex items-center gap-1.5">
                <Link2 className="w-3 h-3" />
                URL 주소
              </div>
            </Label>
            <Input
              id="url"
              placeholder="example.com"
              {...register("url")}
              className={cn(
                "bg-muted/30 border-muted-foreground/10 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all h-12 rounded-xl text-sm font-semibold px-4",
                errors.url && "border-destructive/40 focus:border-destructive/60 focus:ring-destructive/20 bg-destructive/5"
              )}
            />
            {errors.url && (
              <div className="absolute -bottom-5 left-1 flex items-center gap-1 text-[10px] font-bold text-destructive animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                {errors.url.message}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className="w-full h-12 font-black text-sm uppercase tracking-wider shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
            >
              {isSubmitting ? "추가 중..." : "링크 추가하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
