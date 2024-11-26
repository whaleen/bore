// netlify/functions/update-user-preferences.js
import prisma from './prisma'

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  try {
    const { theme, userId } = JSON.parse(event.body)
    console.log('Received request to update theme:', { theme, userId })

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme },
      select: { theme: true }
    })

    console.log('Updated user theme:', updatedUser)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedUser)
    }
  } catch (error) {
    console.error('Error updating user preferences:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update user preferences', details: error.message })
    }
  }
}
