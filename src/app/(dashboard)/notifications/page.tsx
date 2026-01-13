"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { 
  BellOff, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  TreeDeciduous,
  ListTodo,
  Trash2,
  CheckCheck
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'habit' | 'task'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
}

// Mock data - replace with actual API call
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'habit',
    title: 'Habit Reminder',
    message: 'Time to complete your "Morning Exercise" habit!',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isRead: false,
  },
  {
    id: '2',
    type: 'success',
    title: 'Streak Milestone!',
    message: 'Congratulations! You\'ve reached a 7-day streak on "Reading"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: '3',
    type: 'task',
    title: 'Task Due Soon',
    message: 'Your task "Complete project documentation" is due tomorrow',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Habit Streak Warning',
    message: 'You\'re about to lose your 14-day streak on "Meditation". Complete it today!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Weekly Summary',
    message: 'Your weekly progress report is ready to view',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  
  const unreadCount = notifications.filter(n => !n.isRead).length
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }
  
  const clearAll = () => {
    setNotifications([])
  }
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'habit':
        return <TreeDeciduous className="h-5 w-5 text-primary" />
      case 'task':
        return <ListTodo className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }
  
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="default" className="rounded-full px-2.5">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-sm"
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-sm text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card className="bg-secondary">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 rounded-full bg-muted p-4">
                <BellOff className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
              <p className="text-center text-sm text-muted-foreground">
                You&apos;re all caught up! We&apos;ll notify you when something new happens.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-secondary' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="shrink-0 text-xs"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                        {!notification.isRead && (
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}