import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { safeAnimate, safeTransition } from './utils/animationUtils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, AlertCircle, Loader2, Globe, Users, Share2, ArrowRight } from 'lucide-react';
import { registrationService } from './services/registrationService';
import { cn } from './ui/utils';
import { getWhatsAppGroupLink } from './utils/whatsappGroups';
import { globalSouthCountries, diasporaCountries } from './utils/countries';

// Note: Countries are now imported from utils/countries.ts
// Additional countries can be added gradually to that file

interface UnifiedRegistrationFormProps {
  showHeader?: boolean;
}

export function UnifiedRegistrationForm({ showHeader = true }: UnifiedRegistrationFormProps) {
  const [communityType, setCommunityType] = useState<'diaspora' | 'local'>('local');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    countryOfOrigin: '',
    countryOfResidence: '',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ipAddress: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get available countries based on community type
  const availableCountries = communityType === 'local' ? globalSouthCountries : diasporaCountries;
  { code: 'EG', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Mansoura', 'Tanta', 'Asyut', 'Ismailia', 'Faiyum', 'Zagazig', 'Damietta'] },
  { code: 'SD', name: 'Sudan', cities: ['Khartoum', 'Omdurman', 'Port Sudan', 'Kassala', 'El Obeid', 'Nyala', 'Wad Madani', 'Al Qadarif', 'Kosti', 'El Fasher', 'Geneina', 'Ed Damer', 'Atbara', 'Singa', 'El Daein'] },
  { code: 'LY', name: 'Libya', cities: ['Tripoli', 'Benghazi', 'Misrata', 'Bayda', 'Zawiya', 'Ajdabiya', 'Sabha', 'Sirte', 'Tobruk', 'Derna', 'Gharyan', 'Khoms', 'Zuwara', 'Tarhuna', 'Bani Walid'] },
  { code: 'SO', name: 'Somalia', cities: ['Mogadishu', 'Hargeisa', 'Kismayo', 'Berbera', 'Baidoa', 'Bosaso', 'Galkayo', 'Garowe', 'Jowhar', 'Merca', 'Beledweyne', 'Borama', 'Las Anod', 'Eyl', 'Afgooye'] },
  { code: 'ER', name: 'Eritrea', cities: ['Asmara', 'Keren', 'Massawa', 'Assab', 'Mendefera', 'Adi Keyh', 'Barentu', 'Nakfa', 'Teseney', 'Dekemhare', 'Agordat', 'Ghinda', 'Senafe', 'Edd', 'Ak\'ordat'] },
  { code: 'DJ', name: 'Djibouti', cities: ['Djibouti', 'Ali Sabieh', 'Tadjoura', 'Obock', 'Dikhil', 'Arta', 'Holhol', 'Yoboki', 'Loyada', 'Randa'] },
  { code: 'TD', name: 'Chad', cities: ['N\'Djamena', 'Moundou', 'Sarh', 'Abéché', 'Kelo', 'Koumra', 'Pala', 'Am Timan', 'Bongor', 'Mongo', 'Ati', 'Oum Hadjer', 'Doba', 'Lai', 'Biltine'] },
  { code: 'NE', name: 'Niger', cities: ['Niamey', 'Zinder', 'Maradi', 'Agadez', 'Tahoua', 'Dosso', 'Diffa', 'Tillabéri', 'Arlit', 'Ayorou', 'Birni N\'Konni', 'Gaya', 'Madaoua', 'Tessaoua', 'Magaria'] },
  { code: 'BF', name: 'Burkina Faso', cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Dédougou', 'Kaya', 'Tenkodogo', 'Fada N\'gourma', 'Dori', 'Gaoua', 'Koupéla', 'Zorgho', 'Manga', 'Nouna'] },
  { code: 'GN', name: 'Guinea', cities: ['Conakry', 'Nzérékoré', 'Kindia', 'Boké', 'Kankan', 'Labé', 'Mamou', 'Kamsar', 'Faranah', 'Siguiri', 'Macenta', 'Kissidougou', 'Guéckédou', 'Télimélé', 'Pita'] },
  { code: 'SL', name: 'Sierra Leone', cities: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu', 'Lunsar', 'Port Loko', 'Kabala', 'Magburaka', 'Kailahun', 'Bonthe', 'Pujehun', 'Yengema', 'Moyamba', 'Waterloo'] },
  { code: 'LR', name: 'Liberia', cities: ['Monrovia', 'Gbarnga', 'Buchanan', 'Zwedru', 'Harper', 'Voinjama', 'Kakata', 'Bensonville', 'Robertsport', 'Greenville', 'Sanniquellie', 'Tubmanburg', 'Harbel', 'Barclayville', 'Fish Town'] },
  { code: 'TG', name: 'Togo', cities: ['Lomé', 'Sokodé', 'Kara', 'Kpalimé', 'Atakpamé', 'Bassar', 'Tsévié', 'Aného', 'Mango', 'Dapaong', 'Tchamba', 'Notsé', 'Vogan', 'Badou', 'Kandé'] },
  { code: 'BJ', name: 'Benin', cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Djougou', 'Bohicon', 'Abomey', 'Natitingou', 'Lokossa', 'Ouidah', 'Kandi', 'Pobé', 'Savalou', 'Malanville', 'Comé', 'Allada'] },
  { code: 'MR', name: 'Mauritania', cities: ['Nouakchott', 'Nouadhibou', 'Rosso', 'Kaédi', 'Zouérat', 'Atar', 'Kiffa', 'Aleg', 'Selibaby', 'Aïoun', 'Tidjikja', 'Akjoujt', 'Boutilimit', 'Néma', 'Fderîck'] },
  { code: 'GM', name: 'Gambia', cities: ['Banjul', 'Serekunda', 'Brikama', 'Bakau', 'Farafenni', 'Lamin', 'Sukuta', 'Basse Santa Su', 'Gunjur', 'Brufut', 'Yundum', 'Essau', 'Kotu', 'Tanji', 'Kerewan'] },
  { code: 'GW', name: 'Guinea-Bissau', cities: ['Bissau', 'Bafatá', 'Gabú', 'Bissorã', 'Bolama', 'Cacheu', 'Catió', 'Farim', 'Mansôa', 'Quinhámel', 'Buba', 'Canchungo', 'Fulacunda', 'São Domingos', 'Varela'] },
  { code: 'ST', name: 'São Tomé and Príncipe', cities: ['São Tomé', 'Trindade', 'Santana', 'Neves', 'Guadalupe', 'Santo António', 'São João dos Angolares', 'Ribeira Afonso', 'Ponta do Sol', 'Santo Amaro'] },
  { code: 'GA', name: 'Gabon', cities: ['Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Moanda', 'Mouila', 'Tchibanga', 'Koulamoutou', 'Lambaréné', 'Bitam', 'Gamba', 'Mitzic', 'Okondja', 'Ntoum', 'Ndjolé'] },
  { code: 'CG', name: 'Republic of the Congo', cities: ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Owando', 'Ouesso', 'Loandjili', 'Madingou', 'Gamboma', 'Impfondo', 'Sibiti', 'Mossendjo', 'Kinkala', 'Djambala', 'Ewo'] },
  { code: 'CD', name: 'Democratic Republic of the Congo', cities: ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Bukavu', 'Kananga', 'Tshikapa', 'Likasi', 'Kolwezi', 'Goma', 'Kikwit', 'Uvira', 'Bunia', 'Matadi', 'Mbandaka'] },
  { code: 'CF', name: 'Central African Republic', cities: ['Bangui', 'Bimbo', 'Berbérati', 'Carnot', 'Bambari', 'Bouar', 'Bossangoa', 'Bria', 'Bangassou', 'Nola', 'Kaga-Bandoro', 'Mbaïki', 'Sibut', 'Mobaye', 'Paoua'] },
  { code: 'SS', name: 'South Sudan', cities: ['Juba', 'Wau', 'Malakal', 'Yambio', 'Rumbek', 'Torit', 'Bor', 'Aweil', 'Yei', 'Bentiu', 'Kuacjok', 'Gogrial', 'Maridi', 'Kapoeta', 'Renk'] },
  { code: 'MW', name: 'Malawi', cities: ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Mangochi', 'Karonga', 'Salima', 'Nkhotakota', 'Liwonde', 'Nsanje', 'Rumphi', 'Mzimba', 'Balaka', 'Dedza'] },
  { code: 'MZ', name: 'Mozambique', cities: ['Maputo', 'Matola', 'Beira', 'Nampula', 'Chimoio', 'Nacala', 'Quelimane', 'Tete', 'Lichinga', 'Pemba', 'Xai-Xai', 'Gurue', 'Maxixe', 'Angoche', 'Montepuez'] },
  { code: 'MG', name: 'Madagascar', cities: ['Antananarivo', 'Toamasina', 'Antsirabe', 'Mahajanga', 'Fianarantsoa', 'Toliara', 'Antsiranana', 'Ambovombe', 'Ambanja', 'Manakara', 'Sambava', 'Ambatondrazaka', 'Morondava', 'Tôlanaro', 'Maroantsetra'] },
  { code: 'MU', name: 'Mauritius', cities: ['Port Louis', 'Beau Bassin-Rose Hill', 'Vacoas-Phoenix', 'Curepipe', 'Quatre Bornes', 'Triolet', 'Goodlands', 'Centre de Flacq', 'Mahébourg', 'Rivière du Rempart', 'Bel Air', 'Grand Baie', 'Rose Belle', 'Pamplemousses', 'Mahebourg'] },
  { code: 'SC', name: 'Seychelles', cities: ['Victoria', 'Anse Boileau', 'Beau Vallon', 'Cascade', 'Takamaka', 'Anse Royale', 'Baie Lazare', 'Bel Ombre', 'Grand Anse', 'La Digue'] },
  { code: 'KM', name: 'Comoros', cities: ['Moroni', 'Mutsamudu', 'Fomboni', 'Domoni', 'Tsimbeo', 'Ouani', 'Mitsamiouli', 'Iconi', 'Ongojou', 'Mbeni'] },
  // Caribbean
  { code: 'JM', name: 'Jamaica', cities: ['Kingston', 'Montego Bay', 'Spanish Town', 'Portmore', 'Mandeville', 'Ocho Rios', 'Negril', 'May Pen', 'Savanna-la-Mar', 'Old Harbour', 'Linstead', 'St. Ann\'s Bay', 'Falmouth', 'Port Antonio', 'Morant Bay'] },
  { code: 'TT', name: 'Trinidad and Tobago', cities: ['Port of Spain', 'San Fernando', 'Chaguanas', 'Arima', 'Couva', 'Point Fortin', 'Princes Town', 'Tunapuna', 'Scarborough', 'Sangre Grande', 'Rio Claro', 'Siparia', 'Penal', 'Debe', 'Marabella'] },
  { code: 'BB', name: 'Barbados', cities: ['Bridgetown', 'Speightstown', 'Oistins', 'Holetown', 'The Crane', 'St. Lawrence', 'Worthing', 'Hastings', 'Bathsheba', 'Crane', 'Six Cross Roads', 'Warrens', 'Black Rock', 'Rockley', 'St. Philip'] },
  { code: 'GD', name: 'Grenada', cities: ['St. George\'s', 'Gouyave', 'Grenville', 'Victoria', 'Sauteurs', 'Hillsborough', 'Carriacou', 'Grenville', 'St. David\'s', 'Tivoli', 'Woburn', 'Marquis', 'La Tante', 'Westerhall', 'Paradise'] },
  { code: 'BS', name: 'Bahamas', cities: ['Nassau', 'Freeport', 'Marsh Harbour', 'George Town', 'Coopers Town', 'High Rock', 'Andros Town', 'Duncan Town', 'Alice Town', 'Matthew Town', 'Clarence Town', 'Dunmore Town', 'Rock Sound', 'Governor\'s Harbour', 'Spanish Wells'] },
  { code: 'HT', name: 'Haiti', cities: ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Jérémie', 'Port-de-Paix', 'Jacmel', 'Petionville', 'Delmas', 'Carrefour', 'Saint-Marc', 'Hinche', 'Miragoâne', 'Fort-Liberté', 'Trou-du-Nord'] },
  { code: 'CU', name: 'Cuba', cities: ['Havana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Santa Clara', 'Guantánamo', 'Bayamo', 'Cienfuegos', 'Pinar del Río', 'Matanzas', 'Cárdenas', 'Sancti Spíritus', 'Mariel', 'Manzanillo', 'Ciego de Ávila'] },
  { code: 'DO', name: 'Dominican Republic', cities: ['Santo Domingo', 'Santiago', 'La Romana', 'San Pedro de Macorís', 'San Francisco de Macorís', 'Puerto Plata', 'Bavaro', 'Punta Cana', 'Higüey', 'Baní', 'Moca', 'Azua', 'Barahona', 'Bonao', 'San Cristóbal'] },
  { code: 'PR', name: 'Puerto Rico', cities: ['San Juan', 'Bayamón', 'Carolina', 'Ponce', 'Caguas', 'Guaynabo', 'Mayagüez', 'Trujillo Alto', 'Arecibo', 'Fajardo', 'Cayey', 'Aguadilla', 'Humacao', 'Yauco', 'Vega Baja'] },
  // Latin America
  { code: 'BR', name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís'] },
  { code: 'MX', name: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Mexicali', 'Aguascalientes', 'Cuernavaca', 'Toluca'] },
  { code: 'AR', name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Bahía Blanca', 'Posadas'] },
  { code: 'CO', name: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Soledad', 'Ibagué', 'Bucaramanga', 'Santa Marta', 'Pereira', 'Villavicencio', 'Pasto', 'Manizales', 'Valledupar'] },
  { code: 'PE', name: 'Peru', cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Huancayo', 'Chimbote', 'Pucallpa', 'Tacna', 'Ica', 'Juliaca', 'Sullana', 'Cajamarca'] },
  { code: 'CL', name: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique', 'Puerto Montt', 'Coquimbo', 'Valdivia', 'Osorno', 'Calama'] },
  { code: 'VE', name: 'Venezuela', cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Barcelona', 'Maturín', 'Ciudad Bolívar', 'San Cristóbal', 'Cumaná', 'Barinas', 'Mérida', 'Cabimas', 'Puerto La Cruz'] },
  { code: 'EC', name: 'Ecuador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Ambato', 'Riobamba', 'Quevedo', 'Loja', 'Milagro', 'Esmeraldas', 'Babahoyo'] },
  { code: 'GT', name: 'Guatemala', cities: ['Guatemala City', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'San Juan Sacatepéquez', 'Villa Canales', 'Petapa', 'Chimaltenango', 'Huehuetenango', 'Cobán', 'Jutiapa', 'Mazatenango', 'Retalhuleu', 'Totonicapán'] },
  { code: 'BO', name: 'Bolivia', cities: ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Oruro', 'Tarija', 'Potosí', 'Trinidad', 'Riberalta', 'Montero', 'Quillacollo', 'Yacuiba', 'Camiri', 'Villazón', 'Tupiza'] },
  { code: 'PY', name: 'Paraguay', cities: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Lambaré', 'Fernando de la Mora', 'Encarnación', 'Pedro Juan Caballero', 'Villarrica', 'Coronel Oviedo', 'Concepción', 'Villa Hayes', 'Caaguazú', 'Itauguá'] },
  { code: 'UY', name: 'Uruguay', cities: ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó', 'Melo', 'Mercedes', 'Artigas', 'Minas', 'San José de Mayo', 'Durazno', 'Barros Blancos'] },
  { code: 'NI', name: 'Nicaragua', cities: ['Managua', 'León', 'Masaya', 'Granada', 'Chinandega', 'Matagalpa', 'Estelí', 'Tipitapa', 'Jinotega', 'Bluefields', 'Juigalpa', 'Rivas', 'San Carlos', 'Ocotal', 'Puerto Cabezas'] },
  { code: 'CR', name: 'Costa Rica', cities: ['San José', 'Cartago', 'Alajuela', 'Heredia', 'Puntarenas', 'Limón', 'Liberia', 'San Isidro', 'Desamparados', 'San Pedro', 'Curridabat', 'Escazú', 'San Ramón', 'Paraíso', 'Turrialba'] },
  { code: 'PA', name: 'Panama', cities: ['Panama City', 'San Miguelito', 'Tocumen', 'David', 'Colón', 'La Chorrera', 'Santiago', 'Chitré', 'Aguadulce', 'Penonomé', 'Las Tablas', 'Changuinola', 'Alcalde Díaz', 'Arraiján', 'Vista Alegre'] },
  { code: 'HN', name: 'Honduras', cities: ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Puerto Cortés', 'La Lima', 'Villanueva', 'Juticalpa', 'Siguatepeque', 'Danlí', 'Tela', 'Santa Rosa de Copán'] },
  { code: 'SV', name: 'El Salvador', cities: ['San Salvador', 'Santa Ana', 'San Miguel', 'Mejicanos', 'Soyapango', 'Apopa', 'Delgado', 'Ahuachapán', 'San Martín', 'Sonsonate', 'Cuscatancingo', 'San Marcos', 'Usulután', 'Cojutepeque', 'Zacatecoluca'] },
  { code: 'BZ', name: 'Belize', cities: ['Belize City', 'San Ignacio', 'Orange Walk', 'Belmopan', 'Dangriga', 'Corozal Town', 'San Pedro', 'Punta Gorda', 'Benque Viejo del Carmen', 'Ladyville', 'Hopkins', 'Placencia', 'Caye Caulker', 'Toledo', 'Shipyard'] },
  // Asia (Global South)
  { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'] },
  { code: 'PK', name: 'Pakistan', cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Peshawar', 'Islamabad', 'Quetta', 'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Larkana', 'Sheikhupura'] },
  { code: 'BD', name: 'Bangladesh', cities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Comilla', 'Barisal', 'Rangpur', 'Mymensingh', 'Jessore', 'Narayanganj', 'Gazipur', 'Bogra', 'Dinajpur', 'Cox\'s Bazar'] },
  { code: 'PH', name: 'Philippines', cities: ['Manila', 'Quezon City', 'Caloocan', 'Davao', 'Cebu', 'Zamboanga', 'Antipolo', 'Pasig', 'Taguig', 'Makati', 'Bacolod', 'General Santos', 'Parañaque', 'Las Piñas', 'Valenzuela'] },
  { code: 'VN', name: 'Vietnam', cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Vung Tau', 'Qui Nhon', 'Rach Gia', 'Long Xuyen', 'My Tho', 'Ca Mau', 'Bac Lieu'] },
  { code: 'TH', name: 'Thailand', cities: ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Udon Thani', 'Pak Kret', 'Khon Kaen', 'Phuket', 'Pattaya', 'Nakhon Si Thammarat', 'Surat Thani', 'Rayong', 'Chon Buri', 'Songkhla'] },
  { code: 'ID', name: 'Indonesia', cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Palembang', 'Makassar', 'Tangerang', 'Depok', 'Bekasi', 'Padang', 'Malang', 'Denpasar', 'Bandar Lampung', 'Pekanbaru'] },
  { code: 'MY', name: 'Malaysia', cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Kota Kinabalu', 'Kuching', 'Kota Kinabalu', 'Alor Setar', 'Miri', 'Seremban', 'Subang Jaya', 'Klang'] },
  { code: 'MM', name: 'Myanmar', cities: ['Yangon', 'Mandalay', 'Naypyidaw', 'Mawlamyine', 'Bago', 'Pathein', 'Monywa', 'Sittwe', 'Meiktila', 'Mergui', 'Taunggyi', 'Myeik', 'Pyay', 'Hinthada', 'Lashio'] },
  { code: 'KH', name: 'Cambodia', cities: ['Phnom Penh', 'Battambang', 'Siem Reap', 'Sihanoukville', 'Kampong Cham', 'Kampong Speu', 'Kampong Thom', 'Kandal', 'Takeo', 'Pursat', 'Kratie', 'Kampot', 'Prey Veng', 'Svay Rieng', 'Koh Kong'] },
  { code: 'LA', name: 'Laos', cities: ['Vientiane', 'Pakse', 'Savannakhet', 'Luang Prabang', 'Xam Neua', 'Phonsavan', 'Thakhek', 'Muang Xay', 'Phonhong', 'Muang Pakxan', 'Ban Houayxay', 'Attapeu', 'Saravan', 'Phongsaly', 'Xaignabouli'] },
  { code: 'LK', name: 'Sri Lanka', cities: ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Jaffna', 'Negombo', 'Pita Kotte', 'Sri Jayawardenepura Kotte', 'Kandy', 'Trincomalee', 'Kalmunai', 'Galle', 'Point Pedro', 'Batticaloa', 'Katunayake', 'Valvettithurai'] },
  { code: 'NP', name: 'Nepal', cities: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Biratnagar', 'Bharatpur', 'Birgunj', 'Dharan', 'Butwal', 'Janakpur', 'Hetauda', 'Itahari', 'Nepalgunj', 'Bhimdatta', 'Madhyapur Thimi', 'Birendranagar'] },
  { code: 'BT', name: 'Bhutan', cities: ['Thimphu', 'Phuntsholing', 'Punakha', 'Paro', 'Gelephu', 'Wangdue Phodrang', 'Jakar', 'Samdrup Jongkhar', 'Trashigang', 'Mongar', 'Trongsa', 'Dagana', 'Pemagatshel', 'Zhemgang', 'Lhuntse'] },
  { code: 'AF', name: 'Afghanistan', cities: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Kunduz', 'Jalalabad', 'Lashkar Gah', 'Taloqan', 'Pul-e-Khumri', 'Charikar', 'Ghazni', 'Khost', 'Sheberghan', 'Sar-e Pol', 'Gardez'] },
  { code: 'IR', name: 'Iran', cities: ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz', 'Kermanshah', 'Urmia', 'Rasht', 'Zahedan', 'Hamadan', 'Kerman', 'Yazd'] },
  { code: 'IQ', name: 'Iraq', cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala', 'Sulaymaniyah', 'Kirkuk', 'Nasiriyah', 'Amarah', 'Ramadi', 'Fallujah', 'Samarra', 'Baqubah', 'Diyarbakir'] },
  { code: 'YE', name: 'Yemen', cities: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Dhamar', 'Al Mukalla', 'Sayyan', 'Zabid', 'Hajjah', 'Sa\'dah', 'Amran', 'Al Bayda', 'Al Jawf', 'Marib'] },
  { code: 'JO', name: 'Jordan', cities: ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Wadi Al-Sir', 'Aqaba', 'Madaba', 'Salt', 'Mafraq', 'Jarash', 'Karak', 'Tafilah', 'Ma\'an', 'Ajloun', 'Sahab'] },
  { code: 'LB', name: 'Lebanon', cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Jounieh', 'Zahle', 'Baalbek', 'Byblos', 'Batroun', 'Jbeil', 'Zgharta', 'Halba', 'Marjayoun', 'Bint Jbeil'] },
  { code: 'PS', name: 'Palestine', cities: ['Gaza', 'Hebron', 'Nablus', 'Ramallah', 'Jericho', 'Bethlehem', 'Jenin', 'Tulkarm', 'Qalqilya', 'Salfit', 'Tubas', 'Jerusalem', 'Khan Yunis', 'Rafah', 'Deir al-Balah'] },
  { code: 'SY', name: 'Syria', cities: ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Raqqa', 'Deir ez-Zor', 'Al-Hasakah', 'Qamishli', 'Tartus', 'Idlib', 'Daraa', 'As-Suwayda', 'Al-Bab', 'Manbij'] },
  // Oceania (Global South)
  { code: 'FJ', name: 'Fiji', cities: ['Suva', 'Lautoka', 'Nadi', 'Labasa', 'Ba', 'Levuka', 'Sigatoka', 'Nausori'] },
  { code: 'PG', name: 'Papua New Guinea', cities: ['Port Moresby', 'Lae', 'Arawa', 'Mount Hagen', 'Popondetta', 'Madang', 'Kokopo', 'Goroka'] },
].sort((a, b) => a.name.localeCompare(b.name));

// Diaspora Countries (Outside Global South)
const diasporaCountries = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Fort Worth', 'Charlotte', 'Seattle', 'Denver', 'Washington', 'Boston'] },
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Edinburgh', 'Sheffield', 'Bristol', 'Cardiff', 'Belfast', 'Leicester', 'Coventry', 'Nottingham', 'Newcastle', 'Southampton', 'Portsmouth', 'Reading', 'Northampton', 'Luton'] },
  { code: 'CA', name: 'Canada', cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'Sherbrooke', 'Kelowna', 'Barrie'] },
  { code: 'FR', name: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'] },
  { code: 'DE', name: 'Germany', cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'] },
  { code: 'NL', name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn', 'Hoofddorp', 'Maastricht', 'Leiden', 'Dordrecht'] },
  { code: 'SE', name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Södertälje', 'Eskilstuna', 'Karlstad', 'Halmstad', 'Växjö', 'Sundsvall'] },
  { code: 'NO', name: 'Norway', cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum', 'Kristiansand', 'Fredrikstad', 'Tromsø', 'Sandnes', 'Asker', 'Skien', 'Drammen', 'Sarpsborg', 'Bodø', 'Ålesund', 'Arendal', 'Haugesund', 'Tønsberg', 'Moss', 'Porsgrunn'] },
  { code: 'DK', name: 'Denmark', cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Helsingør', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge', 'Holstebro', 'Taastrup', 'Sønderborg'] },
  { code: 'FI', name: 'Finland', cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta', 'Hämeenlinna', 'Vaasa', 'Seinäjoki', 'Rovaniemi', 'Mikkeli', 'Kotka', 'Salo'] },
  { code: 'IE', name: 'Ireland', cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan', 'Ennis', 'Kilkenny', 'Carlow', 'Tralee', 'Newbridge', 'Naas', 'Athlone', 'Portlaoise', 'Mullingar', 'Celbridge'] },
  { code: 'ES', name: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet', 'Granada', 'Vitoria-Gasteiz', 'A Coruña', 'Elche'] },
  { code: 'PT', name: 'Portugal', cities: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém', 'Queluz', 'Rio de Mouro', 'Barreiro', 'Aveiro', 'Corroios', 'Leiria', 'Faro', 'Évora', 'Portimão', 'Viseu'] },
  { code: 'IT', name: 'Italy', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Brescia', 'Parma', 'Taranto', 'Modena', 'Reggio Calabria'] },
  { code: 'CH', name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Schaffhausen', 'Fribourg', 'Chur', 'Neuchâtel', 'Vernier', 'Uster', 'Sion'] },
  { code: 'BE', name: 'Belgium', cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Hasselt', 'Kortrijk', 'Sint-Niklaas', 'Ostend', 'Tournai', 'Genk', 'Seraing', 'Roeselare'] },
  { code: 'AT', name: 'Austria', cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Steyr', 'Wiener Neustadt', 'Feldkirch', 'Bregenz', 'Leonding', 'Klosterneuburg', 'Baden', 'Wolfsberg', 'Leoben', 'Krems'] },
  { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong', 'Hobart', 'Geelong', 'Townsville', 'Cairns', 'Toowoomba', 'Darwin', 'Ballarat', 'Bendigo', 'Albury', 'Launceston'] },
  { code: 'NZ', name: 'New Zealand', cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier', 'Palmerston North', 'Dunedin', 'Rotorua', 'New Plymouth', 'Whangarei', 'Invercargill', 'Nelson', 'Hastings', 'Gisborne', 'Timaru', 'Blenheim', 'Taupo', 'Pukekohe', 'Masterton'] },
  { code: 'AE', name: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Kalba'] },
  { code: 'QA', name: 'Qatar', cities: ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Dukhan', 'Mesaieed', 'Al Shamal', 'Al Daayen', 'Al Sheehaniya'] },
  { code: 'SA', name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Abha', 'Tabuk', 'Buraydah', 'Khamis Mushait', 'Hail', 'Najran', 'Al Jubail', 'Yanbu', 'Al Kharj', 'Arar', 'Sakaka', 'Jizan', 'Dhahran'] },
  { code: 'CN', name: 'China', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xi\'an', 'Nanjing', 'Tianjin', 'Suzhou', 'Dongguan', 'Chongqing', 'Foshan', 'Shenyang', 'Qingdao', 'Zhengzhou', 'Changsha', 'Kunming', 'Dalian'] },
  { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata', 'Hamamatsu', 'Shizuoka', 'Sagamihara', 'Okayama'] },
  { code: 'KR', name: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang', 'Seongnam', 'Bucheon', 'Ansan', 'Anyang', 'Jeonju', 'Cheonan', 'Namyangju', 'Hwaseong', 'Gimhae', 'Pyeongtaek'] },
  { code: 'SG', name: 'Singapore', cities: ['Singapore', 'Jurong West', 'Tampines', 'Woodlands', 'Yishun', 'Ang Mo Kio', 'Hougang', 'Sengkang', 'Punggol', 'Pasir Ris', 'Choa Chu Kang', 'Bukit Batok', 'Bukit Panjang', 'Toa Payoh', 'Bishan', 'Serangoon', 'Clementi', 'Queenstown', 'Marine Parade', 'Bedok'] },
].sort((a, b) => a.name.localeCompare(b.name));

interface UnifiedRegistrationFormProps {
  showHeader?: boolean;
}

export function UnifiedRegistrationForm({ showHeader = true }: UnifiedRegistrationFormProps) {
  const [communityType, setCommunityType] = useState<'diaspora' | 'local'>('local');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    countryOfOrigin: '',
    countryOfResidence: '',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ipAddress: '',
    location: null as { country?: string; city?: string; region?: string; latitude?: number; longitude?: number } | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get available countries based on community type
  const availableCountries = communityType === 'local' ? globalSouthCountries : diasporaCountries;
  
  // Get available locations for selected country
  const selectedCountryData = availableCountries.find(c => c.code === selectedCountry);
  const availableLocations = selectedCountryData?.cities || [];

  // Get WhatsApp link based on community type
  const whatsappLink = getWhatsAppGroupLink(communityType);

  // Get IP and location data on component mount
  useEffect(() => {
    const getLocationData = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const locationJson = await locationResponse.json();
        setFormData(prev => ({
          ...prev,
          ipAddress: ipData.ip,
          location: {
            country: locationJson.country_name,
            city: locationJson.city,
            region: locationJson.region,
            latitude: locationJson.latitude,
            longitude: locationJson.longitude
          }
        }));
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    getLocationData();
  }, []);

  // Reset location when country changes
  useEffect(() => {
    setSelectedLocation('');
  }, [selectedCountry]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Validation
    if (!selectedCountry) {
      setErrorMessage('Please select a country');
      setIsSubmitting(false);
      return;
    }

    if (!selectedLocation) {
      setErrorMessage('Please select a location/city');
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData = {
        ...formData,
        countryOfResidence: selectedCountry,
        location: selectedLocation,
        timestamp: new Date().toISOString()
      };

      const payload = {
        name: updatedData.name,
        email: updatedData.email,
        whatsapp: updatedData.whatsapp,
        countryOfOrigin: updatedData.countryOfOrigin || selectedCountry,
        countryOfResidence: selectedCountry,
        ipAddress: updatedData.ipAddress || '',
        location: {
          city: selectedLocation,
          country: selectedCountryData?.name || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          coordinates: (formData.location?.latitude != null && formData.location?.longitude != null)
            ? { lat: formData.location.latitude, lng: formData.location.longitude }
            : undefined,
        },
        group: communityType,
      };

      await registrationService.submitRegistration(payload);
      
      setSubmitStatus('success');
      
      // Redirect to WhatsApp after successful submission
      setTimeout(() => {
        try {
          const newWindow = window.open(whatsappLink, '_blank');
          if (!newWindow) {
            window.location.href = whatsappLink;
          }
        } catch (error) {
          console.error('Error opening WhatsApp link:', error);
          window.location.href = whatsappLink;
        }
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(showHeader ? 'min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 sm:px-6 lg:px-8' : 'py-6 px-4 sm:px-6 lg:px-8')}>
      <div className="max-w-md mx-auto">
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={safeAnimate({ opacity: 1, y: 0 })}
            transition={safeTransition({ duration: 0.6 })}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full mr-3">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <div className="p-3 bg-secondary/10 rounded-full mr-3">
                <Users className="h-7 w-7 text-secondary" />
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Globe className="h-7 w-7 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Join Our Global Community
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow community members, stay updated on our initiatives, and be part of our growing network.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={safeAnimate({ opacity: 1, y: 0 })}
          transition={safeTransition({ duration: 0.6, delay: 0.2 })}
        >
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-foreground">
                Community Registration
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Fill out the form below to join our community. After submission, you'll be redirected to our WhatsApp group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Community Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="communityType" className="text-sm font-medium text-foreground">
                    I am… *
                  </Label>
                  <Select
                    value={communityType}
                    onValueChange={(value: 'diaspora' | 'local') => {
                      setCommunityType(value);
                      setSelectedCountry('');
                      setSelectedLocation('');
                    }}
                    required
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select where you are based" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Home-based (Global South)</SelectItem>
                      <SelectItem value="diaspora">Diasporan (Outside Global South)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-10 text-sm border-border/50 focus:border-primary focus:ring-primary/20"
                    disabled={submitStatus === 'success'}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-10 text-sm border-border/50 focus:border-primary focus:ring-primary/20"
                    disabled={submitStatus === 'success'}
                  />
                </div>

                {/* WhatsApp Field */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
                    WhatsApp Number *
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+1234567890"
                    required
                    className="h-10 text-sm border-border/50 focus:border-primary focus:ring-primary/20"
                    disabled={submitStatus === 'success'}
                  />
                </div>

                {/* Country of Origin (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="countryOfOrigin" className="text-sm font-medium text-foreground">
                    Country of Origin
                  </Label>
                  <Select
                    value={formData.countryOfOrigin}
                    onValueChange={(value) => handleInputChange('countryOfOrigin', value)}
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder="Select country of origin (optional)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {[...globalSouthCountries, ...diasporaCountries].sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country of Residence */}
                <div className="space-y-2">
                  <Label htmlFor="countryOfResidence" className="text-sm font-medium text-foreground">
                    Country of Residence *
                  </Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                    required
                  >
                    <SelectTrigger className="h-10 text-sm">
                      <SelectValue placeholder={`Select ${communityType === 'local' ? 'Global South' : 'Diaspora'} country`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availableCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location/City Selection */}
                {selectedCountry && (
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-foreground">
                      Location/City *
                    </Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                      required
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue placeholder="Select location/city" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {availableLocations.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Registration successful! Redirecting to WhatsApp...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium"
                  disabled={isSubmitting || submitStatus === 'success'}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Success! Redirecting...
                    </>
                  ) : (
                    <>
                      Submit & Join WhatsApp
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By submitting, you agree to join our WhatsApp community. You'll be redirected automatically after successful registration.
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

