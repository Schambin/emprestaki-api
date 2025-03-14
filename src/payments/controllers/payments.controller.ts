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

    /**
     * @swagger
     * /payments:
     *   post:
     *     summary: Cria um novo pagamento
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreatePaymentInput'
     *     responses:
     *       201:
     *         description: Pagamento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Payment'
     *       400:
     *         description: |
     *           Erros de validação:
     *           - ID do empréstimo inválido
     *           - Valor do pagamento deve ser positivo
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado
     *       404:
     *         description: Empréstimo não encontrado
     *       500:
     *         description: Erro interno no servidor
     */
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

    /**
    * @swagger
    * /payments/{id}:
    *   get:
    *     summary: Obtém detalhes de um pagamento
    *     tags: [Payments]
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         schema:
    *           type: integer
    *         required: true
    *         description: ID do pagamento
    *     responses:
    *       200:
    *         description: Detalhes do pagamento
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/Payment'
    *       400:
    *         description: ID inválido
    *       401:
    *         description: Não autenticado
    *       404:
    *         description: Pagamento não encontrado
    *       500:
    *         description: Erro interno no servidor
    */
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
    /**
     * @swagger
     * /payments/me:
     *   get:
     *     summary: Lista pagamentos do usuário logado
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de pagamentos do usuário
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Payment'
     *       401:
     *         description: Não autenticado
     *       500:
     *         description: Erro interno no servidor
     */
    async getUserPayments(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const payments = await this.paymentService.getUserPayments(userId);
            res.json({ payments });
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch user payments" });
        }
    }

    /**
     * @swagger
     * /payments/loan/{loanId}:
     *   get:
     *     summary: Lista pagamentos de um empréstimo (apenas administrador)
     *     tags: [Payments]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: loanId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID do empréstimo
     *     responses:
     *       200:
     *         description: Lista de pagamentos do empréstimo
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Payment'
     *       401:
     *         description: Não autenticado
     *       403:
     *         description: Acesso negado
     *       500:
     *         description: Erro interno no servidor
     */
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