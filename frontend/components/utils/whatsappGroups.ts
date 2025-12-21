/**
 * WhatsApp Group Mapping Utility
 * Maps community type to WhatsApp group links
 */

// WhatsApp groups by community type
const WHATSAPP_GROUPS = {
  local: 'https://chat.whatsapp.com/I9utNeip977H5k8oGW5KCy?mode=ems_copy_c',
  diaspora: 'https://chat.whatsapp.com/CVWXWSeSfuKFj5UFmj6ESL?mode=ems_copy_c'
};

/**
 * Get WhatsApp group link based on community type
 * @param communityType - 'local' or 'diaspora'
 * @returns WhatsApp group link
 */
export function getWhatsAppGroupLink(
  communityType: 'local' | 'diaspora'
): string {
  return WHATSAPP_GROUPS[communityType];
}

