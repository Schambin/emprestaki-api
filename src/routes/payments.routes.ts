import { Router } from "express";
import { PaymentController } from "../payments/controllers/payments.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

/**
 * @swagger
 * tags:
 *   - name: Payments
 *     description: Gerenciamento de pagamentos de empréstimos
 */
export const paymentRoutes = () => {
    const router = Router();
    const controller = new PaymentController();

    router.post(
        "/",
        authenticate,
        authorize(["LEITOR", "ADMINISTRADOR"]),
        controller.createPayment
    );

    router.get(
        "/:id",
        authenticate,
        authorize(["LEITOR", "ADMINISTRADOR"]),
        controller.getPaymentDetails
    );

    router.get(
        "/me",
        authenticate,
        authorize(["LEITOR", "ADMINISTRADOR"]),
        controller.getUserPayments
    );

    /**
     * @swagger
     * /payments/loan/{loanId}:
     *   get:
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: loanId
     *         schema:
     *           type: integer
     *         required: true
     */
    router.get(
        "/loan/:loanId",
        authenticate,
        authorize(["ADMINISTRADOR"]),
        controller.getLoanPayments
    );

    return router;
};