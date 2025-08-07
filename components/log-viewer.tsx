import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'
import { type LogEntry } from '@/app/page' // Import the LogEntry type

interface LogViewerProps {
  logs: LogEntry[]
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <ScrollArea className="h-full"> {/* Ensure ScrollArea takes full height of its parent */}
      <div className="space-y-2">
        {logs.map(log => (
          <Alert key={log.id} className={`text-xs border ${
            log.type === 'error' ? 'border-red-500 bg-red-900/20' :
            log.type === 'success' ? 'border-green-500 bg-green-900/20' :
            log.type === 'warning' ? 'border-yellow-500 bg-yellow-900/20' :
            'border-blue-500 bg-blue-900/20'
          }`}>
            <div className="flex items-start gap-2">
              {log.type === 'error' && <AlertCircle className="w-3 h-3 text-red-400 mt-0.5" />}
              {log.type === 'success' && <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />}
              {log.type === 'warning' && <AlertCircle className="w-3 h-3 text-yellow-400 mt-0.5" />}
              {log.type === 'info' && <Info className="w-3 h-3 text-blue-400 mt-0.5" />}
              <div className="flex-1">
                <AlertDescription className="text-xs text-white">
                  {log.message}
                </AlertDescription>
                <div className="text-xs text-gray-400 mt-1">
                  {log.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </ScrollArea>
  )
}

export default LogViewer
