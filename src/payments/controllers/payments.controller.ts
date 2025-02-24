import { BadRequestError, NotFoundError } from "../../errors/http.errors";
import { PaymentService } from "../service/payments.service";
import { Request, Response } from "express";

export class PaymentController {
    private paymentService = new PaymentService();

    async createPayment(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { loanId, amount } = req.body;
            const payment = await this.paymentService.createPayment(userId, loanId, amount);
            res.status(201).json({ message: "Payment created", payment });
        } catch (error) {
            if (error instanceof BadRequestError || error instanceof NotFoundError) {
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Failed to create payment" });
        }
    }

    async getPaymentDetails(req: Request, res: Response) {
        try {
            const paymentId = parseInt(req.params.id);
            const payment = await this.paymentService.getPaymentDetails(paymentId);
            res.json({ payment });
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Failed to fetch payment details" });
        }
    }

    async getUserPayments(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const payments = await this.paymentService.getUserPayments(userId);
            res.json({ payments });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user payments" });
        }
    }

    async getLoanPayments(req: Request, res: Response) {
        try {
            const loanId = parseInt(req.params.loanId);
            const payments = await this.paymentService.getLoanPayments(loanId);
            res.json({ payments });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch loan payments" });
        }
    }
}