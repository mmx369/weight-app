import { Router } from 'express'
import WeightController from './controllers/weightController'

//@ts-ignore
const router = new Router()

router.get('/weight', WeightController.getAll)
router.post('/weight', WeightController.create)

export default router
