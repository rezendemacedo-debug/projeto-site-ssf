export interface Email {
  to: string;
  subject: string;
  text: string;
}

/** Envio de e-mail. A implementação é escolhida em `container.ts` conforme a configuração. */
export interface Mailer {
  send(email: Email): Promise<void>;
}

/**
 * Envia pela API HTTP do Resend (resend.com). Outro provedor (SES, SendGrid, SMTP)
 * só precisa implementar `Mailer`.
 */
export class ResendMailer implements Mailer {
  constructor(
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send({ to, subject, text }: Email) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: this.from, to: [to], subject, text }),
    });
    if (!response.ok) throw new Error(`Falha ao enviar e-mail (${response.status})`);
  }
}

/** Desenvolvimento: mostra o e-mail no terminal em vez de enviar. */
export class ConsoleMailer implements Mailer {
  async send({ to, subject, text }: Email) {
    console.info(`[e-mail] Para: ${to}\nAssunto: ${subject}\n\n${text}\n`);
  }
}

/** Produção sem provedor configurado: falha de forma explícita, sem fingir que enviou. */
export class UnconfiguredMailer implements Mailer {
  async send(): Promise<void> {
    throw new Error("Envio de e-mail não configurado: defina RESEND_API_KEY e MAIL_FROM.");
  }
}
