'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Upload, Download, Eye, Settings, FileImage, Users, Palette, Type, RotateCcw, Trash2, Copy, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Layers, Move, ZoomIn, ZoomOut, Grid, ExternalLink, Menu, X, PlusCircle } from 'lucide-react'
import JSZip from 'jszip'
import LogViewer from '@/components/log-viewer'

interface TextSettings {
  font: string
  size: number
  color: string
  align: 'left' | 'center' | 'right'
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
}

export interface LogEntry {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  timestamp: Date
}

const GOOGLE_FONTS = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
  'Raleway', 'Poppins', 'Nunito', 'Playfair Display', 'Merriweather',
  'Oswald', 'Ubuntu', 'Libre Baskerville', 'Crimson Text', 'Lora',
  'PT Sans', 'Droid Sans', 'Noto Sans', 'Fira Sans', 'Work Sans',
  'Inter', 'Rubik', 'Karla', 'Barlow', 'DM Sans'
]

export default function CertificateGenerator() {
  const [templateImage, setTemplateImage] = useState<string | null>(null)
  const [nameAreas, setNameAreas] = useState<NameArea[]>([])
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null)
  const [textSettings, setTextSettings] = useState<TextSettings>({
    font: 'Montserrat',
    size: 48,
    color: '#ffffff',
    align: 'center',
    bold: false,
    italic: false,
    underline: false,
    shadow: true,
    shadowColor: '#000000',
    shadowBlur: 4,
    shadowOffsetX: 2,
    shadowOffsetY: 2,
    letterSpacing: 0,
    lineHeight: 1.2
  })
  const [names, setNames] = useState<string[]>([])
  const [nameInput, setNameInput] = useState('')
  const [isSelecting, setIsSelecting] = useState(false)
  const [previewName, setPreviewName] = useState('John Doe')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [canvasScale, setCanvasScale] = useState(1)
  const [showGrid, setShowGrid] = useState(false)
  const [templateDimensions, setTemplateDimensions] = useState({ width: 0, height: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1.0); // New state for zoom

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const fontInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date()
    }
    setLogs(prev => [newLog, ...prev.slice(0, 49)])
  }, [])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const mainContent = mainContentRef.current
    if (!canvas || !templateImage || !mainContent) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const toolbarHeight = 56;
      const padding = window.innerWidth < 768 ? 16 : 32;
      const availableWidth = mainContent.offsetWidth - (padding * 2);
      const availableHeight = mainContent.offsetHeight - (padding * 2) - toolbarHeight;

      let { width: originalWidth, height: originalHeight } = img;
      let baseScale = 1;

      if (originalWidth > availableWidth || originalHeight > availableHeight) {
        const widthRatio = availableWidth / originalWidth;
        const heightRatio = availableHeight / originalHeight;
        baseScale = Math.min(widthRatio, heightRatio);
      }
      
      const effectiveScale = baseScale * zoomLevel; // Apply zoom level
      
      canvas.width = originalWidth * effectiveScale;
      canvas.height = originalHeight * effectiveScale;
      setCanvasScale(effectiveScale); // Update canvasScale state here

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (showGrid) {
        ctx.strokeStyle = '#374151'
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        const gridSize = 20 * effectiveScale;
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
      
      nameAreas.forEach(area => {
        const scaledArea = {
          x: area.x * effectiveScale,
          y: area.y * effectiveScale,
          width: area.width * effectiveScale,
          height: area.height * effectiveScale
        }
        
        ctx.strokeStyle = area.id === selectedAreaId ? '#3b82f6' : '#10b981'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(scaledArea.x, scaledArea.y, scaledArea.width, scaledArea.height)
        
        ctx.fillStyle = area.id === selectedAreaId ? '#3b82f6' : '#10b981'
        ctx.font = 'bold 12px Inter'
        ctx.textAlign = 'left'
        ctx.setLineDash([])
        ctx.fillText(area.name, scaledArea.x, scaledArea.y - 5)
        
        ctx.fillStyle = textSettings.color
        let fontStyle = ''
        if (textSettings.bold) fontStyle += 'bold '
        if (textSettings.italic) fontStyle += 'italic '
        ctx.font = `${fontStyle}${textSettings.size * effectiveScale}px ${textSettings.font}`
        ctx.textAlign = textSettings.align
        
        if (textSettings.shadow) {
          ctx.shadowColor = textSettings.shadowColor
          ctx.shadowBlur = textSettings.shadowBlur * effectiveScale
          ctx.shadowOffsetX = textSettings.shadowOffsetX * effectiveScale
          ctx.shadowOffsetY = textSettings.shadowOffsetY * effectiveScale
        } else {
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
        }
        
        let textX = scaledArea.x
        if (textSettings.align === 'center') {
          textX = scaledArea.x + scaledArea.width / 2
        } else if (textSettings.align === 'right') {
          textX = scaledArea.x + scaledArea.width
        }
        
        const textY = scaledArea.y + scaledArea.height / 2 + (textSettings.size * effectiveScale) / 3
        
        if (textSettings.underline) {
          const metrics = ctx.measureText(previewName)
          const underlineY = textY + 4
          ctx.beginPath()
          let underlineX = textX
          let underlineWidth = metrics.width
          
          if (textSettings.align === 'center') {
            underlineX = textX - metrics.width / 2
          } else if (textSettings.align === 'right') {
            underlineX = textX - metrics.width
          }
          
          ctx.moveTo(underlineX, underlineY)
          ctx.lineTo(underlineX + underlineWidth, underlineY)
          ctx.strokeStyle = textSettings.color
          ctx.lineWidth = 2
          ctx.stroke()
        }
        
        ctx.fillText(previewName, textX, textY)
      })
    }
    img.src = templateImage
    // Add zoomLevel to dependencies
    }, [templateImage, nameAreas, selectedAreaId, textSettings, previewName, showGrid, zoomLevel, mainContentRef]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      addLog('error', 'Please upload a PNG or JPEG image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      addLog('error', 'Image file is too large. Please use an image smaller than 10MB')
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
        addLog('success', `Template uploaded successfully (${img.width}x${img.height}px)`)
        drawCanvas()
      }
      img.onerror = () => {
        addLog('error', 'Failed to load the uploaded image')
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      addLog('error', 'Failed to read the uploaded file')
    }
    reader.readAsDataURL(file)
  }, [addLog, drawCanvas])

  const handleCSVUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      addLog('error', 'Please upload a valid CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n').filter(line => line.trim())
        const nameList = lines.map(line => {
          const columns = line.split(',')
          return columns[0].trim().replace(/"/g, '')
        }).filter(name => name && name.length > 0)
        
        if (nameList.length === 0) {
          addLog('warning', 'No valid names found in the CSV file')
          return
        }

        setNames(nameList)
        setNameInput(nameList.join('\n'))
        addLog('success', `Loaded ${nameList.length} names from CSV file`)
      } catch (error) {
        addLog('error', 'Failed to parse CSV file. Please check the format')
      }
    }
    reader.onerror = () => {
      addLog('error', 'Failed to read the CSV file')
    }
    reader.readAsText(file)
  }, [addLog])

  const handleFontUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['font/ttf', 'font/otf', 'font/woff', 'font/woff2'];
    if (!allowedTypes.includes(file.type) && !/\.(ttf|otf|woff|woff2)$/i.test(file.name)) {
      addLog('error', 'Please upload a valid font file (.ttf, .otf, .woff, .woff2)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addLog('error', 'Font file is too large. Please use a font smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fontName = file.name.split('.').slice(0, -1).join('.');
        const fontUrl = e.target?.result as string;

        const fontFace = new FontFace(fontName, `url(${fontUrl})`);

        document.fonts.add(fontFace);
        fontFace.load().then(() => {
          setCustomFonts(prev => {
            if (!prev.includes(fontName)) {
              addLog('success', `Custom font "${fontName}" loaded successfully!`);
              return [...prev, fontName];
            }
            addLog('info', `Font "${fontName}" was already loaded.`);
            return prev;
          });
          drawCanvas();
        }).catch(error => {
          addLog('error', `Failed to load custom font "${fontName}": ${error.message}`);
        });
      } catch (error) {
        addLog('error', `Failed to process font file: ${error}`);
      }
    };
    reader.onerror = () => {
      addLog('error', 'Failed to read the font file');
    };
    reader.readAsDataURL(file);
  }, [addLog, drawCanvas]);

  const parseNamesFromText = useCallback((text: string) => {
    try {
      const nameList = text.split('\n')
        .map(name => name.trim())
        .filter(name => name && name.length > 0)
      
      setNames(nameList)
      if (nameList.length > 0) {
        addLog('info', `Parsed ${nameList.length} names from input`)
      }
    } catch (error) {
      addLog('error', 'Failed to parse names from text input')
    }
  }, [addLog])

  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !templateImage) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const startX = (event.clientX - rect.left) * scaleX / canvasScale
    const startY = (event.clientY - rect.top) * scaleY / canvasScale
    
    let isDrawing = true
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return
      
      const currentX = (e.clientX - rect.left) * scaleX / canvasScale
      const currentY = (e.clientY - rect.top) * scaleY / canvasScale
      
      const width = Math.abs(currentX - startX)
      const height = Math.abs(currentY - startY)
      const x = Math.min(startX, currentX)
      const y = Math.min(startY, currentY)
      
      const tempArea: NameArea = {
        id: 'temp',
        name: 'New Area',
        x, y, width, height
      }
      
      setNameAreas(prev => {
        const filtered = prev.filter(area => area.id !== 'temp')
        return [...filtered, tempArea]
      })
    }
    
    const handleMouseUp = () => {
      isDrawing = false
      setIsSelecting(false)
      
      setNameAreas(prev => {
        const tempArea = prev.find(area => area.id === 'temp')
        if (tempArea && tempArea.width > 10 && tempArea.height > 10) {
          const newArea: NameArea = {
            ...tempArea,
            id: Date.now().toString(),
            name: `Text Area ${prev.filter(a => a.id !== 'temp').length + 1}`
          }
          setSelectedAreaId(newArea.id)
          addLog('success', `Created new text area: ${newArea.name}`)
          return [...prev.filter(area => area.id !== 'temp'), newArea]
        }
        return prev.filter(area => area.id !== 'temp')
      })
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [isSelecting, templateImage, canvasScale, addLog])

  const generateCertificate = useCallback((name: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx || !templateImage) {
          reject(new Error('Canvas context not available'))
          return
        }
        
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          try {
            canvas.width = img.width
            canvas.height = img.height
            
            ctx.drawImage(img, 0, 0)
            
            nameAreas.forEach(area => {
              ctx.fillStyle = textSettings.color
              let fontStyle = ''
              if (textSettings.bold) fontStyle += 'bold '
              if (textSettings.italic) fontStyle += 'italic '
              ctx.font = `${fontStyle}${textSettings.size}px ${textSettings.font}`
              ctx.textAlign = textSettings.align
              
              if (textSettings.shadow) {
                ctx.shadowColor = textSettings.shadowColor
                ctx.shadowBlur = textSettings.shadowBlur
                ctx.shadowOffsetX = textSettings.shadowOffsetX
                ctx.shadowOffsetY = textSettings.shadowOffsetY
              }
              
              let textX = area.x
              if (textSettings.align === 'center') {
                textX = area.x + area.width / 2
              } else if (textSettings.align === 'right') {
                textX = area.x + area.width
              }
              
              const textY = area.y + area.height / 2 + textSettings.size / 3
              
              if (textSettings.underline) {
                const metrics = ctx.measureText(name)
                const underlineY = textY + 4
                ctx.beginPath()
                let underlineX = textX
                let underlineWidth = metrics.width
                
                if (textSettings.align === 'center') {
                  underlineX = textX - metrics.width / 2
                } else if (textSettings.align === 'right') {
                  underlineX = textX - metrics.width
                }
                
                ctx.moveTo(underlineX, underlineY)
                ctx.lineTo(underlineX + underlineWidth, underlineY)
                ctx.strokeStyle = textSettings.color
                ctx.lineWidth = 2
                ctx.stroke()
              }
              
              ctx.fillText(name, textX, textY)
            })
            
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Failed to generate certificate blob'))
              }
            }, 'image/png', 0.95)
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => {
          reject(new Error('Failed to load template image'))
        }
        img.src = templateImage
      } catch (error) {
        reject(error)
      }
    })
  }, [templateImage, nameAreas, textSettings])

  const generateAllCertificates = useCallback(async () => {
    if (!templateImage || nameAreas.length === 0 || names.length === 0) {
      addLog('error', 'Missing required data: template, text areas, or names')
      return
    }
    
    setIsGenerating(true)
    setGenerationProgress(0)
    addLog('info', `Starting generation of ${names.length} certificates`)
    
    try {
      const zip = new JSZip()
      
      for (let i = 0; i < names.length; i++) {
        const name = names[i]
        try {
          const blob = await generateCertificate(name)
          zip.file(`${name} - Certificate.png`, blob)
          setGenerationProgress(((i + 1) / names.length) * 100)
          addLog('info', `Generated certificate for: ${name}`)
        } catch (error) {
          addLog('error', `Failed to generate certificate for ${name}: ${error}`)
        }
      }
      
      addLog('info', 'Creating ZIP file...')
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificates-${new Date().toISOString().split('T')[0]}.zip`
      a.click()
      URL.revokeObjectURL(url)
    
      addLog('success', `Successfully generated and downloaded ${names.length} certificates`)
    } catch (error) {
      addLog('error', `Failed to generate certificates: ${error}`)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }, [templateImage, nameAreas, names, generateCertificate, addLog])

  const deleteSelectedArea = useCallback(() => {
    if (!selectedAreaId) return
    
    setNameAreas(prev => prev.filter(area => area.id !== selectedAreaId))
    setSelectedAreaId(null)
    addLog('info', 'Deleted selected text area')
  }, [selectedAreaId, addLog])

  const duplicateSelectedArea = useCallback(() => {
    if (!selectedAreaId) return
    
    const selectedArea = nameAreas.find(area => area.id === selectedAreaId)
    if (!selectedArea) return
    
    const newArea: NameArea = {
      ...selectedArea,
      id: Date.now().toString(),
      name: `${selectedArea.name} Copy`,
      x: selectedArea.x + 20,
      y: selectedArea.y + 20
    }
    
    setNameAreas(prev => [...prev, newArea])
    setSelectedAreaId(newArea.id)
    addLog('success', `Duplicated text area: ${newArea.name}`)
  }, [selectedAreaId, nameAreas, addLog])

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0)); // Max 200%
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Min 50%
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.0);
  }, []);

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=' + 
      GOOGLE_FONTS.filter(font => !['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'].includes(font))
        .map(font => font.replace(/ /g, '+'))
        .join('&family=') + 
      '&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [])

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);


  useEffect(() => {
    addLog('info', 'Certificate Generator initialized. Upload a template to get started!')
  }, [addLog])

  const allAvailableFonts = [...GOOGLE_FONTS, ...customFonts];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg lg:text-xl font-bold text-white">Lazy Certification</h1>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex bg-gray-700 text-gray-300 border-gray-600">v2.0</Badge>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <div className="hidden sm:block text-xs lg:text-sm text-gray-300">
              Made by{' '}
              <a 
                href="https://anishkumar.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center transition-colors duration-200"
              >
                Anish Kumar
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 w-80 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between p-4 lg:hidden bg-gray-900 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Controls</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <Tabs defaultValue="setup" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900 rounded-none border-b border-gray-700">
              <TabsTrigger value="setup" className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-none hover:bg-gray-700/50 transition-colors duration-200">Setup</TabsTrigger>
              <TabsTrigger value="style" className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-none hover:bg-gray-700/50 transition-colors duration-200">Style</TabsTrigger>
              <TabsTrigger value="logs" className="text-white data-[state=active]:bg-gray-700 data-[state=active]:text-white rounded-none hover:bg-gray-700/50 transition-colors duration-200">Logs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="flex-1 p-4 space-y-4 overflow-y-auto">
              <ScrollArea className="h-full">
                {/* Template Upload */}
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 transform hover:scale-[1.01]"
                      variant={templateImage ? "outline" : "default"}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {templateImage ? 'Change Template' : 'Upload Template'}
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
                        ✓ Template loaded ({templateDimensions.width}×{templateDimensions.height}px)
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
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-600 disabled:text-gray-400 transition-colors duration-200 transform hover:scale-[1.01]"
                      variant={isSelecting ? "default" : "outline"}
                    >
                      <Move className="w-4 h-4 mr-2" />
                      {isSelecting ? 'Click & Drag on Canvas' : 'Add Text Area'}
                    </Button>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {nameAreas.map(area => (
                        <div
                          key={area.id}
                          className={`p-2 rounded border cursor-pointer transition-all duration-200 ${
                            selectedAreaId === area.id 
                              ? 'border-blue-500 bg-blue-900/30 shadow-md' 
                              : 'border-gray-600 hover:border-gray-500 bg-gray-800 hover:bg-gray-700'
                          }`}
                          onClick={() => setSelectedAreaId(area.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white"></span>
                            {selectedAreaId === area.id && (
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-white hover:bg-gray-600 transition-colors duration-200"
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
                                  className="h-6 w-6 p-0 text-white hover:bg-gray-600 transition-colors duration-200"
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
                          <div className="text-xs text-gray-400 mt-1">
                            {Math.round(area.width)}×{Math.round(area.height)}px
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Names Input */}
                <Card className="bg-gray-700 border-gray-600 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-white">
                      <Users className="w-4 h-4 text-teal-400" />
                      Recipients ({names.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="names" className="text-xs text-gray-300">Names (one per line)</Label>
                      <Textarea
                        id="names"
                        placeholder="John Doe&#10;Jane Smith&#10;Mike Johnson"
                        value={nameInput}
                        onChange={(e) => {
                          setNameInput(e.target.value)
                          parseNamesFromText(e.target.value)
                        }}
                        rows={4}
                        className="text-sm bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500">or</span>
                    </div>
                    <Button
                      onClick={() => csvInputRef.current?.click()}
                      variant="outline"
                      className="w-full border-gray-600 text-white hover:bg-gray-600 transition-colors duration-200 transform hover:scale-[1.01]"
                      size="sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </Button>
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="style" className="flex-1 p-4 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {/* Preview Name */}
                  <Card className="bg-gray-700 border-gray-600 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-white">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="preview-name" className="text-xs text-gray-300">Preview Name</Label>
                        <Input
                          id="preview-name"
                          value={previewName}
                          onChange={(e) => setPreviewName(e.target.value)}
                          placeholder="Enter name for preview"
                          className="text-sm bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                        />
                      </div>
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
                        <Select value={textSettings.font} onValueChange={(value) => setTextSettings(prev => ({ ...prev, font: value }))}>
                          <SelectTrigger className="text-sm bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            {allAvailableFonts.map(font => (
                              <SelectItem key={font} value={font} className="text-white hover:bg-gray-700 focus:bg-gray-700 transition-colors duration-200" style={{ fontFamily: font }}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Custom Font Upload - Temporarily disabled
                      <div className="space-y-3">
                        <Label className="text-xs text-gray-300 font-medium">Upload Custom Font</Label>
                        <Button
                          onClick={() => fontInputRef.current?.click()}
                          className="w-full bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200 transform hover:scale-[1.01]"
                          variant="outline"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Upload Font File
                        </Button>
                        <input
                          ref={fontInputRef}
                          type="file"
                          accept=".ttf,.otf,.woff,.woff2"
                          onChange={handleFontUpload}
                          className="hidden"
                        />
                        {customFonts.length > 0 && (
                          <div className="text-xs text-gray-400 bg-gray-800/30 p-2 rounded border border-gray-700">
                            Loaded: {customFonts.join(', ')}
                          </div>
                        )}
                      </div>
                      */}

                      <div>
                        <Label className="text-xs text-gray-300 font-medium">Size: {textSettings.size}px</Label>
                        <Slider
                          value={[textSettings.size]}
                          onValueChange={([value]) => setTextSettings(prev => ({ ...prev, size: value }))}
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
                            onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                            className="w-full h-10 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-300 font-medium mb-2 block">Alignment</Label>
                          <div className="flex border border-gray-600 rounded bg-gray-800 overflow-hidden">
                            <Button
                              size="sm"
                              variant={textSettings.align === 'left' ? 'default' : 'ghost'}
                              onClick={() => setTextSettings(prev => ({ ...prev, align: 'left' }))}
                              className="flex-1 rounded-none text-white hover:bg-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:hover:bg-blue-700 transition-colors duration-200"
                            >
                              <AlignLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={textSettings.align === 'center' ? 'default' : 'ghost'}
                              onClick={() => setTextSettings(prev => ({ ...prev, align: 'center' }))}
                              className="flex-1 rounded-none border-x border-gray-600 text-white hover:bg-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:hover:bg-blue-700 transition-colors duration-200"
                            >
                              <AlignCenter className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={textSettings.align === 'right' ? 'default' : 'ghost'}
                              onClick={() => setTextSettings(prev => ({ ...prev, align: 'right' }))}
                              className="flex-1 rounded-none text-white hover:bg-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:hover:bg-blue-700 transition-colors duration-200"
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
                              onCheckedChange={(checked) => setTextSettings(prev => ({ ...prev, bold: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                              <Italic className="w-4 h-4" />
                              Italic
                            </Label>
                            <Switch
                              checked={textSettings.italic}
                              onCheckedChange={(checked) => setTextSettings(prev => ({ ...prev, italic: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-gray-300 flex items-center gap-2 cursor-pointer">
                              <Underline className="w-4 h-4" />
                              Underline
                            </Label>
                            <Switch
                              checked={textSettings.underline}
                              onCheckedChange={(checked) => setTextSettings(prev => ({ ...prev, underline: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text Effects */}
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
                          onCheckedChange={(checked) => setTextSettings(prev => ({ ...prev, shadow: checked }))}
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
                              onChange={(e) => setTextSettings(prev => ({ ...prev, shadowColor: e.target.value }))}
                              className="h-8 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-300">Blur: {textSettings.shadowBlur}px</Label>
                            <Slider
                              value={[textSettings.shadowBlur]}
                              onValueChange={([value]) => setTextSettings(prev => ({ ...prev, shadowBlur: value }))}
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
                                onValueChange={([value]) => setTextSettings(prev => ({ ...prev, shadowOffsetX: value }))}
                                min={-10}
                                max={10}
                                step={1}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-300">Y: {textSettings.shadowOffsetY}px</Label>
                              <Slider
                                value={[textSettings.shadowOffsetY]}
                                onValueChange={([value]) => setTextSettings(prev => ({ ...prev, shadowOffsetY: value }))}
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
            
            <TabsContent value="logs" className="flex-1 p-4 overflow-y-auto">
              <LogViewer logs={logs} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 bg-gray-900">
          {/* Canvas Toolbar */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between flex-wrap gap-2 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowGrid(!showGrid)}
                className="border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
              >
                <Grid className="w-4 h-4 mr-1" />
                Grid
              </Button>
              <Separator orientation="vertical" className="h-6 bg-gray-600" />
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomOut}
                className="border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span
                className="text-sm text-gray-300 cursor-pointer"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleZoomIn}
                className="border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
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
                className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 transition-colors duration-200"
              >
                <Move className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Add Area</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!selectedAreaId}
                onClick={duplicateSelectedArea}
                className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 transition-colors duration-200"
              >
                <Copy className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Duplicate</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!selectedAreaId}
                onClick={deleteSelectedArea}
                className="border-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4 lg:p-8 flex items-center justify-center overflow-auto">
            {templateImage ? (
              <div className="bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-700 flex-shrink-0">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleCanvasMouseDown}
                  className="max-w-full h-auto border border-gray-600 rounded"
                  style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
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
        </div>

        {/* Right Sidebar - Generation */}
        <div className={`${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:relative z-20 right-0 w-80 flex-shrink-0 bg-gray-800 border-l border-gray-700 p-4 transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between mb-4 lg:hidden bg-gray-900 border-b border-gray-700 -mx-4 px-4 pt-4">
            <h2 className="text-lg font-semibold text-white">Generate</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightSidebarOpen(false)}
              className="text-white hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4 overflow-y-auto h-full pb-4">
            <Card className="bg-gray-700 border-gray-600 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Download className="w-4 h-4 text-green-400" />
                  Generate Certificates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{names.length}</div>
                    <div className="text-xs text-gray-400">Recipients</div>
                  </div>
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
                  onClick={generateAllCertificates}
                  disabled={!templateImage || nameAreas.length === 0 || names.length === 0 || isGenerating}
                  className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-600 disabled:text-gray-400 transition-colors duration-200 transform hover:scale-[1.01]"
                  size="lg"
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate & Download
                    </>
                  )}
                </Button>

                {(!templateImage || nameAreas.length === 0 || names.length === 0) && (
                  <div className="text-xs text-gray-400 text-center space-y-1">
                    {!templateImage && <div>• Upload a template</div>}
                    {nameAreas.length === 0 && <div>• Add text areas</div>}
                    {names.length === 0 && <div>• Add recipient names</div>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-700 border-gray-600 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Template Size:</span>
                  <span className="text-white">{templateDimensions.width}×{templateDimensions.height}px</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Text Areas:</span>
                  <span className="text-white">{nameAreas.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Recipients:</span>
                  <span className="text-white">{names.length}</span>
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

        {/* Mobile Overlay */}
        {(sidebarOpen || rightSidebarOpen) && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => {
              setSidebarOpen(false)
              setRightSidebarOpen(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
