import api from '../utils/api'

/**
 * Fetch all unread or read notification alerts of the user.
 */
export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications')
  return data
}

/**
 * Mark a specific notification alert as read.
 */
export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/notifications/${id}/read`)
  return data
}

/**
 * Mark all notification alerts of the user as read.
 */
export const markAllNotificationsRead = async () => {
  const { data } = await api.put('/notifications/read-all')
  return data
}

/**
 * Delete a specific notification alert.
 */
export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/notifications/${id}`)
  return data
}
