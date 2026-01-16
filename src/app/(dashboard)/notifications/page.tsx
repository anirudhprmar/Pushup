"use client"

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
import { api } from '~/lib/api'
import { NotificationType } from '~/types/schema'



export default function Notifications() {
  const utils = api.useUtils()
  const { data: notifications, isLoading } = api.notification.getAll.useQuery()
  
  const markAsReadMutation = api.notification.markRead.useMutation({
    onSuccess: () => {
      void utils.notification.getAll.invalidate()
      void utils.notification.getUnreadCount.invalidate()
    }
  })
  
  const markAllReadMutation = api.notification.markAllRead.useMutation({
    onSuccess: () => {
      void utils.notification.getAll.invalidate()
      void utils.notification.getUnreadCount.invalidate()
    }
  })
  
  const clearAllMutation = api.notification.clearAll.useMutation({
    onSuccess: () => {
      void utils.notification.getAll.invalidate()
      void utils.notification.getUnreadCount.invalidate()
    }
  })
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0
  
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({ id })
  }
  
  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate()
  }
  
  const handleClearAll = () => {
    clearAllMutation.mutate()
  }
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.WELCOME:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case NotificationType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case NotificationType.INFO:
        return <TreeDeciduous className="h-5 w-5 text-primary" />
      case NotificationType.FEATURE:
        return <ListTodo className="h-5 w-5 text-blue-500" />
      case NotificationType.UPDATE:
        return <ListTodo className="h-5 w-5 text-violet-500" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }
  
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="default" className="rounded-full px-2.5">
                  <span className="sr-only">Unread count:</span>
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            {notifications && notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-sm"
                    disabled={markAllReadMutation.isPending}
                  >
                    <CheckCheck className="mr-2 h-4 w-4" aria-hidden="true" />
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-sm text-destructive hover:text-destructive"
                  disabled={clearAllMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Notifications List */}
        {!notifications || notifications.length === 0 ? (
          <section aria-label="No notifications">
            <Card className="bg-secondary/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <BellOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <h2 className="mb-2 text-lg font-semibold">No notifications</h2>
                <p className="text-center text-sm text-muted-foreground max-w-xs">
                  You&apos;re all caught up! We&apos;ll notify you when something new happens.
                </p>
              </CardContent>
            </Card>
          </section>
        ) : (
          <ul className="space-y-3">
            {notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((notification) => (
              <li key={notification.id}>
                <Card
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : 'bg-card'
                  }`}
                >
                  <CardContent className="p-4">
                    <article className="flex items-start gap-4">
                      <div className="mt-1" aria-hidden="true">{getNotificationIcon(notification.type as NotificationType)}</div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="shrink-0 text-xs h-8 px-2"
                              disabled={markAsReadMutation.isPending}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <time dateTime={notification.createdAt.toISOString()}>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </time>
                          {!notification.read && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                          )}
                        </div>
                      </div>
                    </article>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}