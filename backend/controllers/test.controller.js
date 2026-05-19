export const testApi = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API working',
  })
}
