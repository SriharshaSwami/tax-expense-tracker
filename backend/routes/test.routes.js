import express from 'express'
import { testApi, testAi } from '../controllers/test.controller.js'

const router = express.Router()

router.get('/test', testApi)
router.get('/test-ai', testAi)

export default router
