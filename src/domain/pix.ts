/** Gera o "copia e cola" de um PIX estático segundo o padrão BR Code (EMV). */
export class PixPayload {
  constructor(
    private readonly key: string,
    private readonly merchant: string,
    private readonly city: string,
  ) {}

  build(amount?: number): string {
    const account = field("00", "br.gov.bcb.pix") + field("01", this.key);
    const body =
      field("00", "01") +
      field("26", account) +
      field("52", "0000") +
      field("53", "986") +
      (amount && amount > 0 ? field("54", amount.toFixed(2)) : "") +
      field("58", "BR") +
      field("59", ascii(this.merchant, 25)) +
      field("60", ascii(this.city, 15)) +
      field("62", field("05", "***")) +
      "6304";
    return body + crc16(body);
  }
}

function field(id: string, value: string) {
  return id + String(value.length).padStart(2, "0") + value;
}

function ascii(text: string, max: number) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase().slice(0, max);
}

/** CRC-16/CCITT-FALSE. */
export function crc16(text: string) {
  let crc = 0xffff;
  for (const char of text) {
    crc ^= char.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}
