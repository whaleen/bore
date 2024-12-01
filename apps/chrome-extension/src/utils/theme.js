// src/utils/theme.js
export async function updateUserTheme(userId, theme) {
  try {
    const response = await fetch('/.netlify/functions/update-user-preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        theme,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update theme preference')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating theme:', error)
    throw error
  }
}

export function initializeTheme(savedTheme) {
  // Check localStorage first
  const localTheme = localStorage.getItem('theme')
  if (localTheme) return localTheme

  // Then use saved preference from DB
  if (savedTheme) return savedTheme

  // Finally fallback to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}
