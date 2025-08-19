"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  Download,
  FileImage,
  Palette,
  Type,
  Trash2,
  Copy,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  Move,
  ZoomIn,
  ZoomOut,
  Grid,
  ExternalLink,
} from "lucide-react"
import LogViewer from "@/components/log-viewer"
import { cn } from "@/lib/utils"

interface TextSettings {
  font: string
  size: number
  color: string
  align: "left" | "center" | "right"
  bold: boolean
  italic: false
  underline: boolean
  shadow: boolean
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  letterSpacing: number
  lineHeight: number
}

interface NameArea {
  x: number
  y: number
  width: number
  height: number
  id: string
  name: string
  content: string // Add this new field
}

export interface LogEntry {
  id: string
  type: "info" | "success" | "warning" | "error"
  message: string
  timestamp: Date
}

const GOOGLE_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Source Sans Pro",
  "Raleway",
  "Poppins",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Oswald",
  "Ubuntu",
  "Libre Baskerville",
  "Crimson Text",
  "Lora",
  "PT Sans",
  "Droid Sans",
  "Noto Sans",
  "Fira Sans",
  "Work Sans",
  "Inter",
  "Rubik",
  "Karla",
  "Barlow",
  "DM Sans",
]

export default function CertificateGenerator() {
  const [templateImage, setTemplateImage] = useState<string | null>(null)
  const [nameAreas, setNameAreas] = useState<NameArea[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [textSettings, setTextSettings] = useState<TextSettings>({
    font: "Montserrat",
    size: 48,
    color: "#ffffff",
    align: "center",
    bold: false,
    italic: false,
    underline: false,
    shadow: true,
    shadowColor: "#000000",
    shadowBlur: 4,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    letterSpacing: 0,
    lineHeight: 1.2,
  })
  const [previewName, setPreviewName] = useState("John Doe")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [canvasScale, setCanvasScale] = useState(1)
  const [showGrid, setShowGrid] = useState(false)
  const [templateDimensions, setTemplateDimensions] = useState({ width: 0, height: 0 })
  const [customFonts, setCustomFonts] = useState<string[]>([])
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [names, setNames] = useState<string[]>([])
  const [nameInput, setNameInput] = useState("")

  const getIsBlockedMobile = () => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ""
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const smallViewport = window.innerWidth < 1024
    // Block if mobile UA, or small screen, or touch device with smaller viewport
    return isMobileUA || smallViewport || (hasTouch && window.innerWidth < 1280)
  }

  const [isBlockedMobile, setIsBlockedMobile] = useState<boolean>(() => getIsBlockedMobile())

  useEffect(() => {
    const handle = () => setIsBlockedMobile(getIsBlockedMobile())
    handle()
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const fontInputRef = useRef<HTMLInputElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Gate: desktop/laptop only (>= 1024px)
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    }
    setLogs((prev) => [newLog, ...prev.slice(0, 49)])
  }, [])

  const addDefaultTextArea = useCallback(() => {
    if (!templateImage) {
      addLog("error", "Please upload a template image first to add a text area.")
      return
    }
    const defaultWidth = Math.min(templateDimensions.width * 0.8, 400)
    const defaultHeight = Math.min(templateDimensions.height * 0.15, 100)
    const defaultX = (templateDimensions.width - defaultWidth) / 2
    const defaultY = (templateDimensions.height - defaultHeight) / 2

    const newArea: NameArea = {
      id: Date.now().toString(),
      name: `Text Area ${nameAreas.length + 1}`,
      content: "", // Add this line
      x: defaultX,
      y: defaultY,
      width: defaultWidth,
      height: defaultHeight,
    }

    setNameAreas((prev) => [...prev, newArea])
    setSelectedAreaId(newArea.id)
    addLog("success", `Added new text area: ${newArea.name}`)
  }, [templateImage, templateDimensions, nameAreas.length, addLog])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const mainContent = mainContentRef.current
    if (!canvas || !templateImage || !mainContent) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const toolbarHeight = 56
      const padding = 32
      const availableWidth = mainContent.offsetWidth - padding * 2
      const availableHeight = mainContent.offsetHeight - padding * 2 - toolbarHeight

      const { width: originalWidth, height: originalHeight } = img
      let baseScale = 1

      if (originalWidth > availableWidth || originalHeight > availableHeight) {
        const widthRatio = availableWidth / originalWidth
        const heightRatio = availableHeight / originalHeight
        baseScale = Math.min(widthRatio, heightRatio)
      }

      const effectiveScale = baseScale * zoomLevel

      canvas.width = originalWidth * effectiveScale
      canvas.height = originalHeight * effectiveScale
      setCanvasScale(effectiveScale)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      if (showGrid) {
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        const gridSize = 20 * effectiveScale
        for (let x = 0; x <= canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      nameAreas.forEach((area) => {
        const scaledArea = {
          x: area.x * effectiveScale,
          y: area.y * effectiveScale,
          width: area.width * effectiveScale,
          height: area.height * effectiveScale,
        }

        ctx.strokeStyle = area.id === selectedAreaId ? "#3b82f6" : "#10b981"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(scaledArea.x, scaledArea.y, scaledArea.width, scaledArea.height)

        ctx.fillStyle = area.id === selectedAreaId ? "#3b82f6" : "#10b981"
        ctx.font = "bold 12px Inter"
        ctx.textAlign = "left"
        ctx.setLineDash([])
        ctx.fillText(area.name, scaledArea.x, scaledArea.y - 5)

        ctx.fillStyle = textSettings.color
        let fontStyle = ""
        if (textSettings.bold) fontStyle += "bold "
        if (textSettings.italic) fontStyle += "italic "
        ctx.font = `${fontStyle}${textSettings.size * effectiveScale}px ${textSettings.font}`
        ctx.textAlign = textSettings.align

        if (textSettings.shadow) {
          ctx.shadowColor = textSettings.shadowColor
          ctx.shadowBlur = textSettings.shadowBlur * effectiveScale
          ctx.shadowOffsetX = textSettings.shadowOffsetX * effectiveScale
          ctx.shadowOffsetY = textSettings.shadowOffsetY * effectiveScale
        } else {
          ctx.shadowColor = "transparent"
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }

        let textX = scaledArea.x
        if (textSettings.align === "center") {
          textX = scaledArea.x + scaledArea.width / 2
        } else if (textSettings.align === "right") {
          textX = scaledArea.x + scaledArea.width
        }

        const textY = scaledArea.y + scaledArea.height / 2 + (textSettings.size * effectiveScale) / 3

        if (textSettings.underline) {
          const displayText = area.content || area.name || "Sample Text"
          const metrics = ctx.measureText(displayText)
          const underlineY = textY + 4
          ctx.beginPath()
          let underlineX = textX
          const underlineWidth = metrics.width

          if (textSettings.align === "center") {
            underlineX = textX - metrics.width / 2
          } else if (textSettings.align === "right") {
            underlineX = textX - metrics.width
          }

          ctx.moveTo(underlineX, underlineY)
          ctx.lineTo(underlineX + underlineWidth, underlineY)
          ctx.strokeStyle = textSettings.color
          ctx.lineWidth = 2
          ctx.stroke()
        }

        const displayText = area.content || area.name || "Sample Text"
        ctx.fillText(displayText, textX, textY)
      })
    }
    img.src = templateImage
  }, [templateImage, nameAreas, selectedAreaId, textSettings, previewName, showGrid, zoomLevel, canvasScale])

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        addLog("error", "Please upload a PNG or JPEG image file")
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        addLog("error", "Image file is too large. Please use an image smaller than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setTemplateDimensions({ width: img.width, height: img.height })
          setTemplateImage(e.target?.result as string)
          setNameAreas([])
          setSelectedAreaId(null)
          addLog("success", `Template uploaded successfully (${img.width}x${img.height}px)`)
          drawCanvas()
        }
        img.onerror = () => {
          addLog("error", "Failed to load the uploaded image")
        }
        img.src = e.target?.result as string
      }
      reader.onerror = () => {
        addLog("error", "Failed to read the uploaded file")
      }
      reader.readAsDataURL(file)
    },
    [addLog, drawCanvas],
  )

  const handleCSVUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        addLog("error", "Please upload a valid CSV file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string
          const lines = csv.split("\n").filter((line) => line.trim())
          const nameList = lines
            .map((line) => {
              const columns = line.split(",")
              return columns[0].trim().replace(/"/g, "")
            })
            .filter((name) => name && name.length > 0)

          if (nameList.length === 0) {
            addLog("warning", "No valid names found in the CSV file")
            return
          }

          setNames(nameList)
          setNameInput(nameList.join("\n"))
          addLog("success", `Loaded ${nameList.length} names from CSV file`)
        } catch (error) {
          addLog("error", "Failed to parse CSV file. Please check the format")
        }
      }
      reader.onerror = () => {
        addLog("error", "Failed to read the CSV file")
      }
      reader.readAsText(file)
    },
    [addLog],
  )

  const handleFontUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const allowedTypes = ["font/ttf", "font/otf", "font/woff", "font/woff2"]
      if (!allowedTypes.includes(file.type) && !/\.(ttf|otf|woff|woff2)$/i.test(file.name)) {
        addLog("error", "Please upload a valid font file (.ttf, .otf, .woff, .woff2)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        addLog("error", "Font file is too large. Please use a font smaller than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const fontName = file.name.split(".").slice(0, -1).join(".")
          const fontUrl = e.target?.result as string

          const fontFace = new FontFace(fontName, `url(${fontUrl})`)

          document.fonts.add(fontFace)
          fontFace
            .load()
            .then(() => {
              setCustomFonts((prev) => {
                if (!prev.includes(fontName)) {
                  addLog("success", `Custom font "${fontName}" loaded successfully!`)
                  return [...prev, fontName]
                }
                addLog("info", `Font "${fontName}" was already loaded.`)
                return prev
              })
              drawCanvas()
            })
            .catch((error) => {
              addLog("error", `Failed to load custom font "${fontName}": ${error.message}`)
            })
        } catch (error) {
          addLog("error", `Failed to process font file: ${error}`)
        }
      }
      reader.onerror = () => {
        addLog("error", "Failed to read the font file")
      }
      reader.readAsDataURL(file)
    },
    [addLog, drawCanvas],
  )

  const parseNamesFromText = useCallback(
    (text: string) => {
      try {
        const nameList = text
          .split("\n")
          .map((name) => name.trim())
          .filter((name) => name && name.length > 0)

        setNames(nameList)
        if (nameList.length > 0) {
          addLog("info", `Parsed ${nameList.length} names from input`)
        }
      } catch {
        addLog("error", "Failed to parse names from text input")
      }
    },
    [addLog],
  )

  const handleCanvasMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!templateImage) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      const mouseX = (event.clientX - rect.left) * scaleX
      const mouseY = (event.clientY - rect.top) * scaleY

      const effectiveScale = canvasScale
      const toOriginalCoords = (val: number) => val / effectiveScale

      // Drag selected area
      if (selectedAreaId) {
        const selectedArea = nameAreas.find((a) => a.id === selectedAreaId)
        if (selectedArea) {
          const scaledArea = {
            x: selectedArea.x * effectiveScale,
            y: selectedArea.y * effectiveScale,
            width: selectedArea.width * effectiveScale,
            height: selectedArea.height * effectiveScale,
          }

          const inside =
            mouseX >= scaledArea.x &&
            mouseX <= scaledArea.x + scaledArea.width &&
            mouseY >= scaledArea.y &&
            mouseY <= scaledArea.y + scaledArea.height

          if (inside) {
            const startX = toOriginalCoords(mouseX)
            const startY = toOriginalCoords(mouseY)
            const original = { ...selectedArea }

            const onMove = (e: MouseEvent) => {
              const currX = toOriginalCoords((e.clientX - rect.left) * scaleX)
              const currY = toOriginalCoords((e.clientY - rect.top) * scaleY)
              const dx = currX - startX
              const dy = currY - startY

              setNameAreas((prev) =>
                prev.map((a) => (a.id === selectedAreaId ? { ...a, x: original.x + dx, y: original.y + dy } : a)),
              )
            }
            const onUp = () => {
              document.removeEventListener("mousemove", onMove)
              document.removeEventListener("mouseup", onUp)
              addLog("info", `Moved text area: ${selectedArea.name}`)
            }
            document.addEventListener("mousemove", onMove)
            document.addEventListener("mouseup", onUp)
            return
          }
        }
      }

      // Draw new area
      if (isSelecting) {
        const startX = toOriginalCoords(mouseX)
        const startY = toOriginalCoords(mouseY)
        let drawing = true

        const onMove = (e: MouseEvent) => {
          if (!drawing) return
          const currX = toOriginalCoords((e.clientX - rect.left) * scaleX)
          const currY = toOriginalCoords((e.clientY - rect.top) * scaleY)

          const width = Math.abs(currX - startX)
          const height = Math.abs(currY - startY)
          const x = Math.min(startX, currX)
          const y = Math.min(startY, currY)

          const temp: NameArea = { id: "temp", name: "New Area", x, y, width, height, content: "" }
          setNameAreas((prev) => [...prev.filter((a) => a.id !== "temp"), temp])
        }
        const onUp = () => {
          drawing = false
          setIsSelecting(false)
          setNameAreas((prev) => {
            const t = prev.find((a) => a.id === "temp")
            if (t && t.width > 10 && t.height > 10) {
              const newArea: NameArea = {
                ...t,
                id: Date.now().toString(),
                name: `Text Area ${prev.filter((a) => a.id !== "temp").length + 1}`,
                content: "",
              }
              setSelectedAreaId(newArea.id)
              addLog("success", `Created new text area: ${newArea.name}`)
              return [...prev.filter((a) => a.id !== "temp"), newArea]
            }
            return prev.filter((a) => a.id !== "temp")
          })
          document.removeEventListener("mousemove", onMove)
          document.removeEventListener("mouseup", onUp)
        }
        document.addEventListener("mousemove", onMove)
        document.addEventListener("mouseup", onUp)
        return
      }

      // Deselect if clicked empty
      setSelectedAreaId(null)
    },
    [templateImage, nameAreas, selectedAreaId, canvasScale, isSelecting, addLog],
  )

  const generateCertificate = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx || !templateImage) {
          reject(new Error("Canvas context not available"))
          return
        }

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          try {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            nameAreas.forEach((area) => {
              ctx.fillStyle = textSettings.color
              let fontStyle = ""
              if (textSettings.bold) fontStyle += "bold "
              if (textSettings.italic) fontStyle += "italic "
              ctx.font = `${fontStyle}${textSettings.size}px ${textSettings.font}`
              ctx.textAlign = textSettings.align

              if (textSettings.shadow) {
                ctx.shadowColor = textSettings.shadowColor
                ctx.shadowBlur = textSettings.shadowBlur
                ctx.shadowOffsetX = textSettings.shadowOffsetX
                ctx.shadowOffsetY = textSettings.shadowOffsetY
              } else {
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
              }

              let textX = area.x
              if (textSettings.align === "center") textX = area.x + area.width / 2
              else if (textSettings.align === "right") textX = area.x + area.width
              const textY = area.y + area.height / 2 + textSettings.size / 3

              const displayText = area.content || "Sample Text"

              if (textSettings.underline) {
                const m = ctx.measureText(displayText)
                const underlineY = textY + 4
                ctx.beginPath()
                let underlineX = textX
                if (textSettings.align === "center") underlineX = textX - m.width / 2
                else if (textSettings.align === "right") underlineX = textX - m.width
                ctx.moveTo(underlineX, underlineY)
                ctx.lineTo(underlineX + m.width, underlineY)
                ctx.strokeStyle = textSettings.color
                ctx.lineWidth = 2
                ctx.stroke()
              }
              ctx.fillText(displayText, textX, textY)
            })

            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob)
                else reject(new Error("Failed to generate certificate blob"))
              },
              "image/png",
              0.95,
            )
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => reject(new Error("Failed to load template image"))
        img.src = templateImage
      } catch (error) {
        reject(error)
      }
    })
  }, [templateImage, nameAreas, textSettings])

  const generateCertificateDownload = useCallback(async () => {
    if (!templateImage || nameAreas.length === 0) {
      addLog("error", "Missing required data: template or text areas")
      return
    }
    setIsGenerating(true)
    setGenerationProgress(0)
    addLog("info", "Starting certificate generation")
    try {
      const blob = await generateCertificate()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `certificate-${new Date().toISOString().split("T")[0]}.png`
      a.click()
      URL.revokeObjectURL(url)
      addLog("success", "Certificate generated and downloaded successfully")
    } catch (error) {
      addLog("error", `Failed to generate certificate: ${error}`)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }, [templateImage, nameAreas, generateCertificate, addLog])

  const deleteSelectedArea = useCallback(() => {
    if (!selectedAreaId) return
    setNameAreas((prev) => prev.filter((a) => a.id !== selectedAreaId))
    setSelectedAreaId(null)
    addLog("info", "Deleted selected text area")
  }, [selectedAreaId, addLog])

  const duplicateSelectedArea = useCallback(() => {
    if (!selectedAreaId) return
    const selected = nameAreas.find((a) => a.id === selectedAreaId)
    if (!selected) return
    const newArea: NameArea = {
      ...selected,
      id: Date.now().toString(),
      name: `${selected.name} Copy`,
      content: selected.content, // Add this line
      x: selected.x + 20,
      y: selected.y + 20,
    }
    setNameAreas((prev) => [...prev, newArea])
    setSelectedAreaId(newArea.id)
    addLog("success", `Duplicated text area: ${newArea.name}`)
  }, [selectedAreaId, nameAreas, addLog])

  const handleZoomIn = useCallback(() => setZoomLevel((prev) => Math.min(prev + 0.1, 2.0)), [])
  const handleZoomOut = useCallback(() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)), [])
  const handleResetZoom = useCallback(() => setZoomLevel(1.0), [])

  useEffect(() => {
    const link = document.createElement("link")
    link.href =
      "https://fonts.googleapis.com/css2?family=" +
      GOOGLE_FONTS.filter((font) => !["Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"].includes(font))
        .map((font) => font.replace(/ /g, "+"))
        .join("&family=") +
      "&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  useEffect(() => {
    addLog("info", "Certificate Generator initialized. Upload a template to get started!")
  }, [addLog])

  const allAvailableFonts = [...GOOGLE_FONTS, ...customFonts]

  const ControlsPanel = ({ className }: { className?: string }) => (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <Tabs defaultValue="setup" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 rounded-none border-b border-gray-700 sticky top-0 z-10">
          <TabsTrigger
            value="setup"
            className="text-white data-[state=active]:bg-gray-700 hover:bg-gray-700/50 rounded-none"
          >
            Setup
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="text-white data-[state=active]:bg-gray-700 hover:bg-gray-700/50 rounded-none"
          >
            Style
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="text-white data-[state=active]:bg-gray-700 hover:bg-gray-700/50 rounded-none"
          >
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1">
            <div className="space-y-4 pb-4">
              {/* Template */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <FileImage className="w-4 h-4 text-blue-400" />
                    Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    variant={templateImage ? "outline" : "default"}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {templateImage ? "Change Template" : "Upload Template"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {templateImage && (
                    <div className="text-xs text-green-400 bg-green-900/30 p-2 rounded border border-green-700">
                      {"\u2713"} Template loaded ({templateDimensions.width}×{templateDimensions.height}px)
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Text Areas */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Text Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setIsSelecting(true)}
                    disabled={!templateImage}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
                    variant={isSelecting ? "default" : "outline"}
                  >
                    <Move className="w-4 h-4 mr-2" />
                    {isSelecting ? "Click & Drag on Canvas" : "Add Text Area"}
                  </Button>

                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {nameAreas.map((area) => (
                      <div
                        key={area.id}
                        className={`p-2 rounded border cursor-pointer transition-all ${
                          selectedAreaId === area.id
                            ? "border-blue-500 bg-blue-900/30 shadow-md"
                            : "border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700"
                        }`}
                        onClick={() => setSelectedAreaId(area.id)}
                      >
                        <div className="flex items-center justify-between">
                          <Input
                            type="text"
                            value={area.name}
                            onChange={(e) => {
                              const newName = e.target.value
                              setNameAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, name: newName } : a)))
                            }}
                            className="text-sm font-medium bg-transparent border-none p-0 h-auto focus:ring-0 focus:outline-none text-white"
                          />
                          {selectedAreaId === area.id && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicateSelectedArea()
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-white hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSelectedArea()
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {selectedAreaId === area.id && (
                          <div className="mt-2 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor={`area-x-${area.id}`} className="text-xs text-gray-400">
                                  X
                                </Label>
                                <Input
                                  id={`area-x-${area.id}`}
                                  type="number"
                                  value={Math.round(area.x)}
                                  onChange={(e) => {
                                    const val = Number.parseInt(e.target.value) || 0
                                    setNameAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, x: val } : a)))
                                    drawCanvas()
                                  }}
                                  className="text-sm bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`area-y-${area.id}`} className="text-xs text-gray-400">
                                  Y
                                </Label>
                                <Input
                                  id={`area-y-${area.id}`}
                                  type="number"
                                  value={Math.round(area.y)}
                                  onChange={(e) => {
                                    const val = Number.parseInt(e.target.value) || 0
                                    setNameAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, y: val } : a)))
                                    drawCanvas()
                                  }}
                                  className="text-sm bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor={`area-width-${area.id}`} className="text-xs text-gray-400">
                                  Width
                                </Label>
                                <Input
                                  id={`area-width-${area.id}`}
                                  type="number"
                                  value={Math.round(area.width)}
                                  onChange={(e) => {
                                    const val = Number.parseInt(e.target.value) || 0
                                    setNameAreas((prev) =>
                                      prev.map((a) => (a.id === area.id ? { ...a, width: val } : a)),
                                    )
                                    drawCanvas()
                                  }}
                                  className="text-sm bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`area-height-${area.id}`} className="text-xs text-gray-400">
                                  Height
                                </Label>
                                <Input
                                  id={`area-height-${area.id}`}
                                  type="number"
                                  value={Math.round(area.height)}
                                  onChange={(e) => {
                                    const val = Number.parseInt(e.target.value) || 0
                                    setNameAreas((prev) =>
                                      prev.map((a) => (a.id === area.id ? { ...a, height: val } : a)),
                                    )
                                    drawCanvas()
                                  }}
                                  className="text-sm bg-gray-800 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`area-content-${area.id}`} className="text-xs text-gray-400">
                                Content
                              </Label>
                              <Input
                                id={`area-content-${area.id}`}
                                type="text"
                                value={area.content}
                                placeholder="Enter text content..."
                                onChange={(e) => {
                                  const newContent = e.target.value
                                  setNameAreas((prev) =>
                                    prev.map((a) => (a.id === area.id ? { ...a, content: newContent } : a)),
                                  )
                                  drawCanvas()
                                }}
                                className="text-sm bg-gray-800 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-1">
                          {Math.round(area.width)}×{Math.round(area.height)}px
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="style" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {/* Preview */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-white">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="preview-name" className="text-xs text-gray-300">
                    Preview Name
                  </Label>
                  <Input
                    id="preview-name"
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                    placeholder="Enter name for preview"
                    className="text-sm bg-gray-800 border-gray-600 text-white"
                  />
                </CardContent>
              </Card>

              {/* Typography */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <Type className="w-4 h-4 text-orange-400" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-300 font-medium">Font Family</Label>
                    <Select
                      value={textSettings.font}
                      onValueChange={(value) => setTextSettings((prev) => ({ ...prev, font: value }))}
                    >
                      <SelectTrigger className="text-sm bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {allAvailableFonts.map((font) => (
                          <SelectItem
                            key={font}
                            value={font}
                            className="text-white hover:bg-gray-700"
                            style={{ fontFamily: font }}
                          >
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-300 font-medium">Size: {textSettings.size}px</Label>
                    <Slider
                      value={[textSettings.size]}
                      onValueChange={([value]) => setTextSettings((prev) => ({ ...prev, size: value }))}
                      min={12}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-300 font-medium mb-2 block">Color</Label>
                      <Input
                        type="color"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings((prev) => ({ ...prev, color: e.target.value }))}
                        className="w-full h-10 bg-gray-800 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-300 font-medium mb-2 block">Alignment</Label>
                      <div className="flex border border-gray-600 rounded bg-gray-800 overflow-hidden">
                        <Button
                          size="sm"
                          variant={textSettings.align === "left" ? "default" : "ghost"}
                          onClick={() => setTextSettings((prev) => ({ ...prev, align: "left" }))}
                          className="flex-1 rounded-none text-white hover:bg-gray-600"
                        >
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={textSettings.align === "center" ? "default" : "ghost"}
                          onClick={() => setTextSettings((prev) => ({ ...prev, align: "center" }))}
                          className="flex-1 rounded-none border-x border-gray-600 text-white hover:bg-gray-600"
                        >
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={textSettings.align === "right" ? "default" : "ghost"}
                          onClick={() => setTextSettings((prev) => ({ ...prev, align: "right" }))}
                          className="flex-1 rounded-none text-white hover:bg-gray-600"
                        >
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs text-gray-300 font-medium">Text Style</Label>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                          <Bold className="w-4 h-4" />
                          Bold
                        </Label>
                        <Switch
                          checked={textSettings.bold}
                          onCheckedChange={(checked) => setTextSettings((prev) => ({ ...prev, bold: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                          <Italic className="w-4 h-4" />
                          Italic
                        </Label>
                        <Switch
                          checked={textSettings.italic}
                          onCheckedChange={(checked) => setTextSettings((prev) => ({ ...prev, italic: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                          <Underline className="w-4 h-4" />
                          Underline
                        </Label>
                        <Switch
                          checked={textSettings.underline}
                          onCheckedChange={(checked) => setTextSettings((prev) => ({ ...prev, underline: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Effects */}
              <Card className="bg-gray-700 border-gray-600 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <Palette className="w-4 h-4 text-pink-400" />
                    Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={textSettings.shadow}
                      onCheckedChange={(checked) => setTextSettings((prev) => ({ ...prev, shadow: checked }))}
                    />
                    <Label className="text-xs text-gray-300 cursor-pointer">Text Shadow</Label>
                  </div>

                  {textSettings.shadow && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-600">
                      <div>
                        <Label className="text-xs text-gray-300">Shadow Color</Label>
                        <Input
                          type="color"
                          value={textSettings.shadowColor}
                          onChange={(e) => setTextSettings((prev) => ({ ...prev, shadowColor: e.target.value }))}
                          className="h-8 bg-gray-800 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-300">Blur: {textSettings.shadowBlur}px</Label>
                        <Slider
                          value={[textSettings.shadowBlur]}
                          onValueChange={([value]) => setTextSettings((prev) => ({ ...prev, shadowBlur: value }))}
                          min={0}
                          max={20}
                          step={1}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-gray-300">X: {textSettings.shadowOffsetX}px</Label>
                          <Slider
                            value={[textSettings.shadowOffsetX]}
                            onValueChange={([value]) => setTextSettings((prev) => ({ ...prev, shadowOffsetX: value }))}
                            min={-10}
                            max={10}
                            step={1}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300">Y: {textSettings.shadowOffsetY}px</Label>
                          <Slider
                            value={[textSettings.shadowOffsetY]}
                            onValueChange={([value]) => setTextSettings((prev) => ({ ...prev, shadowOffsetY: value }))}
                            min={-10}
                            max={10}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1">
            <LogViewer logs={logs} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )

  const GeneratePanel = ({ className }: { className?: string }) => (
    <div className={cn("h-full min-h-0 overflow-y-auto p-4", className)}>
      <div className="space-y-4">
        <Card className="bg-gray-700 border-gray-600 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <Download className="w-4 h-4 text-green-400" />
              Generate Certificates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{nameAreas.length}</div>
                <div className="text-xs text-gray-400">Text Areas</div>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Generating...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}

            <Button
              onClick={generateCertificateDownload}
              disabled={!templateImage || nameAreas.length === 0 || isGenerating}
              className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
              size="lg"
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>

            {(!templateImage || nameAreas.length === 0) && (
              <div className="text-xs text-gray-400 text-center space-y-1">
                {!templateImage && <div>{"•"} Upload a template</div>}
                {nameAreas.length === 0 && <div>{"•"} Add text areas</div>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-700 border-gray-600 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">Project Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Template Size:</span>
              <span className="text-white">
                {templateDimensions.width}×{templateDimensions.height}px
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Text Areas:</span>
              <span className="text-white">{nameAreas.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Font:</span>
              <span className="text-white">{textSettings.font}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Font Size:</span>
              <span className="text-white">{textSettings.size}px</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  if (isBlockedMobile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
            <h1 className="text-xl font-semibold mb-2">Desktop Only</h1>
            <p className="text-sm text-gray-300">
              This tool is not compatible with mobile or small screens. Please use a desktop or laptop device to
              continue.
            </p>
            <div className="mt-4 text-xs text-gray-400">
              Tip: Open this page on your computer for the best experience.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop-only gate
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Desktop Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-300">
              This tool is optimized for desktop and laptop screens. Please open it on a device with a larger display to
              continue.
            </p>
            <div className="text-xs text-gray-400">
              note: If you would like to use desktop mode in mobile, the website is not yet capable with mobile and you
              will have issues with making certificates so i request you to use laptop/pc or in mobile with a mouseobile
              and you will have issues with making certificates so i request
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <FileImage className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Lazy Certification</h1>
            <Badge variant="secondary" className="ml-2 bg-gray-700 text-gray-300 border-gray-600">
              v2.0
            </Badge>
          </div>
          <div className="text-sm text-gray-300">
            Made by{" "}
            <a
              href="https://anishkumar.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center"
            >
              Anish Kumar
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </header>

      {/* Permanent 3-column desktop layout */}
      <div className="flex-1 min-h-0">
        <div className="grid h-full min-h-0 grid-cols-[22rem_1fr_22rem]">
          {/* Left Sidebar */}
          <aside className="min-h-0 flex flex-col border-r border-gray-700 bg-gray-800">
            <ControlsPanel />
          </aside>

          {/* Main Content */}
          <main className="min-h-0 flex flex-col bg-gray-900" ref={mainContentRef}>
            {/* Canvas Toolbar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGrid(!showGrid)}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  <Grid className="w-4 h-4 mr-1" />
                  Grid
                </Button>
                <Separator orientation="vertical" className="h-6 bg-gray-600" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleZoomOut}
                  className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-300 cursor-pointer" onClick={handleResetZoom} title="Reset Zoom">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleZoomIn}
                  className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSelecting(true)}
                  disabled={!templateImage}
                  className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
                >
                  <Move className="w-4 h-4 mr-1" />
                  Add Area
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selectedAreaId}
                  onClick={duplicateSelectedArea}
                  className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 bg-transparent"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!selectedAreaId}
                  onClick={deleteSelectedArea}
                  className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 min-h-0 p-8 flex items-center justify-center overflow-auto">
              {templateImage ? (
                <div className="bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-700 flex-shrink-0">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    className="max-w-full h-auto border border-gray-600 rounded"
                    style={{ cursor: isSelecting ? "crosshair" : "default" }}
                  />
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-medium mb-2 text-white">No Template Loaded</h3>
                  <p className="text-sm">Upload a certificate template to get started</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="min-h-0 border-l border-gray-700 bg-gray-800">
            <GeneratePanel />
          </aside>
        </div>
      </div>
    </div>
  )
}
