import { BadRequestError, NotFoundError } from "../../errors/http.errors";
import { PaymentService } from "../service/payments.service";
import { Request, Response } from "express";

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
        this.bindMethods();
    }

    private bindMethods() {
        const methods: Array<keyof PaymentController> = [
            'createPayment', 'getLoanPayments', 'getPaymentDetails',
            'getUserPayments'
        ];

        methods.forEach(method => {
            this[method] = this[method].bind(this);
        });
    }

    async createPayment(req: Request, res: Response) {
        try {
            console.log("Request body:", req.body); // Debugging
            const userId = req.user!.id;
            const { loanId, amount } = req.body;
            console.log("Creating payment for user:", userId, "loan:", loanId, "amount:", amount); // Debugging
            const payment = await this.paymentService.createPayment(userId, loanId, amount);
            res.status(201).json({ message: "Payment created", payment });
        } catch (error) {
            console.error("Error creating payment:", error); // Debugging
            if (error instanceof BadRequestError || error instanceof NotFoundError) {
                res.status(error.statusCode).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: "Failed to create payment" });
        }
    }

    async getPaymentDetails(req: Request, res: Response) {
        try {
            console.log("Fetching payment details for ID:", req.params.id); // Debugging
            const paymentId = parseInt(req.params.id);
            if (isNaN(paymentId)) {
                throw new BadRequestError("Invalid payment ID");
            }
            const payment = await this.paymentService.getPaymentDetails(paymentId);
            console.log("Payment found:", payment); // Debugging
            res.json({ payment });
        } catch (error) {
            console.error("Error fetching payment details:", error); // Debugging
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