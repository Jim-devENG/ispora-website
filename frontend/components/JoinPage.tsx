import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Section } from './layout/Section';
import { PageHeader } from './layout/PageHeader';
import { Globe, Users, Send, Loader2, CheckCircle } from 'lucide-react';
import { registrationService } from './services/registrationService';

// Import country/city lists from UnifiedRegistrationForm
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

interface JoinPageProps {
  onPageChange: (page: string) => void;
}

export function JoinPage({ onPageChange }: JoinPageProps) {
  const [diasporaFormData, setDiasporaFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryOfResidence: '',
    countryOfOrigin: '',
    selectedCountry: '',
    selectedLocation: '',
    linkedin: '',
    currentWork: '',
    contributeInterest: '',
    areasOfInterest: [] as string[],
    otherInterest: '',
    expectations: ''
  });

  const [localFormData, setLocalFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    selectedCountry: '',
    selectedLocation: '',
    state: '',
    ageRange: '',
    background: '',
    fieldOfStudy: '',
    interests: [] as string[],
    otherInterest: '',
    expectations: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'local' | 'diaspora' | ''>('');

  // Get available countries and cities based on tab
  const availableCountries = activeTab === 'local' ? globalSouthCountries : diasporaCountries;
  const selectedCountryData = activeTab === 'local' 
    ? globalSouthCountries.find(c => c.code === localFormData.selectedCountry)
    : diasporaCountries.find(c => c.code === diasporaFormData.selectedCountry);
  const availableLocations = selectedCountryData?.cities || [];

  const diasporaAreasOfInterest = [
    'Mentorship',
    'Career & Professional Development',
    'Volunteering',
    'Project Collaboration',
    'Policy & Governance',
    'Investment & Startup Support',
    'Events & Speaking Opportunities',
    'Community Building',
    'Technology & Innovation',
    'National Development Programs',
    'Youth Empowerment'
  ];

  const localInterests = [
    'Mentorship',
    'Leadership Development',
    'Career & Professional Growth',
    'Skill Acquisition / Training',
    'Internship & Job Opportunities',
    'Project Collaboration',
    'Volunteering',
    'Entrepreneurship Support',
    'Scholarships / Learning Resources',
    'Events, Webinars & Conferences',
    'Youth-led Initiatives Support'
  ];

  const handleDiasporaInputChange = (field: string, value: string | string[]) => {
    setDiasporaFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocalInputChange = (field: string, value: string | string[]) => {
    setLocalFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDiasporaCheckboxChange = (option: string, checked: boolean) => {
    setDiasporaFormData(prev => {
      const current = prev.areasOfInterest;
      if (checked) {
        return { ...prev, areasOfInterest: [...current, option] };
      } else {
        return { ...prev, areasOfInterest: current.filter(item => item !== option) };
      }
    });
  };

  const handleLocalCheckboxChange = (option: string, checked: boolean) => {
    setLocalFormData(prev => {
      const current = prev.interests;
      if (checked) {
        return { ...prev, interests: [...current, option] };
      } else {
        return { ...prev, interests: current.filter(item => item !== option) };
      }
    });
  };

  const handleDiasporaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Validation
    if (!diasporaFormData.selectedCountry) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get IP address
      let ipAddress = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        console.warn('Could not fetch IP address:', err);
      }

      // Get location data
      const selectedCountryData = diasporaCountries.find(c => c.code === diasporaFormData.selectedCountry);
      const locationData = {
        city: diasporaFormData.selectedLocation || '',
        country: selectedCountryData?.name || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      };

      const payload = {
        name: diasporaFormData.fullName,
        email: diasporaFormData.email,
        whatsapp: diasporaFormData.phone || diasporaFormData.email,
        countryOfOrigin: diasporaFormData.countryOfOrigin || diasporaFormData.selectedCountry,
        countryOfResidence: diasporaFormData.selectedCountry,
        ipAddress,
        location: locationData,
        group: 'diaspora' as const
      };

      await registrationService.submitRegistration(payload);
      setSubmitStatus('success');
      
      // Reset form after delay
      setTimeout(() => {
        setDiasporaFormData({
          fullName: '',
          email: '',
          phone: '',
          countryOfResidence: '',
          countryOfOrigin: '',
          selectedCountry: '',
          selectedLocation: '',
          linkedin: '',
          currentWork: '',
          contributeInterest: '',
          areasOfInterest: [],
          otherInterest: '',
          expectations: ''
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Validation
    if (!localFormData.selectedCountry) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get IP address
      let ipAddress = '';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        console.warn('Could not fetch IP address:', err);
      }

      // Get location data
      let locationData = { city: '', country: '', timezone: 'UTC' };
      try {
        const locationResponse = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        const locationJson = await locationResponse.json();
        locationData = {
          city: localFormData.selectedLocation || locationJson.city || '',
          country: globalSouthCountries.find(c => c.code === localFormData.selectedCountry)?.name || locationJson.country_name || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        };
      } catch (err) {
        console.warn('Could not fetch location data:', err);
        locationData = {
          city: localFormData.selectedLocation || '',
          country: globalSouthCountries.find(c => c.code === localFormData.selectedCountry)?.name || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        };
      }

      const payload = {
        name: localFormData.fullName,
        email: localFormData.email,
        whatsapp: localFormData.phone || localFormData.email, // Use email as fallback if no phone
        countryOfOrigin: localFormData.selectedCountry, // For local, origin is same as residence
        countryOfResidence: localFormData.selectedCountry,
        ipAddress,
        location: locationData,
        group: 'local' as const,
        // Additional detailed data (stored in a separate field if backend supports it)
        additionalData: {
          state: localFormData.state,
          ageRange: localFormData.ageRange,
          background: localFormData.background,
          fieldOfStudy: localFormData.fieldOfStudy,
          interests: localFormData.interests,
          otherInterest: localFormData.otherInterest,
          expectations: localFormData.expectations,
          selectedLocation: localFormData.selectedLocation
        }
      };

      await registrationService.submitRegistration(payload);
      setSubmitStatus('success');
      // Reset form after delay
      setTimeout(() => {
        setLocalFormData({
          fullName: '',
          email: '',
          phone: '',
          selectedCountry: '',
          selectedLocation: '',
          state: '',
          ageRange: '',
          background: '',
          fieldOfStudy: '',
          interests: [],
          otherInterest: '',
          expectations: ''
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <Section 
        className="pt-24 pb-12 sm:pt-32"
        style={{
          background: 'linear-gradient(135deg, hsl(220 100% 95%) 0%, hsl(220 100% 92%) 50%, hsl(220 67% 94%) 100%)'
        }}
      >
        <PageHeader
          title="Join the iSpora Network"
          description="Choose the pathway that best describes you: Local Community, Diaspora Network, or Partner Organization."
        />
      </Section>

      {/* Forms with Tabs */}
      <Section 
        className="relative"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 100% 94%) 50%, hsl(220 100% 96%) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* I am... Question */}
          <Card className="mb-8 shadow-lg border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label className="text-lg font-semibold">I am… *</Label>
                <Select
                  value={activeTab}
                  onValueChange={(value: 'local' | 'diaspora') => {
                    setActiveTab(value);
                    // Reset form data when switching
                    setDiasporaFormData(prev => ({ ...prev, selectedCountry: '', selectedLocation: '' }));
                    setLocalFormData(prev => ({ ...prev, selectedCountry: '', selectedLocation: '' }));
                  }}
                  required
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select where you are based" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Home-based (Global South)</SelectItem>
                    <SelectItem value="diaspora">Diasporan (Outside Global South)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Show form based on selection */}
          {activeTab && (
            <>
              {/* Diaspora Community Form */}
              {activeTab === 'diaspora' && (
              <Card className="shadow-xl border-primary/10">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="secondary">For citizens of the Global South living abroad</Badge>
                  </div>
                  <CardTitle className="text-2xl">Diaspora Community Form</CardTitle>
                  <CardDescription>
                    Join our global diaspora network and connect with opportunities to contribute to the Global South.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDiasporaSubmit} className="space-y-6">
                    {/* 1. Personal Information */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">1. Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="d-fullName">Full Name *</Label>
                          <Input
                            id="d-fullName"
                            value={diasporaFormData.fullName}
                            onChange={(e) => handleDiasporaInputChange('fullName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="d-email">Email Address *</Label>
                          <Input
                            id="d-email"
                            type="email"
                            value={diasporaFormData.email}
                            onChange={(e) => handleDiasporaInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="d-phone">Phone Number (optional)</Label>
                          <p className="text-sm text-muted-foreground">Include country code if outside your country of residence</p>
                          <Input
                            id="d-phone"
                            type="tel"
                            value={diasporaFormData.phone}
                            onChange={(e) => handleDiasporaInputChange('phone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="d-countryResidence">Country of Residence *</Label>
                          <Select
                            value={diasporaFormData.selectedCountry}
                            onValueChange={(value) => {
                              handleDiasporaInputChange('selectedCountry', value);
                              handleDiasporaInputChange('selectedLocation', '');
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country of residence" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {diasporaCountries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {diasporaFormData.selectedCountry && (
                          <div className="space-y-2">
                            <Label htmlFor="d-location">City (optional)</Label>
                            <Select
                              value={diasporaFormData.selectedLocation}
                              onValueChange={(value) => handleDiasporaInputChange('selectedLocation', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {diasporaCountries.find(c => c.code === diasporaFormData.selectedCountry)?.cities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="d-countryOrigin">Country of Origin (Home Country) *</Label>
                          <Select
                            value={diasporaFormData.countryOfOrigin}
                            onValueChange={(value) => handleDiasporaInputChange('countryOfOrigin', value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country of origin" />
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
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="d-linkedin">LinkedIn Profile (optional but recommended)</Label>
                          <Input
                            id="d-linkedin"
                            type="url"
                            value={diasporaFormData.linkedin}
                            onChange={(e) => handleDiasporaInputChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Your Background */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">2. Your Background</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="d-currentWork">What do you currently do? *</Label>
                          <p className="text-sm text-muted-foreground">(Job title, field of work, or area of expertise)</p>
                          <Input
                            id="d-currentWork"
                            value={diasporaFormData.currentWork}
                            onChange={(e) => handleDiasporaInputChange('currentWork', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Are you interested in contributing your experience or skills to initiatives back home? *</Label>
                          <RadioGroup
                            value={diasporaFormData.contributeInterest}
                            onValueChange={(value) => handleDiasporaInputChange('contributeInterest', value)}
                            required
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="d-contribute-yes" />
                              <Label htmlFor="d-contribute-yes" className="font-normal">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="d-contribute-no" />
                              <Label htmlFor="d-contribute-no" className="font-normal">No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="maybe" id="d-contribute-maybe" />
                              <Label htmlFor="d-contribute-maybe" className="font-normal">Maybe later</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* 3. Areas of Interest */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">3. Areas of Interest (Select All That Apply)</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {diasporaAreasOfInterest.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`d-${option}`}
                              checked={diasporaFormData.areasOfInterest.includes(option)}
                              onCheckedChange={(checked) => handleDiasporaCheckboxChange(option, checked as boolean)}
                            />
                            <Label htmlFor={`d-${option}`} className="text-sm font-normal cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="d-otherInterest">Other (please specify)</Label>
                        <Input
                          id="d-otherInterest"
                          value={diasporaFormData.otherInterest}
                          onChange={(e) => handleDiasporaInputChange('otherInterest', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 4. Expectations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">4. What are your expectations for joining our Diaspora Community? *</h3>
                      <div className="space-y-2">
                        <Label htmlFor="d-expectations">(Short answer) *</Label>
                        <Textarea
                          id="d-expectations"
                          value={diasporaFormData.expectations}
                          onChange={(e) => handleDiasporaInputChange('expectations', e.target.value)}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-medium"
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
                            Join the Diaspora Network
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Join the Diaspora Network
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              )}

              {/* Local Community Form */}
              {activeTab === 'local' && (
              <Card className="shadow-xl border-primary/10">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="secondary">For young people, youth leaders, students, and professionals living within the Global South</Badge>
                  </div>
                  <CardTitle className="text-2xl">Local Community Form</CardTitle>
                  <CardDescription>
                    Connect with opportunities, mentorship, training, and a growing ecosystem of change-makers across the Global South.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLocalSubmit} className="space-y-6">
                    {/* 1. Personal Information */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">1. Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="l-fullName">Full Name *</Label>
                          <Input
                            id="l-fullName"
                            value={localFormData.fullName}
                            onChange={(e) => handleLocalInputChange('fullName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="l-email">Email Address *</Label>
                          <Input
                            id="l-email"
                            type="email"
                            value={localFormData.email}
                            onChange={(e) => handleLocalInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="l-phone">Phone Number / WhatsApp Number *</Label>
                          <p className="text-sm text-muted-foreground">Include country code</p>
                          <Input
                            id="l-phone"
                            type="tel"
                            value={localFormData.phone}
                            onChange={(e) => handleLocalInputChange('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="l-country">Country *</Label>
                          <Select
                            value={localFormData.selectedCountry}
                            onValueChange={(value) => {
                              handleLocalInputChange('selectedCountry', value);
                              handleLocalInputChange('selectedLocation', '');
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {globalSouthCountries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {localFormData.selectedCountry && (
                          <div className="space-y-2">
                            <Label htmlFor="l-location">City (optional)</Label>
                            <Select
                              value={localFormData.selectedLocation}
                              onValueChange={(value) => handleLocalInputChange('selectedLocation', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {globalSouthCountries.find(c => c.code === localFormData.selectedCountry)?.cities.map((city) => (
                                  <SelectItem key={city} value={city}>
                                    {city}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="l-state">State / Region *</Label>
                          <Input
                            id="l-state"
                            value={localFormData.state}
                            onChange={(e) => handleLocalInputChange('state', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Age Range *</Label>
                          <RadioGroup
                            value={localFormData.ageRange}
                            onValueChange={(value) => handleLocalInputChange('ageRange', value)}
                            required
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="under18" id="l-age-under18" />
                              <Label htmlFor="l-age-under18" className="font-normal">Under 18</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="18-24" id="l-age-18-24" />
                              <Label htmlFor="l-age-18-24" className="font-normal">18-24</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="25-35" id="l-age-25-35" />
                              <Label htmlFor="l-age-25-35" className="font-normal">25-35</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="36+" id="l-age-36+" />
                              <Label htmlFor="l-age-36+" className="font-normal">36+</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* 2. Your Background */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">2. Your Background</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Are you a: *</Label>
                          <RadioGroup
                            value={localFormData.background}
                            onValueChange={(value) => handleLocalInputChange('background', value)}
                            required
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="student" id="l-bg-student" />
                              <Label htmlFor="l-bg-student" className="font-normal">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="graduate" id="l-bg-graduate" />
                              <Label htmlFor="l-bg-graduate" className="font-normal">Graduate</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="professional" id="l-bg-professional" />
                              <Label htmlFor="l-bg-professional" className="font-normal">Young Professional</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="leader" id="l-bg-leader" />
                              <Label htmlFor="l-bg-leader" className="font-normal">Youth Leader</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="volunteer" id="l-bg-volunteer" />
                              <Label htmlFor="l-bg-volunteer" className="font-normal">Community Volunteer</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="entrepreneur" id="l-bg-entrepreneur" />
                              <Label htmlFor="l-bg-entrepreneur" className="font-normal">Entrepreneur</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="l-bg-other" />
                              <Label htmlFor="l-bg-other" className="font-normal">Other</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="l-fieldOfStudy">Field of Study / Work / Skills *</Label>
                          <Input
                            id="l-fieldOfStudy"
                            value={localFormData.fieldOfStudy}
                            onChange={(e) => handleLocalInputChange('fieldOfStudy', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Interests */}
                    <div className="space-y-4 border-b pb-6">
                      <h3 className="text-lg font-semibold">3. What are you Interested in? (Select multiple)</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {localInterests.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`l-${option}`}
                              checked={localFormData.interests.includes(option)}
                              onCheckedChange={(checked) => handleLocalCheckboxChange(option, checked as boolean)}
                            />
                            <Label htmlFor={`l-${option}`} className="text-sm font-normal cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="l-otherInterest">Other (please specify)</Label>
                        <Input
                          id="l-otherInterest"
                          value={localFormData.otherInterest}
                          onChange={(e) => handleLocalInputChange('otherInterest', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 4. Expectations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">4. What are your expectations for joining our Local Community? *</h3>
                      <div className="space-y-2">
                        <Label htmlFor="l-expectations">(Short answer) *</Label>
                        <Textarea
                          id="l-expectations"
                          value={localFormData.expectations}
                          onChange={(e) => handleLocalInputChange('expectations', e.target.value)}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 text-base font-medium"
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
                            Join the Local Community
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Join the Local Community
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              )}
            </>
          )}
        </div>
      </Section>
    </div>
  );
}

