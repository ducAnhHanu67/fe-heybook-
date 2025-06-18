export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 't6hvkmsi')
  formData.append('folder', 'avatars')

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dfqy99xch/image/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id
    }
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }
}
