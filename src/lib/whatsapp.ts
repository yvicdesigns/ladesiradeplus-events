import { CartItem } from "@/store/cart";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "242064000000";

interface OrderDetails {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  eventDate: string;
  deliveryAddress?: string;
  notes?: string;
  totalPrice: number;
  locale?: string;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function generateWhatsAppMessage(order: OrderDetails): string {
  const { items, customerName, customerPhone, eventDate, deliveryAddress, notes, totalPrice, locale = "fr" } = order;

  const isFr = locale === "fr";

  const itemsList = items
    .map(
      (item) =>
        `• ${isFr ? item.article.name_fr : item.article.name_en} x${item.quantity} — ${formatPrice(item.article.price_per_day * item.quantity)}`
    )
    .join("\n");

  const message = isFr
    ? `Bonjour La Désirade Événements ! 👋\nJe souhaite louer le matériel suivant :\n\n📦 COMMANDE :\n${itemsList}\n\n💰 Total estimé : ${formatPrice(totalPrice)}\n\n👤 Nom : ${customerName}\n📞 Téléphone : ${customerPhone}\n📅 Date événement : ${eventDate}${deliveryAddress ? `\n📍 Adresse : ${deliveryAddress}` : ""}${notes ? `\n📝 Notes : ${notes}` : ""}\n\nMerci de confirmer la disponibilité 🙏`
    : `Hello La Désirade Événements! 👋\nI would like to rent the following equipment:\n\n📦 ORDER:\n${itemsList}\n\n💰 Estimated total: ${formatPrice(totalPrice)}\n\n👤 Name: ${customerName}\n📞 Phone: ${customerPhone}\n📅 Event date: ${eventDate}${deliveryAddress ? `\n📍 Address: ${deliveryAddress}` : ""}${notes ? `\n📝 Notes: ${notes}` : ""}\n\nPlease confirm availability 🙏`;

  return message;
}

export function generateWhatsAppLink(order: OrderDetails): string {
  const message = generateWhatsAppMessage(order);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppContactLink(locale = "fr"): string {
  const message =
    locale === "fr"
      ? "Bonjour La Désirade Événements ! Je souhaite avoir des informations sur vos services de location de décoration."
      : "Hello La Désirade Événements! I would like to get information about your decoration rental services.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
