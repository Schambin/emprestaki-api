import { Router } from "express";
import { PaymentController } from "../payments/controllers/payments.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

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
        "/user",
        authenticate,
        authorize(["LEITOR", "ADMINISTRADOR"]),
        controller.getUserPayments
    );

    router.get(
        "/loan/:loanId",
        authenticate,
        authorize(["LEITOR", "ADMINISTRADOR"]),
        controller.getLoanPayments
    );

    return router;
};