"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pencil, Trash2, Check, X, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "최소 2자 이상" })
    .max(30, { message: "최대 30자" }),
  url: z
    .string()
    .min(1, { message: "URL 입력" })
    .regex(
      /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/,
      { message: "올바른 URL 형식" }
    ),
})

type FormData = z.infer<typeof formSchema>

interface LinkItemProps {
  link: { id: string; title: string; url: string }
  onUpdate?: (id: string, data: { title: string; url: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function LinkItem({ link, onUpdate, onDelete }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: link.title,
      url: link.url,
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const formattedUrl = data.url.startsWith("http")
        ? data.url
        : `https://${data.url}`

      if (data.title === link.title && formattedUrl === link.url) {
        setIsEditing(false)
        return
      }

      if (onUpdate) {
        await onUpdate(link.id, {
          title: data.title,
          url: formattedUrl,
        })
      }
      setIsEditing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    reset({ title: link.title, url: link.url })
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      if (onDelete) {
        await onDelete(link.id)
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="overflow-hidden border-primary/30 shadow-lg bg-card/60 backdrop-blur-md mb-4 p-4 animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2 relative">
            <Label htmlFor={`title-${link.id}`} className="text-xs font-bold text-muted-foreground">
              제목
            </Label>
            <Input
              id={`title-${link.id}`}
              {...register("title")}
              className={cn(
                "h-10",
                errors.title && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.title && (
              <span className="text-[10px] text-destructive absolute -bottom-4 left-0">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="grid gap-2 relative mt-2">
            <Label htmlFor={`url-${link.id}`} className="text-xs font-bold text-muted-foreground">
              URL
            </Label>
            <Input
              id={`url-${link.id}`}
              {...register("url")}
              className={cn(
                "h-10",
                errors.url && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {errors.url && (
              <span className="text-[10px] text-destructive absolute -bottom-4 left-0">
                {errors.url.message}
              </span>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-1" />
              취소
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              저장
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <>
      <div className="group relative mb-4">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
        >
          <Card className="overflow-hidden border-muted-foreground/15 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 bg-card/60 backdrop-blur-md">
            <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0 relative">
              <div className="w-11 h-11 rounded-xl bg-muted/40 flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/60 group-hover:border-primary/20 transition-colors shadow-inner">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                  alt=""
                  className="w-6 h-6 object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${new URL(link.url).hostname}`
                  }}
                />
              </div>
              <div className="flex-grow flex items-center justify-between gap-2 pr-16">
                <CardTitle className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors truncate">
                  {link.title}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
        </a>

        {/* Action Buttons Container */}
        {(onUpdate || onDelete) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            {onUpdate && (
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-xs border border-border/50 hover:bg-muted text-muted-foreground hover:text-primary transition-colors shadow-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditing(true)
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-xs border border-border/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shadow-sm"
                onClick={(e) => {
                  e.preventDefault()
                  setIsDeleteModalOpen(true)
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제할 링크 정보:
            </AlertDialogDescription>
            <div className="space-y-2 mt-2 text-left">
              <div className="p-3 bg-muted rounded-md text-sm font-medium text-foreground">
                {link.title}
              </div>
              <div className="text-destructive font-bold flex items-center gap-1.5 mt-4 text-sm">
                <AlertCircle className="w-4 h-4" />
                이 작업은 되돌릴 수 없습니다.
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
