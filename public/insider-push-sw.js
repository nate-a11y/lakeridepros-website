self.addEventListener('push', (event) => {
  let payload = {}

  try {
    payload = event.data ? event.data.json() : {}
  } catch {
    payload = {
      body: event.data ? event.data.text() : 'You have a new Insider update.',
    }
  }

  const title = payload.title || 'Lake Ride Pros Insider Rewards'
  const actionUrl =
    payload.data && typeof payload.data.url === 'string'
      ? payload.data.url
      : '/insiders/events'

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || 'You have a new Insider update.',
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      tag: payload.tag || 'insider-rewards',
      data: { ...(payload.data || {}), url: actionUrl },
      actions: Array.isArray(payload.actions) ? payload.actions : undefined,
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const requestedTarget = new URL(
    event.notification.data?.url || '/insiders/events',
    self.location.origin,
  )
  const target =
    requestedTarget.origin === self.location.origin
      ? requestedTarget.href
      : new URL('/insiders/events', self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(
      (clients) => {
        for (const client of clients) {
          if ('focus' in client && client.url.startsWith(self.location.origin)) {
            if ('navigate' in client) void client.navigate(target)
            return client.focus()
          }
        }
        return self.clients.openWindow(target)
      },
    ),
  )
})
