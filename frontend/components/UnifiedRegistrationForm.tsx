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

// Global South Countries (Local Community)
const globalSouthCountries = [
  // Africa
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Enugu', 'Aba', 'Warri'] },
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani', 'Ho', 'Koforidua'] },
  { code: 'KE', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale'] },
  { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg'] },
  { code: 'UG', name: 'Uganda', cities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Mbale', 'Masaka', 'Entebbe'] },
  { code: 'TZ', name: 'Tanzania', cities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Zanzibar', 'Mbeya', 'Tanga', 'Morogoro'] },
  { code: 'RW', name: 'Rwanda', cities: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Cyangugu', 'Byumba'] },
  { code: 'ET', name: 'Ethiopia', cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Awassa', 'Bahir Dar', 'Dessie', 'Jimma'] },
  { code: 'ZM', name: 'Zambia', cities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone', 'Kasama'] },
  { code: 'ZW', name: 'Zimbabwe', cities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo'] },
  { code: 'BW', name: 'Botswana', cities: ['Gaborone', 'Francistown', 'Molepolole', 'Serowe', 'Maun', 'Mogoditshane', 'Palapye', 'Selibe Phikwe'] },
  { code: 'NA', name: 'Namibia', cities: ['Windhoek', 'Walvis Bay', 'Swakopmund', 'Oshakati', 'Rundu', 'Katima Mulilo', 'Grootfontein', 'Keetmanshoop'] },
  { code: 'CI', name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man', 'Divo'] },
  { code: 'SN', name: 'Senegal', cities: ['Dakar', 'Thiès', 'Rufisque', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Touba', 'Mbour'] },
  { code: 'CM', name: 'Cameroon', cities: ['Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua', 'Buea', 'Kribi'] },
  { code: 'ML', name: 'Mali', cities: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao', 'Tombouctou'] },
  { code: 'AO', name: 'Angola', cities: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Lubango', 'Kuito', 'Malanje', 'Namibe'] },
  { code: 'DZ', name: 'Algeria', cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif'] },
  { code: 'MA', name: 'Morocco', cities: ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda'] },
  { code: 'TN', name: 'Tunisia', cities: ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa'] },
  { code: 'EG', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan'] },
  // Caribbean
  { code: 'JM', name: 'Jamaica', cities: ['Kingston', 'Montego Bay', 'Spanish Town', 'Portmore', 'Mandeville', 'Ocho Rios', 'Negril', 'May Pen'] },
  { code: 'TT', name: 'Trinidad and Tobago', cities: ['Port of Spain', 'San Fernando', 'Chaguanas', 'Arima', 'Couva', 'Point Fortin', 'Princes Town', 'Tunapuna'] },
  { code: 'BB', name: 'Barbados', cities: ['Bridgetown', 'Speightstown', 'Oistins', 'Holetown', 'The Crane', 'St. Lawrence', 'Worthing', 'Hastings'] },
  { code: 'GD', name: 'Grenada', cities: ['St. George\'s', 'Gouyave', 'Grenville', 'Victoria', 'Sauteurs', 'Hillsborough', 'Carriacou'] },
  { code: 'BS', name: 'Bahamas', cities: ['Nassau', 'Freeport', 'Marsh Harbour', 'George Town', 'Coopers Town', 'High Rock', 'Andros Town', 'Duncan Town'] },
  // Latin America
  { code: 'BR', name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba'] },
  { code: 'MX', name: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón'] },
  { code: 'AR', name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta'] },
  { code: 'CO', name: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Soledad', 'Ibagué'] },
  { code: 'PE', name: 'Peru', cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Huancayo'] },
  { code: 'CL', name: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca'] },
  { code: 'VE', name: 'Venezuela', cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Barcelona', 'Maturín'] },
  { code: 'EC', name: 'Ecuador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo'] },
  { code: 'GT', name: 'Guatemala', cities: ['Guatemala City', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'San Juan Sacatepéquez', 'Villa Canales', 'Petapa'] },
  { code: 'DO', name: 'Dominican Republic', cities: ['Santo Domingo', 'Santiago', 'La Romana', 'San Pedro de Macorís', 'San Francisco de Macorís', 'Puerto Plata', 'Bavaro', 'Punta Cana'] },
  // Asia (Global South)
  { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'] },
  { code: 'PK', name: 'Pakistan', cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Peshawar', 'Islamabad'] },
  { code: 'BD', name: 'Bangladesh', cities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Comilla', 'Barisal', 'Rangpur'] },
  { code: 'PH', name: 'Philippines', cities: ['Manila', 'Quezon City', 'Caloocan', 'Davao', 'Cebu', 'Zamboanga', 'Antipolo', 'Pasig'] },
  { code: 'VN', name: 'Vietnam', cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang'] },
  { code: 'TH', name: 'Thailand', cities: ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Udon Thani', 'Pak Kret', 'Khon Kaen'] },
  { code: 'ID', name: 'Indonesia', cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Palembang', 'Makassar', 'Tangerang'] },
  { code: 'MY', name: 'Malaysia', cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Kota Kinabalu'] },
  // Middle East (Global South)
  { code: 'IQ', name: 'Iraq', cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala', 'Sulaymaniyah', 'Kirkuk'] },
  { code: 'YE', name: 'Yemen', cities: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Dhamar', 'Al Mukalla', 'Sayyan'] },
  { code: 'JO', name: 'Jordan', cities: ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Wadi Al-Sir', 'Aqaba', 'Madaba', 'Salt'] },
  { code: 'LB', name: 'Lebanon', cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Jounieh', 'Zahle', 'Baalbek'] },
  { code: 'PS', name: 'Palestine', cities: ['Gaza', 'Hebron', 'Nablus', 'Ramallah', 'Jericho', 'Bethlehem', 'Jenin', 'Tulkarm'] },
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
  const whatsappLink = communityType === 'local' 
    ? 'https://chat.whatsapp.com/I9utNeip977H5k8oGW5KCy?mode=ems_copy_c'
    : 'https://chat.whatsapp.com/CVWXWSeSfuKFj5UFmj6ESL?mode=ems_copy_c';

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

